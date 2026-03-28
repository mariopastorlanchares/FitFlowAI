import { HOME_EQUIPMENT_IDS, HomeEquipment, TrainingLocation } from '../types/user-profile';
import { EffectiveCapabilityId, EXERCISE_CATALOG, ExerciseId } from '../types/exercise-catalog';
import { getExerciseCatalogEntry } from './exercise-catalog';

type AvailableCapabilitiesParams = {
  location: TrainingLocation;
  homeEquipment: HomeEquipment;
  contextCapabilities?: EffectiveCapabilityId[];
};

function dedupeCapabilities(capabilities: EffectiveCapabilityId[]) {
  return Array.from(new Set<EffectiveCapabilityId>(capabilities));
}

export function deriveHomeAvailableCapabilities(homeEquipment: HomeEquipment) {
  const capabilities: EffectiveCapabilityId[] = ['bodyweight'];

  HOME_EQUIPMENT_IDS.forEach((equipmentId) => {
    if (homeEquipment[equipmentId]) {
      capabilities.push(equipmentId);
    }
  });

  return capabilities;
}

export function getAvailableCapabilitiesForWorkoutContext({
  location,
  homeEquipment,
  contextCapabilities = [],
}: AvailableCapabilitiesParams) {
  if (location === 'home') {
    return deriveHomeAvailableCapabilities(homeEquipment);
  }

  return dedupeCapabilities(['bodyweight', ...contextCapabilities]);
}

export function getIncompatibleRequiredCapabilities(
  exerciseId: ExerciseId,
  availableCapabilities: EffectiveCapabilityId[]
) {
  const availableCapabilitySet = new Set<EffectiveCapabilityId>(availableCapabilities);
  const { requiredCapabilities } = getExerciseCatalogEntry(exerciseId);

  return requiredCapabilities.filter(
    (requiredCapability) => !availableCapabilitySet.has(requiredCapability)
  );
}

export function isExerciseCompatibleWithCapabilities(
  exerciseId: ExerciseId,
  availableCapabilities: EffectiveCapabilityId[]
) {
  return getIncompatibleRequiredCapabilities(exerciseId, availableCapabilities).length === 0;
}

function getCapabilityOverlapScore(left: EffectiveCapabilityId[], right: EffectiveCapabilityId[]) {
  const rightSet = new Set(right);

  return left.reduce((score, capability) => {
    return rightSet.has(capability) ? score + 1 : score;
  }, 0);
}

export function findCompatibleExerciseReplacement(
  exerciseId: ExerciseId,
  availableCapabilities: EffectiveCapabilityId[],
  excludedExerciseIds: ExerciseId[] = []
) {
  const sourceExercise = getExerciseCatalogEntry(exerciseId);
  const excludedExerciseSet = new Set<ExerciseId>([exerciseId, ...excludedExerciseIds]);

  const candidates = (Object.keys(EXERCISE_CATALOG) as ExerciseId[])
    .filter((candidateId) => !excludedExerciseSet.has(candidateId))
    .map((candidateId) => getExerciseCatalogEntry(candidateId))
    .filter((candidate) => candidate.movementPattern === sourceExercise.movementPattern)
    .filter((candidate) =>
      isExerciseCompatibleWithCapabilities(candidate.id, availableCapabilities)
    )
    .sort((left, right) => {
      const overlapDelta =
        getCapabilityOverlapScore(
          right.requiredCapabilities,
          sourceExercise.requiredCapabilities
        ) -
        getCapabilityOverlapScore(
          left.requiredCapabilities,
          sourceExercise.requiredCapabilities
        );

      if (overlapDelta !== 0) {
        return overlapDelta;
      }

      return right.requiredCapabilities.length - left.requiredCapabilities.length;
    });

  return candidates[0] ?? null;
}
