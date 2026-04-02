import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import i18n from '@shared/lib/i18n';
import { useWorkoutSession } from '@features/workout/hooks/use-workout-session';
import type { ActiveWorkoutSession } from '@features/workout/types/workout';

const mockInvalidateQueries = jest.fn();
const mockGetWorkoutSession = jest.fn();
const mockRecordCompletedWorkoutSession = jest.fn();
const focusEffectCallbacks: (() => void | (() => void))[] = [];
const mockUser = { uid: 'user-1' };
const mockUserProfile = {
  authUid: 'user-1',
  experienceLevel: 'intermediate',
  preferredLocations: ['gym'],
  defaultLocation: 'gym',
  homeEquipment: {},
  contextProfiles: {},
  createdAt: new Date('2026-04-02T10:00:00Z'),
  updatedAt: new Date('2026-04-02T10:00:00Z'),
};

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    focusEffectCallbacks.push(callback);
  },
}));

jest.mock('@features/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    isLoading: false,
  }),
}));

jest.mock('@features/profile/hooks/use-user-profile', () => ({
  useUserProfile: () => ({
    userProfile: mockUserProfile,
    isLoading: false,
  }),
}));

jest.mock('@features/workout/store/use-workout-intent', () => ({
  useWorkoutIntent: {
    getState: () => ({
      location: 'gym',
      duration: 'medium',
      energy: 'high',
    }),
  },
}));

jest.mock('@features/workout/services/workout-service', () => ({
  getWorkoutSession: (...args: unknown[]) => mockGetWorkoutSession(...args),
}));

jest.mock('@features/workout/services/workout-history-service', () => ({
  recordCompletedWorkoutSession: (...args: unknown[]) =>
    mockRecordCompletedWorkoutSession(...args),
}));

function buildSession(startTime: string): ActiveWorkoutSession {
  return {
    id: 'session-1',
    sourceSessionId: 'generated-1',
    source: 'live_generated',
    workoutName: 'Strength session',
    sessionGoal: 'strength',
    summary: 'Heavy lower body focus.',
    displayBlocks: [
      {
        blockId: 'block-1',
        blockType: 'straight_sets',
        orderIndex: 0,
        exercises: [
          {
            entryId: 'entry-1',
            exerciseId: 'back_squat',
            name: 'Back Squat',
          },
        ],
      },
    ],
    exercises: [
      {
        id: 'exercise-1',
        exerciseId: 'back_squat',
        name: 'Back Squat',
        sets: [
          {
            id: 'set-1',
            targetReps: 5,
            targetWeight: 100,
            actualReps: 5,
            actualWeight: 100,
            completed: true,
          },
        ],
        restSeconds: 120,
        blockId: 'block-1',
        blockType: 'straight_sets',
      },
    ],
    startTime: new Date(startTime),
    currentExerciseIndex: 0,
  };
}

describe('useWorkoutSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    focusEffectCallbacks.length = 0;
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('re-enables finish when persisting a completed workout times out offline', async () => {
    mockGetWorkoutSession.mockResolvedValue(buildSession('2026-04-02T18:00:00Z'));
    mockRecordCompletedWorkoutSession.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useWorkoutSession('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    jest.useFakeTimers();
    let didFinish = true;

    await act(async () => {
      const finishPromise = result.current.finishWorkout();
      jest.advanceTimersByTime(6000);
      didFinish = await finishPromise;
    });

    expect(didFinish).toBe(false);
    expect(result.current.isFinishing).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      i18n.t('common.error'),
      i18n.t('workout.finish.saveTimeout')
    );
    jest.useRealTimers();
  });

  it('reloads a fresh session on focus after a successful finish', async () => {
    mockGetWorkoutSession
      .mockResolvedValueOnce(buildSession('2026-04-02T18:00:00Z'))
      .mockResolvedValueOnce(buildSession('2026-04-02T19:00:00Z'));
    mockRecordCompletedWorkoutSession.mockResolvedValue('completed_generated-1_1775152800000');

    const { result } = renderHook(() => useWorkoutSession('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const didFinish = await result.current.finishWorkout();
      expect(didFinish).toBe(true);
    });

    await act(async () => {
      const latestFocusCallback = focusEffectCallbacks[focusEffectCallbacks.length - 1];
      latestFocusCallback?.();
    });

    await waitFor(() => {
      expect(mockGetWorkoutSession).toHaveBeenCalledTimes(2);
    });

    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(result.current.session?.startTime.toISOString()).toBe('2026-04-02T19:00:00.000Z');
  });
});
