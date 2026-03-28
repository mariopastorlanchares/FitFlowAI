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

const GENERATE_WORKOUT_SESSION_FUNCTION = 'generateWorkoutSession';
const DEFAULT_DURATION_MINUTES = 40;
const DEFAULT_SESSION_GOAL: SessionGoal = 'general_fitness';
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
  profile: GeneratorProfileSnapshot
): GenerateWorkoutSessionInput {
  return buildGenerateWorkoutSessionInput({
    requestId: buildRequestId(),
    location: profile.defaultLocation,
    profile,
    preferredBlockTypes: DEFAULT_PREFERRED_BLOCK_TYPES,
    durationMinutes: DEFAULT_DURATION_MINUTES,
    sessionGoal: DEFAULT_SESSION_GOAL,
  });
}

export async function requestGeneratedWorkoutSession(
  profile: GeneratorProfileSnapshot
): Promise<GeneratedWorkoutSession> {
  const [{ httpsCallable }, { getFirebaseFunctionsClient }] = await Promise.all([
    import('firebase/functions'),
    import('@shared/lib/firebase'),
  ]);
  const functionsClient = await getFirebaseFunctionsClient();
  const callable = httpsCallable<GenerateWorkoutSessionInput, unknown>(
    functionsClient,
    GENERATE_WORKOUT_SESSION_FUNCTION
  );
  const input = buildWorkoutGenerationInput(profile);
  const result = await callable(input);
  const validation = validateGeneratedWorkoutSession(result.data);

  if (!validation.success) {
    throw new Error(`Callable returned an invalid generated session: ${validation.errors.join(' ')}`);
  }

  return validation.data;
}
