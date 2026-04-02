import {
  GENERATED_SESSION_TYPES,
  GenerateWorkoutSessionInput,
  GeneratedExerciseEntry,
  GeneratedWorkoutSession,
  INTENSITY_METHODS,
  SESSION_GOALS,
  SELECTION_REASON_CODES,
  SelectionReason,
  WORKOUT_BLOCK_TYPES,
  WorkoutBlock,
  WorkoutBlockType,
} from '../types/generator-contract';
import {
  CONTEXT_CAPABILITY_IDS,
  ContextProfileLocation,
  HOME_EQUIPMENT_IDS,
  TrainingLocation,
} from '../types/workout-context';
import {
  UserProfile,
} from '../types/user-profile';
import { EffectiveCapabilityId, EXERCISE_CATALOG, ExerciseId } from '../types/exercise-catalog';
import {
  findCompatibleExerciseReplacement,
  getAvailableCapabilitiesForWorkoutContext,
  getIncompatibleRequiredCapabilities,
} from './exercise-compatibility';

type GeneratorProfileSnapshot = Pick<
  UserProfile,
  'experienceLevel' | 'homeEquipment' | 'contextProfiles'
>;

export interface BuildGenerateWorkoutSessionInputParams {
  requestId: string;
  location: TrainingLocation;
  profile: GeneratorProfileSnapshot;
  preferredBlockTypes: WorkoutBlockType[];
  durationMinutes: number;
  sessionGoal: GenerateWorkoutSessionInput['session_goal'];
}

export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors: string[];
    };

export type SanitizationRepair =
  | {
      type: 'exercise_replaced';
      block_id: string;
      entry_id: string;
      original_exercise_id: ExerciseId;
      replacement_exercise_id: ExerciseId;
      missing_capabilities: EffectiveCapabilityId[];
    }
  | {
      type: 'block_removed';
      block_id: string;
      reason: 'no_compatible_replacement';
      affected_exercise_ids: ExerciseId[];
    };

export type SanitizationResult =
  | {
      success: true;
      data: GeneratedWorkoutSession;
      repairs: SanitizationRepair[];
    }
  | {
      success: false;
      errors: string[];
      repairs: SanitizationRepair[];
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  return value === null ? undefined : value;
}

function normalizeGeneratedExerciseEntryTransport(value: unknown): unknown {
  if (!isRecord(value)) {
    return value;
  }

  const prescription = isRecord(value.prescription)
    ? {
        ...value.prescription,
        set_count: nullToUndefined(value.prescription.set_count as number | null | undefined),
        target_reps: nullToUndefined(
          value.prescription.target_reps as number | number[] | null | undefined
        ),
        intensity_value: nullToUndefined(
          value.prescription.intensity_value as number | null | undefined
        ),
        tempo: nullToUndefined(value.prescription.tempo as string | null | undefined),
      }
    : value.prescription;

  const selectionReason = isRecord(value.selection_reason)
    ? {
        ...value.selection_reason,
        reason_text: nullToUndefined(
          value.selection_reason.reason_text as string | null | undefined
        ),
      }
    : value.selection_reason;

  return {
    ...value,
    prescription,
    selection_reason: nullToUndefined(selectionReason as Record<string, unknown> | null | undefined),
    coach_notes: nullToUndefined(value.coach_notes as string | null | undefined),
  };
}

function normalizeWorkoutBlockTransport(value: unknown): unknown {
  if (!isRecord(value)) {
    return value;
  }

  return {
    ...value,
    title: nullToUndefined(value.title as string | null | undefined),
    rest_seconds_after_exercise: nullToUndefined(
      value.rest_seconds_after_exercise as number | null | undefined
    ),
    rest_seconds_after_block: nullToUndefined(
      value.rest_seconds_after_block as number | null | undefined
    ),
    rest_seconds_after_round: nullToUndefined(
      value.rest_seconds_after_round as number | null | undefined
    ),
    rounds: nullToUndefined(value.rounds as number | null | undefined),
    duration_seconds: nullToUndefined(value.duration_seconds as number | null | undefined),
    interval_seconds: nullToUndefined(value.interval_seconds as number | null | undefined),
    exercise: value.exercise
      ? normalizeGeneratedExerciseEntryTransport(value.exercise)
      : value.exercise,
    exercises: Array.isArray(value.exercises)
      ? value.exercises.map((entry) => normalizeGeneratedExerciseEntryTransport(entry))
      : value.exercises,
  };
}

