import { ActiveWorkoutSession } from '../types/workout';
import i18n from '@shared/lib/i18n';

function buildPreviewWorkout(): ActiveWorkoutSession {
  return {
    id: '1',
    workoutName: i18n.t('workout.mock.workoutName'),
    startTime: new Date(),
    currentExerciseIndex: 0,
    exercises: [
      {
        id: 'ex1',
        name: i18n.t('workout.mock.exercises.squat.name'),
        description: i18n.t('workout.mock.exercises.squat.description'),
        restSeconds: 90,
        sets: [
          { id: 'set1', targetReps: 10, targetWeight: 60, actualReps: 10, actualWeight: 60, completed: false },
          { id: 'set2', targetReps: 8, targetWeight: 65, actualReps: 8, actualWeight: 65, completed: false },
          { id: 'set3', targetReps: 8, targetWeight: 65, actualReps: 8, actualWeight: 65, completed: false },
        ],
      },
      {
        id: 'ex2',
        name: i18n.t('workout.mock.exercises.legPress.name'),
        description: i18n.t('workout.mock.exercises.legPress.description'),
        restSeconds: 60,
        sets: [
          { id: 'set4', targetReps: 12, targetWeight: 160, actualReps: 12, actualWeight: 160, completed: false },
          { id: 'set5', targetReps: 12, targetWeight: 160, actualReps: 12, actualWeight: 160, completed: false },
        ],
      },
    ],
  };
}

export async function getWorkoutSession(workoutId: string | string[]) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const previewWorkout = buildPreviewWorkout();

  if (
    Array.isArray(workoutId)
      ? workoutId[0] !== previewWorkout.id
      : workoutId !== previewWorkout.id
  ) {
    return previewWorkout;
  }

  return previewWorkout;
}
