import { ExperienceLevel, HomeEquipment, TrainingLocation } from './user-profile';
import { EffectiveCapabilityId, ExerciseId } from './exercise-catalog';

export const SESSION_GOALS = [
  'strength',
  'hypertrophy',
  'conditioning',
  'skill',
  'general_fitness',
  'fat_loss',
] as const;

export type SessionGoal = (typeof SESSION_GOALS)[number];

export const WORKOUT_BLOCK_TYPES = [
  'straight_sets',
  'superset',
  'triset',
  'circuit',
  'emom',
] as const;

export type WorkoutBlockType = (typeof WORKOUT_BLOCK_TYPES)[number];

export const INTENSITY_METHODS = [
  'rir',
  'rpe',
  'load_kg',
  'percentage_1rm',
  'bodyweight',
  'duration_seconds',
] as const;

export type IntensityMethod = (typeof INTENSITY_METHODS)[number];

export const SELECTION_REASON_CODES = [
  'matches_goal',
  'fits_location',
  'fits_equipment',
  'matches_experience',
  'balances_session',
  'progression_choice',
  'fatigue_management',
  'time_efficient',
] as const;

export type SelectionReasonCode = (typeof SELECTION_REASON_CODES)[number];

export const GENERATED_SESSION_TYPES = ['generated_ephemeral'] as const;

export type GeneratedSessionType = (typeof GENERATED_SESSION_TYPES)[number];

export interface SelectionReason {
  reason_codes: SelectionReasonCode[];
  reason_text?: string;
}

export interface ExercisePrescription {
  set_count?: number;
  target_reps?: number | number[];
  intensity_method: IntensityMethod;
  intensity_value?: number;
  tempo?: string;
}

export interface GeneratedExerciseEntry {
  entry_id: string;
  exercise_id: ExerciseId;
  prescription: ExercisePrescription;
  selection_reason?: SelectionReason;
  coach_notes?: string;
}

export interface WorkoutBlockBase {
  block_id: string;
  block_type: WorkoutBlockType;
  order_index: number;
  title?: string;
}

export interface StraightSetsBlock extends WorkoutBlockBase {
  block_type: 'straight_sets';
  exercise: GeneratedExerciseEntry;
  rest_seconds_after_exercise?: number;
}

export interface SupersetBlock extends WorkoutBlockBase {
  block_type: 'superset';
  exercises: [GeneratedExerciseEntry, GeneratedExerciseEntry];
  rest_seconds_after_block: number;
}

export interface TrisetBlock extends WorkoutBlockBase {
  block_type: 'triset';
  exercises: [GeneratedExerciseEntry, GeneratedExerciseEntry, GeneratedExerciseEntry];
  rest_seconds_after_block: number;
}

export type CircuitCadence =
  | {
      rounds: number;
      duration_seconds?: number;
    }
  | {
      rounds?: number;
      duration_seconds: number;
    };

export type CircuitBlock = WorkoutBlockBase & {
  block_type: 'circuit';
  exercises: GeneratedExerciseEntry[];
  rest_seconds_after_round?: number;
} & CircuitCadence;

export interface EmomBlock extends WorkoutBlockBase {
  block_type: 'emom';
  exercises: GeneratedExerciseEntry[];
  duration_seconds: number;
  interval_seconds: 60;
}

export type WorkoutBlock =
  | StraightSetsBlock
  | SupersetBlock
  | TrisetBlock
  | CircuitBlock
  | EmomBlock;

export interface GenerateWorkoutSessionInput {
  request_id: string;
  location: TrainingLocation;
  experience_level: ExperienceLevel;
  available_capabilities: EffectiveCapabilityId[];
  preferred_block_types: WorkoutBlockType[];
  duration_minutes: number;
  session_goal: SessionGoal;
  equipment_profile: {
    home_equipment: HomeEquipment;
    context_capabilities?: EffectiveCapabilityId[];
  };
}

export interface GeneratedWorkoutSession {
  session_id: string;
  session_type: GeneratedSessionType;
  location: TrainingLocation;
  session_goal: SessionGoal;
  estimated_duration_minutes: number;
  summary?: string;
  session_notes?: string;
  blocks: WorkoutBlock[];
}
