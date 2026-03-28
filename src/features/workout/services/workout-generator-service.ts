import {
  buildGenerateWorkoutSessionInput,
  validateGeneratedWorkoutSession,
} from '@shared/lib/generator-contract';
import type {
  GenerateWorkoutSessionInput,
  GeneratedWorkoutSession,
  SessionGoal,
  WorkoutBlockType,
} from '@shared/types/generator-contract';
import type { UserProfile } from '@shared/types/user-profile';
import type { TrainingLocation } from '@shared/types/workout-context';

import type { WorkoutDurationKey, WorkoutEnergyKey } from '../store/use-workout-intent';

const GENERATE_WORKOUT_SESSION_FUNCTION = 'generateWorkoutSession';

export interface WorkoutIntentParams {
  location: TrainingLocation;
  duration: WorkoutDurationKey;
  energy: WorkoutEnergyKey;
}

const DEFAULT_PREFERRED_BLOCK_TYPES: WorkoutBlockType[] = [
  'straight_sets',
  'superset',
  'circuit',
];

type GeneratorProfileSnapshot = Pick<
  UserProfile,
  'contextProfiles' | 'defaultLocation' | 'experienceLevel' | 'homeEquipment'
>;

function buildRequestId() {
  return `req-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export function buildWorkoutGenerationInput(
  profile: GeneratorProfileSnapshot,
  intent: WorkoutIntentParams
): GenerateWorkoutSessionInput {
  const durationMap: Record<WorkoutDurationKey, number> = {
    short: 30,
    medium: 45,
    long: 60,
    extended: 90,
  };

  const energyToGoalMap: Record<WorkoutEnergyKey, SessionGoal> = {
    low: 'general_fitness',
    medium: 'hypertrophy',
    high: 'strength',
  };

  return buildGenerateWorkoutSessionInput({
    requestId: buildRequestId(),
    location: intent.location,
    profile,
    preferredBlockTypes: DEFAULT_PREFERRED_BLOCK_TYPES,
    durationMinutes: durationMap[intent.duration],
    sessionGoal: energyToGoalMap[intent.energy],
  });
}

export async function requestGeneratedWorkoutSession(
  profile: GeneratorProfileSnapshot,
  intent: WorkoutIntentParams
): Promise<GeneratedWorkoutSession> {
  const [{ httpsCallable }, { getFirebaseFunctionsClient, auth }] = await Promise.all([
    import('firebase/functions'),
    import('@shared/lib/firebase'),
  ]);

  if (!auth.currentUser) {
    throw new Error('Cannot generate workout session: user is not authenticated.');
  }

  const functionsClient = await getFirebaseFunctionsClient();
  const callable = httpsCallable<GenerateWorkoutSessionInput, unknown>(
    functionsClient,
    GENERATE_WORKOUT_SESSION_FUNCTION
  );
  const input = buildWorkoutGenerationInput(profile, intent);
  const result = await callable(input);
  const validation = validateGeneratedWorkoutSession(result.data);

  if (!validation.success) {
    throw new Error(`Callable returned an invalid generated session: ${validation.errors.join(' ')}`);
  }

  return validation.data;
}
