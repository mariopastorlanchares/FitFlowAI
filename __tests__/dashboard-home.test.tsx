import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { HeaderLogo } from '@features/dashboard/components/header-logo';
import { TodayWorkoutCard } from '@features/dashboard/components/today-workout-card';
import { WeeklyStreak } from '@features/dashboard/components/weekly-streak';
import { WorkoutContextSelector } from '@features/dashboard/components/workout-context-selector';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, number>) => {
      const translations: Record<string, string> = {
        'dashboard.header.eyebrow': 'Today',
        'dashboard.header.subtitle': 'Choose the session and start training.',
        'dashboard.sessionSetup.title': 'Tune today’s session',
        'dashboard.today_workout': 'Your workout today',
        'dashboard.time': 'min',
        'dashboard.focus': 'Focus',
        'dashboard.start_workout': 'Start workout',
        'dashboard.card.title': 'DAY 1 PUSH',
        'dashboard.card.description': '(Chest, Shoulders, Triceps)',
        'dashboard.card.duration': '45-50 min',
        'dashboard.card.focusValue': 'Strength',
        'dashboard.card.summary':
          'Main lifts first, accessories after. Estimated setup: 2 min.',
        'dashboard.weeklyStreak.label': 'Consistency',
        'dashboard.weeklyStreak.title': 'Weekly progress',
        'dashboard.weeklyStreak.progress': '0 sessions',
        'dashboard.weeklyStreak.caption': 'No history connected',
        'dashboard.weeklyStreak.helper':
          'Your completed sessions will be tracked here once the history module is ready.',
        'dashboard.weeklyStreak.daysLabel': '0 days active',
        'dashboard.context.locationLabel': 'Where are you training today?',
        'dashboard.context.durationLabel': 'Available time',
        'dashboard.context.energyLabel': 'Energy level',
        'dashboard.context.locationOptions.gym': 'Gym',
        'dashboard.context.locationOptions.home': 'Home',
        'dashboard.context.locationOptions.street': 'Street',
        'dashboard.context.locationOptions.park': 'Park',
        'dashboard.context.durationOptions.short': '30 min',
        'dashboard.context.durationOptions.medium': '45 min',
        'dashboard.context.durationOptions.long': '60 min',
        'dashboard.context.durationOptions.extended': '90 min',
        'dashboard.context.energyOptions.low': 'Tired',
        'dashboard.context.energyOptions.medium': 'Normal',
        'dashboard.context.energyOptions.high': 'High',
      };

      return translations[key] ?? key;
    },
  }),
}));

describe('Dashboard home blocks', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('renders a compact dashboard header and supporting copy', () => {
    const { getByText } = render(<HeaderLogo />);

    expect(getByText('Today')).toBeTruthy();
    expect(getByText('FitFlow AI')).toBeTruthy();
    expect(getByText('Choose the session and start training.')).toBeTruthy();
  });

  it('renders the main workout card and starts the workout flow', () => {
    const { getByLabelText, getByText } = render(<TodayWorkoutCard />);

    expect(getByText('Your workout today')).toBeTruthy();
    expect(getByText('Main lifts first, accessories after. Estimated setup: 2 min.')).toBeTruthy();
    expect(getByLabelText('Start workout. DAY 1 PUSH.').props.accessibilityHint).toContain(
      'Main lifts first, accessories after. Estimated setup: 2 min.'
    );

    fireEvent.press(getByText('Start workout'));

    expect(mockPush).toHaveBeenCalledWith('/workout');
  });

  it('renders weekly progress as supportive information', () => {
    const { getByText } = render(<WeeklyStreak />);

    expect(getByText('Weekly progress')).toBeTruthy();
    expect(getByText('0 sessions')).toBeTruthy();
    expect(
      getByText('Your completed sessions will be tracked here once the history module is ready.')
    ).toBeTruthy();
  });

  it('renders a compact session summary and expands when needed', () => {
    const { getByText } = render(<WorkoutContextSelector />);

    expect(getByText('Tune today’s session')).toBeTruthy();
    expect(getByText('Gym')).toBeTruthy();
    expect(getByText('45 min')).toBeTruthy();
    expect(getByText('Normal')).toBeTruthy();

    fireEvent.press(getByText('Tune today’s session'));

    expect(getByText('Where are you training today?')).toBeTruthy();
  });
});