function normalizeGeneratedWorkoutSessionTransport(value: unknown): unknown {
  if (!isRecord(value)) {
    return value;
  }

  return {
    ...value,
    summary: nullToUndefined(value.summary as string | null | undefined),
    session_notes: nullToUndefined(value.session_notes as string | null | undefined),
    blocks: Array.isArray(value.blocks)
      ? value.blocks.map((block) => normalizeWorkoutBlockTransport(block))
      : value.blocks,
  };
}

function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isPositiveNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isPositiveInteger(value: unknown) {
  return Number.isInteger(value) && isPositiveNumber(value);
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === 'string';
}

function isIncludedIn<T extends readonly string[]>(value: unknown, catalog: T): value is T[number] {
  return typeof value === 'string' && catalog.includes(value as T[number]);
}

function validateHomeEquipment(homeEquipment: unknown, errors: string[], path: string) {
  if (!isRecord(homeEquipment)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  Object.keys(homeEquipment).forEach((key) => {
    if (!HOME_EQUIPMENT_IDS.includes(key as (typeof HOME_EQUIPMENT_IDS)[number])) {
      errors.push(`${path}.${key} is not a supported home equipment id.`);
      return;
    }

    const equipmentValue = homeEquipment[key];

    if (!isRecord(equipmentValue)) {
      errors.push(`${path}.${key} must be an object.`);
    }
  });
}

function validateCapabilityArray(
  value: unknown,
  allowedCapabilities: readonly string[],
  errors: string[],
  path: string,
  options: { allowEmpty: boolean }
) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return;
  }

  if (!options.allowEmpty && value.length === 0) {
    errors.push(`${path} must not be empty.`);
  }

  value.forEach((entry, index) => {
    if (!isIncludedIn(entry, allowedCapabilities)) {
      errors.push(`${path}[${index}] is not a supported capability.`);
    }
  });
}

function validateTargetReps(value: unknown, errors: string[], path: string) {
  if (value === undefined) {
    return;
  }

  if (isPositiveInteger(value)) {
    return;
  }

  if (Array.isArray(value) && value.length > 0 && value.every((entry) => isPositiveInteger(entry))) {
    return;
  }

  errors.push(`${path} must be a positive integer or a non-empty array of positive integers.`);
}

function validatePrescription(value: unknown, errors: string[], path: string) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  if (value.set_count !== undefined && !isPositiveInteger(value.set_count)) {
    errors.push(`${path}.set_count must be a positive integer when present.`);
  }

  validateTargetReps(value.target_reps, errors, `${path}.target_reps`);

  if (!isIncludedIn(value.intensity_method, INTENSITY_METHODS)) {
    errors.push(`${path}.intensity_method must be a supported intensity method.`);
  }

  if (value.intensity_value !== undefined && !isFiniteNumber(value.intensity_value)) {
    errors.push(`${path}.intensity_value must be a finite number when present.`);
  }

  if (value.tempo !== undefined && typeof value.tempo !== 'string') {
    errors.push(`${path}.tempo must be a string when present.`);
  }
}

function validateSelectionReason(value: unknown, errors: string[], path: string) {
  if (value === undefined) {
    return;
  }

  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  if (!Array.isArray(value.reason_codes) || value.reason_codes.length === 0) {
    errors.push(`${path}.reason_codes must be a non-empty array.`);
  } else {
    value.reason_codes.forEach((entry, index) => {
      if (!isIncludedIn(entry, SELECTION_REASON_CODES)) {
        errors.push(`${path}.reason_codes[${index}] is not a supported reason code.`);
      }
    });
  }

  if (value.reason_text !== undefined && typeof value.reason_text !== 'string') {
    errors.push(`${path}.reason_text must be a string when present.`);
  }
}

