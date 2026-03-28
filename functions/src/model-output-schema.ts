import { z } from 'genkit';

import { EXERCISE_CATALOG } from '../../src/shared/types/exercise-catalog.js';
import {
  GENERATED_SESSION_TYPES,
  INTENSITY_METHODS,
  SELECTION_REASON_CODES,
  SESSION_GOALS,
  WORKOUT_BLOCK_TYPES,
} from '../../src/shared/types/generator-contract.js';
import type {
  GeneratedExerciseEntry,
  GeneratedWorkoutSession,
  WorkoutBlock,
} from '../../src/shared/types/generator-contract.js';
import type { ExerciseId } from '../../src/shared/types/exercise-catalog.js';

const ExerciseIdSchema = z.enum(Object.keys(EXERCISE_CATALOG) as [string, ...string[]]);
const IntensityMethodSchema = z.enum(INTENSITY_METHODS);
const SessionGoalSchema = z.enum(SESSION_GOALS);
const WorkoutBlockTypeSchema = z.enum(WORKOUT_BLOCK_TYPES);
const GeneratedSessionTypeSchema = z.enum(GENERATED_SESSION_TYPES);
const SelectionReasonCodeSchema = z.enum(SELECTION_REASON_CODES);
const TrainingLocationSchema = z.enum(['home', 'gym', 'street', 'park']);

const ExercisePrescriptionDraftSchema = z.object({
  set_count: z.number().int().positive().optional(),
  target_reps: z.union([z.number().int().positive(), z.array(z.number().int().positive()).min(1)]).optional(),
  intensity_method: IntensityMethodSchema,
  intensity_value: z.number().finite().optional(),
  tempo: z.string().optional(),
});

const GeneratedExerciseEntryDraftSchema = z.object({
  entry_id: z.string().min(1),
  exercise_id: ExerciseIdSchema,
  prescription: ExercisePrescriptionDraftSchema,
  selection_reason: z
    .object({
      reason_codes: z.array(SelectionReasonCodeSchema).min(1),
      reason_text: z.string().optional(),
    })
    .optional(),
  coach_notes: z.string().optional(),
});

const WorkoutBlockDraftSchema = z.object({
  block_id: z.string().min(1),
  block_type: WorkoutBlockTypeSchema,
  order_index: z.number().int().nonnegative(),
  title: z.string().optional(),
  exercises: z.array(GeneratedExerciseEntryDraftSchema).min(1),
  rest_seconds_after_exercise: z.number().int().positive().optional(),
  rest_seconds_after_block: z.number().int().positive().optional(),
  rest_seconds_after_round: z.number().int().positive().optional(),
  rounds: z.number().int().positive().optional(),
  duration_seconds: z.number().int().positive().optional(),
  interval_seconds: z.number().int().positive().optional(),
});

export const GeneratedWorkoutSessionDraftSchema = z.object({
  session_id: z.string().min(1),
  session_type: GeneratedSessionTypeSchema,
  location: TrainingLocationSchema,
  session_goal: SessionGoalSchema,
  estimated_duration_minutes: z.number().int().positive(),
  summary: z.string().optional(),
  session_notes: z.string().optional(),
  blocks: z.array(WorkoutBlockDraftSchema).min(1),
});

export type GeneratedWorkoutSessionDraft = z.infer<typeof GeneratedWorkoutSessionDraftSchema>;

function coerceExerciseEntry(
  entry: GeneratedWorkoutSessionDraft['blocks'][number]['exercises'][number]
): GeneratedExerciseEntry {
  return {
    ...entry,
    exercise_id: entry.exercise_id as ExerciseId,
  };
}

function requirePositiveInteger(value: number | undefined, fieldName: string, blockType: string) {
  if (!value || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${blockType} blocks require ${fieldName}.`);
  }

  return value;
}

function coerceWorkoutBlock(draftBlock: GeneratedWorkoutSessionDraft['blocks'][number]): WorkoutBlock {
  const blockBase = {
    block_id: draftBlock.block_id,
    block_type: draftBlock.block_type,
    order_index: draftBlock.order_index,
    title: draftBlock.title,
  } as const;

  switch (draftBlock.block_type) {
    case 'straight_sets':
      if (draftBlock.exercises.length !== 1) {
        throw new Error('straight_sets blocks require exactly one exercise.');
      }

      return {
        ...blockBase,
        block_type: 'straight_sets',
        exercise: coerceExerciseEntry(draftBlock.exercises[0]),
        rest_seconds_after_exercise:
          draftBlock.rest_seconds_after_exercise ?? draftBlock.rest_seconds_after_block ?? 60,
      };
    case 'superset':
      if (draftBlock.exercises.length !== 2) {
        throw new Error('superset blocks require exactly two exercises.');
      }

      return {
        ...blockBase,
        block_type: 'superset',
        exercises: [
          coerceExerciseEntry(draftBlock.exercises[0]),
          coerceExerciseEntry(draftBlock.exercises[1]),
        ],
        rest_seconds_after_block: requirePositiveInteger(
          draftBlock.rest_seconds_after_block ?? draftBlock.rest_seconds_after_exercise,
          'rest_seconds_after_block',
          'superset'
        ),
      };
    case 'triset':
      if (draftBlock.exercises.length !== 3) {
        throw new Error('triset blocks require exactly three exercises.');
      }

      return {
        ...blockBase,
        block_type: 'triset',
        exercises: [
          coerceExerciseEntry(draftBlock.exercises[0]),
          coerceExerciseEntry(draftBlock.exercises[1]),
          coerceExerciseEntry(draftBlock.exercises[2]),
        ],
        rest_seconds_after_block: requirePositiveInteger(
          draftBlock.rest_seconds_after_block ?? draftBlock.rest_seconds_after_exercise,
          'rest_seconds_after_block',
          'triset'
        ),
      };
    case 'circuit':
      if (!draftBlock.rounds && !draftBlock.duration_seconds) {
        throw new Error('circuit blocks require rounds or duration_seconds.');
      }

      const circuitBase = {
        ...blockBase,
        block_type: 'circuit',
        exercises: draftBlock.exercises.map((entry) => coerceExerciseEntry(entry)),
        rest_seconds_after_round: draftBlock.rest_seconds_after_round,
      } as const;

      if (draftBlock.duration_seconds) {
        return {
          ...circuitBase,
          duration_seconds: draftBlock.duration_seconds,
          rounds: draftBlock.rounds,
        };
      }

      return {
        ...circuitBase,
        rounds: requirePositiveInteger(draftBlock.rounds, 'rounds', 'circuit'),
      };
    case 'emom':
      return {
        ...blockBase,
        block_type: 'emom',
        exercises: draftBlock.exercises.map((entry) => coerceExerciseEntry(entry)),
        duration_seconds: requirePositiveInteger(
          draftBlock.duration_seconds,
          'duration_seconds',
          'emom'
        ),
        interval_seconds: 60,
      };
    default:
      throw new Error(`Unsupported block type: ${String(draftBlock.block_type)}`);
  }
}

export function coerceDraftToGeneratedWorkoutSession(
  draft: GeneratedWorkoutSessionDraft
): GeneratedWorkoutSession {
  return {
    session_id: draft.session_id,
    session_type: draft.session_type,
    location: draft.location,
    session_goal: draft.session_goal,
    estimated_duration_minutes: draft.estimated_duration_minutes,
    summary: draft.summary,
    session_notes: draft.session_notes,
    blocks: draft.blocks.map((block) => coerceWorkoutBlock(block)),
  };
}
