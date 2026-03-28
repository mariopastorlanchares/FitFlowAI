import { ContextCapabilityId } from './user-profile';

export type EffectiveCapabilityId = ContextCapabilityId | 'bodyweight';

export const EXERCISE_MOVEMENT_PATTERNS = [
  'squat',
  'push_horizontal',
  'pull_horizontal',
  'pull_vertical',
  'hinge',
  'conditioning',
] as const;

export type ExerciseMovementPattern = (typeof EXERCISE_MOVEMENT_PATTERNS)[number];

type ExerciseCatalogDefinition = {
  movementPattern: ExerciseMovementPattern;
  requiredCapabilities: readonly EffectiveCapabilityId[];
  translationKey: string;
};

export const EXERCISE_CATALOG = {
  back_squat: {
    movementPattern: 'squat',
    requiredCapabilities: ['barbell'],
    translationKey: 'workout.catalog.exercises.back_squat',
  },
  leg_press: {
    movementPattern: 'squat',
    requiredCapabilities: ['machine_access'],
    translationKey: 'workout.catalog.exercises.leg_press',
  },
  push_up: {
    movementPattern: 'push_horizontal',
    requiredCapabilities: ['bodyweight'],
    translationKey: 'workout.catalog.exercises.push_up',
  },
  dumbbell_floor_press: {
    movementPattern: 'push_horizontal',
    requiredCapabilities: ['dumbbells'],
    translationKey: 'workout.catalog.exercises.dumbbell_floor_press',
  },
  dumbbell_bench_press: {
    movementPattern: 'push_horizontal',
    requiredCapabilities: ['dumbbells', 'bench'],
    translationKey: 'workout.catalog.exercises.dumbbell_bench_press',
  },
  band_row: {
    movementPattern: 'pull_horizontal',
    requiredCapabilities: ['bands'],
    translationKey: 'workout.catalog.exercises.band_row',
  },
  pull_up: {
    movementPattern: 'pull_vertical',
    requiredCapabilities: ['pullup_bar'],
    translationKey: 'workout.catalog.exercises.pull_up',
  },
  kettlebell_swing: {
    movementPattern: 'hinge',
    requiredCapabilities: ['kettlebell'],
    translationKey: 'workout.catalog.exercises.kettlebell_swing',
  },
  parallel_bar_dip: {
    movementPattern: 'push_horizontal',
    requiredCapabilities: ['parallel_bars'],
    translationKey: 'workout.catalog.exercises.parallel_bar_dip',
  },
  ring_row: {
    movementPattern: 'pull_horizontal',
    requiredCapabilities: ['rings_anchor'],
    translationKey: 'workout.catalog.exercises.ring_row',
  },
} as const satisfies Record<string, ExerciseCatalogDefinition>;

export type ExerciseId = keyof typeof EXERCISE_CATALOG;

export type ExerciseCatalogEntry = {
  id: ExerciseId;
  movementPattern: ExerciseMovementPattern;
  requiredCapabilities: EffectiveCapabilityId[];
  translationKey: string;
};
