import {
  getAvailableCapabilitiesForWorkoutContext,
  isExerciseCompatibleWithCapabilities,
} from '@shared/lib/exercise-compatibility';
import i18n from '@shared/lib/i18n';
import { EffectiveCapabilityId, EXERCISE_CATALOG, ExerciseId } from '@shared/types/exercise-catalog';
import { GeneratedWorkoutSession } from '@shared/types/generator-contract';
import type { UserProfile } from '@shared/types/user-profile';
import type { TrainingLocation } from '@shared/types/workout-context';

import { adaptGeneratedWorkoutSession } from './generated-workout-session-adapter';
import { requestGeneratedWorkoutSession } from './workout-generator-service';

type GetWorkoutSessionOptions = {
  authUid?: string | null;
  userProfile?: UserProfile | null;
};

function getDefaultPreviewCapabilities(location: TrainingLocation): EffectiveCapabilityId[] {
  switch (location) {
    case 'home':
      return ['bodyweight', 'dumbbells', 'bench'];
    case 'park':
      return ['bodyweight', 'pullup_bar', 'parallel_bars'];
    case 'street':
      return ['bodyweight'];
    case 'gym':
    default:
      return ['bodyweight', 'barbell', 'machine_access'];
  }
}

function resolvePreviewCapabilities(userProfile?: UserProfile | null) {
  if (!userProfile) {
    return getDefaultPreviewCapabilities('gym');
  }

  const location = userProfile.defaultLocation;
  const contextCapabilities =
    location === 'home'
      ? undefined
      : userProfile.contextProfiles[location]?.enabledCapabilities;

  return getAvailableCapabilitiesForWorkoutContext({
    location,
    homeEquipment: userProfile.homeEquipment,
    contextCapabilities,
  });
}

function selectPreviewExerciseIds(availableCapabilities: EffectiveCapabilityId[]) {
  const compatibleExercises = (Object.keys(EXERCISE_CATALOG) as ExerciseId[]).filter((exerciseId) =>
    isExerciseCompatibleWithCapabilities(exerciseId, availableCapabilities)
  );

  if (compatibleExercises.length > 0) {
    return compatibleExercises.slice(0, 2);
  }

  return ['push_up'] as ExerciseId[];
}

function isBodyweightOnlyExercise(exerciseId: ExerciseId) {
  const requiredCapabilities = [
    ...EXERCISE_CATALOG[exerciseId].requiredCapabilities,
  ] as EffectiveCapabilityId[];

  return requiredCapabilities.length === 1 && requiredCapabilities[0] === 'bodyweight';
}

function buildPreviewGeneratedWorkout(
  location: TrainingLocation,
  availableCapabilities: EffectiveCapabilityId[]
): GeneratedWorkoutSession {
  const previewExerciseIds = selectPreviewExerciseIds(availableCapabilities);

  return {
    session_id: 'preview-session',
    session_type: 'generated_ephemeral',
    location,
    session_goal: 'general_fitness',
    estimated_duration_minutes: 40,
    summary: i18n.t('workout.generatedSession.previewSummary'),
    blocks: previewExerciseIds.map((exerciseId, index) => ({
      block_id: `preview-block-${index + 1}`,
      block_type: 'straight_sets',
      order_index: index,
        exercise: {
          entry_id: `preview-entry-${index + 1}`,
          exercise_id: exerciseId,
          prescription: {
            set_count: index === 0 ? 3 : 2,
            target_reps: index === 0 ? [10, 8, 8] : 12,
            intensity_method: isBodyweightOnlyExercise(exerciseId) ? 'bodyweight' : 'load_kg',
            intensity_value: isBodyweightOnlyExercise(exerciseId)
              ? undefined
              : index === 0
                ? 24
                : 32,
          },
        },
      rest_seconds_after_exercise: index === 0 ? 90 : 60,
    })),
  };
}

export async function getWorkoutSession(
  workoutId: string | string[],
  options: GetWorkoutSessionOptions = {}
) {
  void workoutId;

  const previewLocation = options.userProfile?.defaultLocation ?? 'gym';
  const previewWorkout = adaptGeneratedWorkoutSession(
    buildPreviewGeneratedWorkout(previewLocation, resolvePreviewCapabilities(options.userProfile)),
    { source: 'fallback_preview' }
  );

  if (options.authUid && options.userProfile) {
    try {
      const generatedWorkout = await requestGeneratedWorkoutSession(options.userProfile);

      return adaptGeneratedWorkoutSession(generatedWorkout, { source: 'live_generated' });
    } catch (error) {
      console.warn('Falling back to preview workout session after generation failure.', error);
    }
  }

  return previewWorkout;
}
