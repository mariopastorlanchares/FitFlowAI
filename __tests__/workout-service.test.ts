import { getWorkoutSession } from '@features/workout/services/workout-service';
import { requestGeneratedWorkoutSession } from '@features/workout/services/workout-generator-service';
import type { GeneratedWorkoutSession } from '@shared/types/generator-contract';
import type { UserProfile } from '@shared/types/user-profile';

jest.mock('@features/workout/services/workout-generator-service', () => ({
  requestGeneratedWorkoutSession: jest.fn(),
}));

const mockRequestGeneratedWorkoutSession = requestGeneratedWorkoutSession as jest.MockedFunction<
  typeof requestGeneratedWorkoutSession
>;

const baseUserProfile: UserProfile = {
  authUid: 'user-1',
  experienceLevel: 'intermediate',
  preferredLocations: ['home', 'gym'],
  defaultLocation: 'home',
  homeEquipment: {},
  contextProfiles: {},
  createdAt: null,
  updatedAt: null,
};

const generatedSession: GeneratedWorkoutSession = {
  session_id: 'generated-1',
  session_type: 'generated_ephemeral',
  location: 'home',
  session_goal: 'general_fitness',
  estimated_duration_minutes: 40,
  blocks: [
    {
      block_id: 'block-1',
      block_type: 'straight_sets',
      order_index: 0,
      exercise: {
        entry_id: 'entry-1',
        exercise_id: 'push_up',
        prescription: {
          set_count: 3,
          target_reps: 12,
          intensity_method: 'bodyweight',
        },
      },
      rest_seconds_after_exercise: 60,
    },
  ],
};

describe('workout service runtime integration', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('uses the generated session when the callable succeeds', async () => {
    mockRequestGeneratedWorkoutSession.mockResolvedValue(generatedSession);

    const session = await getWorkoutSession('1', {
      authUid: 'user-1',
      userProfile: baseUserProfile,
    });

    expect(mockRequestGeneratedWorkoutSession).toHaveBeenCalledWith(baseUserProfile);
    expect(session.id).toBe('generated-1');
    expect(session.source).toBe('live_generated');
    expect(session.displayBlocks[0]?.blockType).toBe('straight_sets');
    expect(session.exercises[0]?.exerciseId).toBe('push_up');
  });

  it('falls back to a compatible preview when the callable fails', async () => {
    mockRequestGeneratedWorkoutSession.mockRejectedValue(new Error('generation failed'));

    const session = await getWorkoutSession('1', {
      authUid: 'user-1',
      userProfile: baseUserProfile,
    });

    expect(session.id).toBe('preview-session');
    expect(session.source).toBe('fallback_preview');
    expect(session.summary).toBe('Preview session shown while the live generation is unavailable.');
    expect(session.exercises[0]?.exerciseId).toBe('push_up');
  });
});
