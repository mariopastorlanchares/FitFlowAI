import { GeneratedWorkoutSession } from '@shared/types/generator-contract';

import { adaptGeneratedWorkoutSession } from './generated-workout-session-adapter';

function buildPreviewGeneratedWorkout(): GeneratedWorkoutSession {
  return {
    session_id: '1',
    session_type: 'generated_ephemeral',
    location: 'gym',
    session_goal: 'strength',
    estimated_duration_minutes: 42,
    summary: 'Preview session generated from the structured contract.',
    blocks: [
      {
        block_id: 'block-1',
        block_type: 'straight_sets',
        order_index: 0,
        exercise: {
          entry_id: 'entry-1',
          exercise_id: 'back_squat',
          prescription: {
            set_count: 3,
            target_reps: [10, 8, 8],
            intensity_method: 'load_kg',
            intensity_value: 60,
          },
        },
        rest_seconds_after_exercise: 90,
      },
      {
        block_id: 'block-2',
        block_type: 'straight_sets',
        order_index: 1,
        exercise: {
          entry_id: 'entry-2',
          exercise_id: 'leg_press',
          prescription: {
            set_count: 2,
            target_reps: 12,
            intensity_method: 'load_kg',
            intensity_value: 160,
          },
        },
        rest_seconds_after_exercise: 60,
      },
    ],
  };
}

export async function getWorkoutSession(workoutId: string | string[]) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const previewWorkout = adaptGeneratedWorkoutSession(buildPreviewGeneratedWorkout());

  if (
    Array.isArray(workoutId)
      ? workoutId[0] !== previewWorkout.id
      : workoutId !== previewWorkout.id
  ) {
    return previewWorkout;
  }

  return previewWorkout;
}
