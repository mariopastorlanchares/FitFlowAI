import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import ProfileScreen from '../app/(tabs)/profile';

const createUserProfileMock = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      const translations: Record<string, string> = {
        'common.loading': 'Loading...',
        'profile.title': 'My Profile',
        'profile.noEmail': 'No email associated',
        'profile.logout': 'Sign Out',
        'profile.sections.training': 'Training profile',
        'profile.sections.account': 'Account',
        'profile.sections.preferences': 'Preferences',
        'profile.sections.support': 'Support',
        'profile.training.eyebrow': 'Firestore',
        'profile.training.loadingTitle': 'Preparing your base profile',
        'profile.training.loadingBody':
          'We are checking whether your training profile exists in Firestore and creating the initial document if needed.',
        'profile.training.readyTitle': 'Base profile ready',
        'profile.training.readyBody':
          'This document is the first persisted contract for training context, preferred locations and future equipment constraints.',
        'profile.training.errorTitle': 'Profile setup needs attention',
        'profile.training.errorBody':
          'We could not load or create your Firestore profile. Retry before editing equipment or training contexts.',
        'profile.training.status.loading': 'Checking',
        'profile.training.status.ready': 'Ready',
        'profile.training.status.error': 'Retry needed',
        'profile.training.fields.experienceLevel': 'Experience level',
        'profile.training.fields.defaultLocation': 'Default location',
        'profile.training.fields.preferredLocations': 'Preferred locations',
        'profile.training.fields.homeEquipment': 'Home equipment',
        'profile.training.fields.contextProfiles': 'Saved contexts',
        'profile.training.experienceLevels.beginner': 'Beginner',
        'profile.training.experienceLevels.intermediate': 'Intermediate',
        'profile.training.experienceLevels.advanced': 'Advanced',
        'profile.training.values.empty': 'Not defined yet',
        'profile.training.actions.retry': 'Retry setup',
        'profile.options.personalInfo': 'Personal Information',
        'profile.options.theme': 'Theme',
        'profile.options.language': 'Language',
        'profile.options.help': 'Help Center',
        'profile.options.privacy': 'Privacy Policy',
        'dashboard.context.locationOptions.gym': 'Gym',
        'dashboard.context.locationOptions.home': 'Home',
        'dashboard.context.locationOptions.street': 'Street',
        'dashboard.context.locationOptions.park': 'Park',
      };

      if (key === 'profile.training.values.homeEquipmentCount') {
        return `${options?.count ?? 0} items configured`;
      }

      if (key === 'profile.training.values.contextProfilesCount') {
        return `${options?.count ?? 0} contexts saved`;
      }

      return translations[key] ?? key;
    },
  }),
}));

jest.mock('@features/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    user: {
      uid: 'user-123',
      email: 'test@example.com',
    },
    signOut: jest.fn(),
  }),
}));

jest.mock('@features/profile/hooks/use-user-profile', () => ({
  useUserProfile: jest.fn(),
}));

const useUserProfileMock = jest.requireMock(
  '@features/profile/hooks/use-user-profile'
).useUserProfile as jest.Mock;

describe('ProfileScreen', () => {
  beforeEach(() => {
    createUserProfileMock.mockReset();
    useUserProfileMock.mockReset();
  });

  it('renders the Firestore profile summary when the user profile exists', () => {
    useUserProfileMock.mockReturnValue({
      userProfile: {
        authUid: 'user-123',
        experienceLevel: 'beginner',
        preferredLocations: ['gym', 'home'],
        defaultLocation: 'gym',
        homeEquipment: {
          dumbbells: { isPair: true },
          bench: {},
        },
        contextProfiles: {
          park: {
            enabledCapabilities: ['pullup_bar'],
            templateId: 'park_v1',
            updatedAt: null,
          },
        },
        createdAt: null,
        updatedAt: null,
      },
      isLoading: false,
      error: null,
      createUserProfile: createUserProfileMock,
      isCreatingProfile: false,
    });

    const { getByText } = render(<ProfileScreen />);

    expect(getByText('My Profile')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByText('Training profile')).toBeTruthy();
    expect(getByText('Base profile ready')).toBeTruthy();
    expect(getByText('Beginner')).toBeTruthy();
    expect(getByText('Gym')).toBeTruthy();
    expect(getByText('Gym · Home')).toBeTruthy();
    expect(getByText('2 items configured')).toBeTruthy();
    expect(getByText('1 contexts saved')).toBeTruthy();
    expect(createUserProfileMock).not.toHaveBeenCalled();
  });

  it('bootstraps the Firestore profile when the document does not exist yet', async () => {
    createUserProfileMock.mockResolvedValue(undefined);

    useUserProfileMock.mockReturnValue({
      userProfile: null,
      isLoading: false,
      error: null,
      createUserProfile: createUserProfileMock,
      isCreatingProfile: false,
    });

    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Preparing your base profile')).toBeTruthy();

    await waitFor(() => {
      expect(createUserProfileMock).toHaveBeenCalledWith({
        experienceLevel: 'beginner',
        preferredLocations: ['gym', 'home'],
        defaultLocation: 'gym',
        homeEquipment: {},
        contextProfiles: {},
      });
    });
  });
});