function validateGeneratedExerciseEntry(value: unknown, errors: string[], path: string) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  if (!isNonEmptyString(value.entry_id)) {
    errors.push(`${path}.entry_id must be a non-empty string.`);
  }

  if (
    !isIncludedIn(value.exercise_id, Object.keys(EXERCISE_CATALOG) as (keyof typeof EXERCISE_CATALOG)[])
  ) {
    errors.push(`${path}.exercise_id must be a canonical exercise id.`);
  }

  validatePrescription(value.prescription, errors, `${path}.prescription`);
  validateSelectionReason(value.selection_reason, errors, `${path}.selection_reason`);

  if (value.coach_notes !== undefined && typeof value.coach_notes !== 'string') {
    errors.push(`${path}.coach_notes must be a string when present.`);
  }
}

function validateBlockBase(value: Record<string, unknown>, errors: string[], path: string) {
  if (!isNonEmptyString(value.block_id)) {
    errors.push(`${path}.block_id must be a non-empty string.`);
  }

  if (!isIncludedIn(value.block_type, WORKOUT_BLOCK_TYPES)) {
    errors.push(`${path}.block_type must be a supported block type.`);
  }

  if (!Number.isInteger(value.order_index) || (value.order_index as number) < 0) {
    errors.push(`${path}.order_index must be a non-negative integer.`);
  }

  if (!isOptionalString(value.title)) {
    errors.push(`${path}.title must be a string when present.`);
  }
}

function validateExerciseArray(
  value: unknown,
  expectedLength: number | null,
  errors: string[],
  path: string
) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return;
  }

  if (expectedLength !== null && value.length !== expectedLength) {
    errors.push(`${path} must contain exactly ${expectedLength} exercises.`);
  }

  if (value.length === 0) {
    errors.push(`${path} must contain at least one exercise.`);
  }

  value.forEach((entry, index) => {
    validateGeneratedExerciseEntry(entry, errors, `${path}[${index}]`);
  });
}

function validateWorkoutBlock(value: unknown, errors: string[], path: string) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  validateBlockBase(value, errors, path);

  if (!isIncludedIn(value.block_type, WORKOUT_BLOCK_TYPES)) {
    return;
  }

  switch (value.block_type) {
    case 'straight_sets':
      validateGeneratedExerciseEntry(value.exercise, errors, `${path}.exercise`);
      if (
        value.rest_seconds_after_exercise !== undefined &&
        !isPositiveInteger(value.rest_seconds_after_exercise)
      ) {
        errors.push(`${path}.rest_seconds_after_exercise must be a positive integer when present.`);
      }
      break;
    case 'superset':
      validateExerciseArray(value.exercises, 2, errors, `${path}.exercises`);
      if (!isPositiveInteger(value.rest_seconds_after_block)) {
        errors.push(`${path}.rest_seconds_after_block must be a positive integer.`);
      }
      break;
    case 'triset':
      validateExerciseArray(value.exercises, 3, errors, `${path}.exercises`);
      if (!isPositiveInteger(value.rest_seconds_after_block)) {
        errors.push(`${path}.rest_seconds_after_block must be a positive integer.`);
      }
      break;
    case 'circuit':
      validateExerciseArray(value.exercises, null, errors, `${path}.exercises`);
      if (value.rounds === undefined && value.duration_seconds === undefined) {
        errors.push(`${path} must include rounds or duration_seconds.`);
      }
      if (value.rounds !== undefined && !isPositiveInteger(value.rounds)) {
        errors.push(`${path}.rounds must be a positive integer when present.`);
      }
      if (value.duration_seconds !== undefined && !isPositiveInteger(value.duration_seconds)) {
        errors.push(`${path}.duration_seconds must be a positive integer when present.`);
      }
      if (
        value.rest_seconds_after_round !== undefined &&
        !isPositiveInteger(value.rest_seconds_after_round)
      ) {
        errors.push(`${path}.rest_seconds_after_round must be a positive integer when present.`);
      }
      break;
    case 'emom':
      validateExerciseArray(value.exercises, null, errors, `${path}.exercises`);
      if (!isPositiveInteger(value.duration_seconds)) {
        errors.push(`${path}.duration_seconds must be a positive integer.`);
      }
      if (value.interval_seconds !== 60) {
        errors.push(`${path}.interval_seconds must be exactly 60.`);
      }
      break;
    default:
      break;
  }
}

