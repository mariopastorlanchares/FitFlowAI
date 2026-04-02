import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@features/auth/hooks/use-auth';
import { EMPTY_WORKOUT_HISTORY_SUMMARY } from '@shared/types/workout-history';

import { getWorkoutHistorySummary } from '../services/workout-history-service';

const workoutHistorySummaryQueryKey = (authUid: string) =>
  ['workout-history-summary', authUid] as const;

export { workoutHistorySummaryQueryKey };

function requireAuthUid(authUid: string | null): string {
  if (!authUid) {
    throw new Error('Workout history queries require an authenticated user.');
  }

  return authUid;
}

export function useWorkoutHistorySummary() {
  const { user } = useAuth();
  const authUid = user?.uid ?? null;

  const queryResult = useQuery({
    queryKey: authUid ? workoutHistorySummaryQueryKey(authUid) : ['workout-history-summary', 'anonymous'],
    queryFn: () => getWorkoutHistorySummary(requireAuthUid(authUid)),
    enabled: Boolean(authUid),
  });

  return {
    summary: queryResult.data ?? EMPTY_WORKOUT_HISTORY_SUMMARY,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    error: queryResult.error ?? null,
    refetch: queryResult.refetch,
  };
}
