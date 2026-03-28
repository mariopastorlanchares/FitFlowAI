import { EXERCISE_CATALOG, ExerciseCatalogEntry, ExerciseId } from '../types/exercise-catalog';
import i18n from './i18n';

export function getExerciseCatalogEntry(exerciseId: ExerciseId): ExerciseCatalogEntry {
  const definition = EXERCISE_CATALOG[exerciseId];

  return {
    id: exerciseId,
    movementPattern: definition.movementPattern,
    requiredCapabilities: [...definition.requiredCapabilities],
    translationKey: definition.translationKey,
  };
}

export function getExerciseDisplayCopy(exerciseId: ExerciseId) {
  const exercise = getExerciseCatalogEntry(exerciseId);

  return {
    name: i18n.t(`${exercise.translationKey}.name` as any),
    description: i18n.t(`${exercise.translationKey}.description` as any),
  };
}