function buildValidationResult<T>(errors: string[], data: T): ValidationResult<T> {
  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data,
  };
}

export function buildGenerateWorkoutSessionInput({
  requestId,
  location,
  profile,
  preferredBlockTypes,
  durationMinutes,
  sessionGoal,
}: BuildGenerateWorkoutSessionInputParams): GenerateWorkoutSessionInput {
  const contextCapabilities =
    location === 'home'
      ? undefined
      : profile.contextProfiles[location as ContextProfileLocation]?.enabledCapabilities;
  const equipmentProfile =
    contextCapabilities === undefined
      ? {
          home_equipment: profile.homeEquipment,
        }
      : {
          home_equipment: profile.homeEquipment,
          context_capabilities: contextCapabilities,
        };

  return {
    request_id: requestId,
    location,
    experience_level: profile.experienceLevel,
    available_capabilities: getAvailableCapabilitiesForWorkoutContext({
      location,
      homeEquipment: profile.homeEquipment,
      contextCapabilities,
    }),
    preferred_block_types: preferredBlockTypes,
    duration_minutes: durationMinutes,
    session_goal: sessionGoal,
    equipment_profile: equipmentProfile,
  };
}

export function validateGenerateWorkoutSessionInput(
  value: unknown
): ValidationResult<GenerateWorkoutSessionInput> {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return {
      success: false,
      errors: ['GenerateWorkoutSessionInput must be an object.'],
    };
  }

  if (!isNonEmptyString(value.request_id)) {
    errors.push('request_id must be a non-empty string.');
  }

  if (!isIncludedIn(value.location, ['home', 'gym', 'street', 'park'] as const)) {
    errors.push('location must be a supported training location.');
  }

  if (!isIncludedIn(value.experience_level, ['beginner', 'intermediate', 'advanced'] as const)) {
    errors.push('experience_level must be a supported experience level.');
  }

  validateCapabilityArray(
    value.available_capabilities,
    [...CONTEXT_CAPABILITY_IDS, 'bodyweight'] as const,
    errors,
    'available_capabilities',
    { allowEmpty: false }
  );

  validateCapabilityArray(
    value.preferred_block_types,
    WORKOUT_BLOCK_TYPES,
    errors,
    'preferred_block_types',
    { allowEmpty: false }
  );

  if (!isPositiveInteger(value.duration_minutes)) {
    errors.push('duration_minutes must be a positive integer.');
  }

  if (!isIncludedIn(value.session_goal, SESSION_GOALS)) {
    errors.push('session_goal must be a supported session goal.');
  }

  if (!isRecord(value.equipment_profile)) {
    errors.push('equipment_profile must be an object.');
  } else {
    validateHomeEquipment(value.equipment_profile.home_equipment, errors, 'equipment_profile.home_equipment');

    if (
      value.equipment_profile.context_capabilities !== undefined &&
      value.equipment_profile.context_capabilities !== null
    ) {
      validateCapabilityArray(
        value.equipment_profile.context_capabilities,
        [...CONTEXT_CAPABILITY_IDS, 'bodyweight'] as const,
        errors,
        'equipment_profile.context_capabilities',
        { allowEmpty: true }
      );
    }
  }

  return buildValidationResult(errors, value as unknown as GenerateWorkoutSessionInput);
}

