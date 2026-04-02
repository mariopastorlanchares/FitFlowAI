import { render } from '@testing-library/react-native';
import React from 'react';

import { StatsScreen } from '@features/analytics/screens/stats-screen';
import { useWorkoutHistorySummary } from '@features/workout/hooks/use-workout-history-summary';

jest.mock('@features/workout/hooks/use-workout-history-summary', () => ({
  useWorkoutHistorySummary: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'analytics.loadingTitle': 'Loading your stats',
        'analytics.loadingBody':
          'We are collecting the latest completed sessions from Firestore.',
        'analytics.placeholderTitle': 'No completed sessions yet',
        'analytics.placeholderBody':
          'Finish your first workout to unlock real progress metrics and recent session history.',
        'analytics.metrics.totalSessions': 'Completed sessions',
        'analytics.metrics.thisWeek': 'This week',
        'analytics.metrics.activeDays': 'Active days',
        'analytics.recentTitle': 'Recent sessions',
        'analytics.recentMeta': 'Gym · Apr 2',
        'analytics.recentSets': '6/6 sets',
        'dashboard.context.locationOptions.gym': 'Gym',
      };

      return translations[key] ?? key;
    },
  }),
}));

describe('StatsScreen', () => {
  it('renders completed-session metrics and recent history once data exists', () => {
    (useWorkoutHistorySummary as jest.Mock).mockReturnValue({
      summary: {
        totalCompletedSessions: 3,
        completedSessionsThisWeek: 2,
        activeDaysThisWeek: 2,
        recentSessions: [
          {
            id: 'session-1',
            workoutName: 'Strength session',
            location: 'gym',
            completedAt: new Date('2026-04-02T18:45:00Z'),
            totalExercises: 2,
            totalSets: 6,
            completedSets: 6,
            source: 'live_generated',
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: jest.fn(),
    });

    const { getByText } = render(<StatsScreen />);

    expect(getByText('Completed sessions')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('Recent sessions')).toBeTruthy();
    expect(getByText('Strength session')).toBeTruthy();
    expect(getByText('6/6 sets')).toBeTruthy();
  });
});