export function validateGeneratedWorkoutSession(
  value: unknown
): ValidationResult<GeneratedWorkoutSession> {
  const errors: string[] = [];
  const normalizedValue = normalizeGeneratedWorkoutSessionTransport(value);

  if (!isRecord(normalizedValue)) {
    return {
      success: false,
      errors: ['GeneratedWorkoutSession must be an object.'],
    };
  }

  if (!isNonEmptyString(normalizedValue.session_id)) {
    errors.push('session_id must be a non-empty string.');
  }

  if (!isIncludedIn(normalizedValue.session_type, GENERATED_SESSION_TYPES)) {
    errors.push('session_type must be a supported generated session type.');
  }

  if (!isIncludedIn(normalizedValue.location, ['home', 'gym', 'street', 'park'] as const)) {
    errors.push('location must be a supported training location.');
  }

  if (!isIncludedIn(normalizedValue.session_goal, SESSION_GOALS)) {
    errors.push('session_goal must be a supported session goal.');
  }

  if (!isPositiveInteger(normalizedValue.estimated_duration_minutes)) {
    errors.push('estimated_duration_minutes must be a positive integer.');
  }

  if (!isOptionalString(normalizedValue.summary)) {
    errors.push('summary must be a string when present.');
  }

  if (!isOptionalString(normalizedValue.session_notes)) {
    errors.push('session_notes must be a string when present.');
  }

  if (!Array.isArray(normalizedValue.blocks) || normalizedValue.blocks.length === 0) {
    errors.push('blocks must be a non-empty array.');
  } else {
    normalizedValue.blocks.forEach((block, index) => {
      validateWorkoutBlock(block, errors, `blocks[${index}]`);
    });
  }

  return buildValidationResult(errors, normalizedValue as unknown as GeneratedWorkoutSession);
}

export function isValidGeneratedWorkoutSession(value: unknown): value is GeneratedWorkoutSession {
  return validateGeneratedWorkoutSession(value).success;
}

function appendFitsEquipmentSelectionReason(
  selectionReason?: SelectionReason
): SelectionReason {
  const reasonCodes = selectionReason?.reason_codes ?? [];

  return {
    reason_codes: reasonCodes.includes('fits_equipment')
      ? reasonCodes
      : [...reasonCodes, 'fits_equipment'],
    reason_text: selectionReason?.reason_text,
  };
}

function sanitizeExerciseEntry(
  entry: GeneratedExerciseEntry,
  availableCapabilities: EffectiveCapabilityId[],
  blockId: string,
  excludedExerciseIds: ExerciseId[] = []
):
  | {
      success: true;
      data: GeneratedExerciseEntry;
      repairs: SanitizationRepair[];
    }
  | {
      success: false;
      missingCapabilities: EffectiveCapabilityId[];
    } {
  const missingCapabilities = getIncompatibleRequiredCapabilities(
    entry.exercise_id,
    availableCapabilities
  );
  const isExcludedInBlock = excludedExerciseIds.includes(entry.exercise_id);

  if (missingCapabilities.length === 0 && !isExcludedInBlock) {
    return {
      success: true,
      data: entry,
      repairs: [],
    };
  }

  const replacement = findCompatibleExerciseReplacement(
    entry.exercise_id,
    availableCapabilities,
    excludedExerciseIds
  );

  if (!replacement) {
    return {
      success: false,
      missingCapabilities,
    };
  }

  return {
    success: true,
    data: {
      ...entry,
      exercise_id: replacement.id,
      selection_reason: appendFitsEquipmentSelectionReason(entry.selection_reason),
    },
    repairs: [
      {
        type: 'exercise_replaced',
        block_id: blockId,
        entry_id: entry.entry_id,
        original_exercise_id: entry.exercise_id,
        replacement_exercise_id: replacement.id,
        missing_capabilities: missingCapabilities,
      },
    ],
  };
}

function sanitizeExerciseArrayBlock(
  block: Extract<
    WorkoutBlock,
    { block_type: 'superset' | 'triset' | 'circuit' | 'emom' }
  >,
  availableCapabilities: EffectiveCapabilityId[]
):
  | {
      success: true;
      data: Extract<
        WorkoutBlock,
        { block_type: 'superset' | 'triset' | 'circuit' | 'emom' }
      >;
      repairs: SanitizationRepair[];
    }
  | {
      success: false;
      repair: SanitizationRepair;
    } {
  const sanitizedExercises: GeneratedExerciseEntry[] = [];
  const repairs: SanitizationRepair[] = [];

  for (const [index, entry] of block.exercises.entries()) {
    const siblingExerciseIds = block.exercises
      .filter((_, siblingIndex) => siblingIndex !== index)
      .map((candidate) => candidate.exercise_id);

    const sanitizedEntry = sanitizeExerciseEntry(entry, availableCapabilities, block.block_id, [
      ...siblingExerciseIds,
      ...sanitizedExercises.map((candidate) => candidate.exercise_id),
    ]);

    if (!sanitizedEntry.success) {
      return {
        success: false,
        repair: {
          type: 'block_removed',
          block_id: block.block_id,
          reason: 'no_compatible_replacement',
          affected_exercise_ids: block.exercises.map((candidate) => candidate.exercise_id),
        },
      };
    }

    sanitizedExercises.push(sanitizedEntry.data);
    repairs.push(...sanitizedEntry.repairs);
  }

  if (block.block_type === 'superset') {
    return {
      success: true,
      data: {
        ...block,
        exercises: [
          sanitizedExercises[0] as GeneratedExerciseEntry,
          sanitizedExercises[1] as GeneratedExerciseEntry,
        ],
      },
      repairs,
    };
  }

  if (block.block_type === 'triset') {
    return {
      success: true,
      data: {
        ...block,
        exercises: [
          sanitizedExercises[0] as GeneratedExerciseEntry,
          sanitizedExercises[1] as GeneratedExerciseEntry,
          sanitizedExercises[2] as GeneratedExerciseEntry,
        ],
      },
      repairs,
    };
  }

  return {
    success: true,
    data: {
      ...block,
      exercises: sanitizedExercises,
    },
    repairs,
  };
}

function sanitizeWorkoutBlock(
  block: WorkoutBlock,
  availableCapabilities: EffectiveCapabilityId[]
):
  | {
      success: true;
      data: WorkoutBlock;
      repairs: SanitizationRepair[];
    }
  | {
      success: false;
      repair: SanitizationRepair;
    } {
  if (block.block_type === 'straight_sets') {
    const sanitizedExercise = sanitizeExerciseEntry(
      block.exercise,
      availableCapabilities,
      block.block_id
    );

    if (!sanitizedExercise.success) {
      return {
        success: false,
        repair: {
          type: 'block_removed',
          block_id: block.block_id,
          reason: 'no_compatible_replacement',
          affected_exercise_ids: [block.exercise.exercise_id],
        },
      };
    }

    return {
      success: true,
      data: {
        ...block,
        exercise: sanitizedExercise.data,
      },
      repairs: sanitizedExercise.repairs,
    };
  }

  return sanitizeExerciseArrayBlock(block, availableCapabilities);
}

export function sanitizeGeneratedWorkoutSession(
  session: GeneratedWorkoutSession,
  availableCapabilities: EffectiveCapabilityId[]
): SanitizationResult {
  const structuralValidation = validateGeneratedWorkoutSession(session);

  if (!structuralValidation.success) {
    return {
      success: false,
      errors: structuralValidation.errors,
      repairs: [],
    };
  }

  const sanitizedBlocks: WorkoutBlock[] = [];
  const repairs: SanitizationRepair[] = [];

  for (const block of session.blocks) {
    const sanitizedBlock = sanitizeWorkoutBlock(block, availableCapabilities);

    if (!sanitizedBlock.success) {
      repairs.push(sanitizedBlock.repair);
      continue;
    }

    sanitizedBlocks.push(sanitizedBlock.data);
    repairs.push(...sanitizedBlock.repairs);
  }

  if (sanitizedBlocks.length === 0) {
    return {
      success: false,
      errors: ['No usable blocks remain after sanitization.'],
      repairs,
    };
  }

  const sanitizedSession: GeneratedWorkoutSession = {
    ...session,
    blocks: sanitizedBlocks,
  };

  const finalValidation = validateGeneratedWorkoutSession(sanitizedSession);

  if (!finalValidation.success) {
    return {
      success: false,
      errors: finalValidation.errors,
      repairs,
    };
  }

  return {
    success: true,
    data: sanitizedSession,
    repairs,
  };
}
