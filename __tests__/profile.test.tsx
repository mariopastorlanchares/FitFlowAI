import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import ProfileScreen from '../app/(tabs)/profile';

const mockSignOut = jest.fn();
const createUserProfileMock = jest.fn();
const updateUserProfilePreferencesMock = jest.fn();
const updateHomeEquipmentMock = jest.fn();
const updateContextProfileMock = jest.fn();

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      const translations: Record<string, string> = {
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'profile.title': 'My Profile',
        'profile.noEmail': 'No email associated',
        'profile.logout': 'Sign Out',
        'profile.logoutHint': 'Open the confirmation dialog to sign out from this device.',
        'profile.logoutConfirmTitle': 'Sign Out',
        'profile.logoutConfirmMessage': 'Are you sure you want to sign out?',
        'profile.logoutCancel': 'Cancel',
        'profile.logoutConfirm': 'Yes, sign out',
        'profile.logoutError': 'Could not sign out.',
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
        'profile.operational.eyebrow': 'Operational profile',
        'profile.operational.title': 'Training setup you can actually use',
        'profile.operational.description':
          'Adjust the training baseline before we wire context capture and AI generation to real constraints.',
        'profile.operational.save': 'Save profile',
        'profile.operational.saveHint':
          'Save the current training preferences and home equipment.',
        'profile.operational.saveDisabledHint':
          'There are no profile changes to save yet.',
        'profile.operational.saveError': 'We could not save your operational profile.',
        'profile.operational.preferredLocationsHelper':
          'These locations shape defaults and shortcuts in product, but they do not block other contexts.',
        'profile.operational.defaultLocationHelper':
          'Choose the location the app should preselect when preparing a new session.',
        'profile.operational.homeEquipmentHelper':
          'Mark only the equipment you really have at home. Context-specific capabilities stay outside this block.',
        'profile.operational.groups.experience': 'Experience level',
        'profile.operational.groups.preferredLocations': 'Preferred locations',
        'profile.operational.groups.defaultLocation': 'Default location',
        'profile.operational.groups.homeEquipment': 'Home equipment',
        'profile.operational.homeEquipmentOptions.dumbbells': 'Dumbbells',
        'profile.operational.homeEquipmentOptions.barbell': 'Barbell',
        'profile.operational.homeEquipmentOptions.bench': 'Bench',
        'profile.operational.homeEquipmentOptions.bands': 'Bands',
        'profile.operational.homeEquipmentOptions.pullup_bar': 'Pull-up bar',
        'profile.operational.homeEquipmentOptions.kettlebell': 'Kettlebell',
        'profile.contexts.eyebrow': 'External contexts',
        'profile.contexts.title': 'Trim each place to what is really available',
        'profile.contexts.description':
          'Start from a broad template for each context and remove whatever your usual park or gym does not actually have.',
        'profile.contexts.save': 'Save contexts',
        'profile.contexts.saveHint':
          'Save the current park and gym capability configuration.',
        'profile.contexts.saveDisabledHint':
          'There are no external context changes to save yet.',
        'profile.contexts.saveError': 'We could not save your external contexts.',
        'profile.contexts.futureNote':
          'Street stays visible as a future context, but this V1 editor only closes park and gym.',
        'profile.contexts.status.template': 'Base template',
        'profile.contexts.status.saved': 'Saved context',
        'profile.contexts.helpers.park':
          'Keep only the stations your usual park really offers. The default template starts broad on purpose.',
        'profile.contexts.helpers.gym':
          'Use this as the effective equipment baseline for your gym, not as a list of machines you own.',
        'profile.contexts.capabilityOptions.dumbbells': 'Dumbbells',
        'profile.contexts.capabilityOptions.barbell': 'Barbell',
        'profile.contexts.capabilityOptions.bench': 'Bench',
        'profile.contexts.capabilityOptions.bands': 'Bands',
        'profile.contexts.capabilityOptions.pullup_bar': 'Pull-up bar',
        'profile.contexts.capabilityOptions.kettlebell': 'Kettlebell',
        'profile.contexts.capabilityOptions.parallel_bars': 'Parallel bars',
        'profile.contexts.capabilityOptions.rings_anchor': 'Rings anchor',
        'profile.contexts.capabilityOptions.machine_access': 'Machine access',
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

      if (key === 'profile.operational.summary') {
        return `${options?.count ?? 0} items in home setup`;
      }

      if (key === 'profile.operational.contextProfilesSummary') {
        return `${options?.count ?? 0} saved external contexts. External places are configured in the block below.`;
      }

      if (key === 'profile.contexts.summary') {
        return `${options?.count ?? 0} contexts already customized`;
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
    signOut: mockSignOut,
  }),
}));

jest.mock('@features/profile/hooks/use-user-profile', () => ({
  useUserProfile: jest.fn(),
}));

const useUserProfileMock = jest.requireMock(
  '@features/profile/hooks/use-user-profile'
).useUserProfile as jest.Mock;

function buildHookValue(overrides?: Record<string, unknown>) {
  return {
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
    updateUserProfilePreferences: updateUserProfilePreferencesMock,
    updateHomeEquipment: updateHomeEquipmentMock,
    updateContextProfile: updateContextProfileMock,
    isCreatingProfile: false,
    isUpdatingPreferences: false,
    isUpdatingHomeEquipment: false,
    isUpdatingContextProfile: false,
    ...overrides,
  };
}

describe('ProfileScreen', () => {
  beforeEach(() => {
    mockSignOut.mockReset();
    createUserProfileMock.mockReset();
    updateUserProfilePreferencesMock.mockReset();
    updateHomeEquipmentMock.mockReset();
    updateContextProfileMock.mockReset();
    useUserProfileMock.mockReset();
  });

  it('renders the Firestore profile summary when the user profile exists', () => {
    useUserProfileMock.mockReturnValue(buildHookValue());

    const { getAllByText, getByLabelText, getByText } = render(<ProfileScreen />);

    expect(getByText('My Profile')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByText('Training profile')).toBeTruthy();
    expect(getByText('Base profile ready')).toBeTruthy();
    expect(getAllByText('Beginner').length).toBeGreaterThan(0);
    expect(getAllByText('Gym').length).toBeGreaterThan(0);
    expect(getByText('2 items configured')).toBeTruthy();
    expect(getByText('1 contexts saved')).toBeTruthy();
    expect(getByText('Training setup you can actually use')).toBeTruthy();
    expect(getByText('Trim each place to what is really available')).toBeTruthy();
    expect(getByText('2 items in home setup')).toBeTruthy();
    expect(getByLabelText('Save profile').props.accessibilityState).toMatchObject({
      disabled: true,
    });
    expect(getByLabelText('Save contexts').props.accessibilityState).toMatchObject({
      disabled: true,
    });
    expect(getByLabelText('Sign Out').props.accessibilityHint).toBe(
      'Open the confirmation dialog to sign out from this device.'
    );
    expect(createUserProfileMock).not.toHaveBeenCalled();
  });

  it('saves updated operational preferences and home equipment', async () => {
    updateUserProfilePreferencesMock.mockResolvedValue(undefined);
    updateHomeEquipmentMock.mockResolvedValue(undefined);
    useUserProfileMock.mockReturnValue(
      buildHookValue({
        userProfile: {
          authUid: 'user-123',
          experienceLevel: 'beginner',
          preferredLocations: ['gym', 'home'],
          defaultLocation: 'gym',
          homeEquipment: {
            dumbbells: { isPair: true },
          },
          contextProfiles: {},
          createdAt: null,
          updatedAt: null,
        },
      })
    );

    const { getAllByText, getByLabelText, getByText } = render(<ProfileScreen />);

    expect(getByLabelText('Save profile').props.accessibilityState).toMatchObject({
      disabled: true,
    });

    fireEvent.press(getAllByText('Advanced')[0]);
    fireEvent.press(getAllByText('Street')[0]);
    fireEvent.press(getAllByText('Street')[1]);
    fireEvent.press(getAllByText('Bands')[0]);

    expect(getByLabelText('Save profile').props.accessibilityState).toMatchObject({
      disabled: false,
    });
    fireEvent.press(getByText('Save profile'));

    await waitFor(() => {
      expect(updateUserProfilePreferencesMock).toHaveBeenCalledWith({
        preferredLocations: ['gym', 'home', 'street'],
        defaultLocation: 'street',
      });
    });

    await waitFor(() => {
      expect(updateHomeEquipmentMock).toHaveBeenCalledWith({
        dumbbells: { isPair: true },
        bands: {},
      });
    });
  });

  it('saves trimmed context profiles for park and gym', async () => {
    updateContextProfileMock.mockResolvedValue(undefined);
    useUserProfileMock.mockReturnValue(
      buildHookValue({
        userProfile: {
          authUid: 'user-123',
          experienceLevel: 'beginner',
          preferredLocations: ['gym', 'park'],
          defaultLocation: 'gym',
          homeEquipment: {},
          contextProfiles: {},
          createdAt: null,
          updatedAt: null,
        },
      })
    );

    const { getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Parallel bars'));
    fireEvent.press(getByText('Machine access'));
    fireEvent.press(getByText('Save contexts'));

    await waitFor(() => {
      expect(updateContextProfileMock).toHaveBeenCalledWith({
        location: 'park',
        profile: {
          templateId: 'park_v1',
          enabledCapabilities: ['pullup_bar', 'rings_anchor'],
        },
      });
    });

    await waitFor(() => {
      expect(updateContextProfileMock).toHaveBeenCalledWith({
        location: 'gym',
        profile: {
          templateId: 'gym_v1',
          enabledCapabilities: ['dumbbells', 'barbell', 'bench', 'bands', 'kettlebell'],
        },
      });
    });

    expect(updateContextProfileMock).toHaveBeenCalledTimes(2);
  });

  it('surfaces a consistent inline error when saving the operational profile fails', async () => {
    updateUserProfilePreferencesMock.mockRejectedValue(new Error('boom'));
    updateHomeEquipmentMock.mockResolvedValue(undefined);
    useUserProfileMock.mockReturnValue(buildHookValue());

    const { getAllByText, getByText, findByText } = render(<ProfileScreen />);

    fireEvent.press(getAllByText('Advanced')[0]);
    fireEvent.press(getByText('Save profile'));

    expect(
      await findByText('We could not save your operational profile.')
    ).toBeTruthy();
  });

  it('shows retry as busy when bootstrap recovery is already in progress', () => {
    useUserProfileMock.mockReturnValue(
      buildHookValue({
        userProfile: null,
        error: new Error('missing'),
        isCreatingProfile: true,
      })
    );

    const { getByLabelText, getByText } = render(<ProfileScreen />);

    expect(getByText('Profile setup needs attention')).toBeTruthy();
    expect(getByLabelText('Loading...').props.accessibilityState).toMatchObject({
      disabled: true,
      busy: true,
    });
  });

  it('bootstraps the Firestore profile when the document does not exist yet', async () => {
    createUserProfileMock.mockResolvedValue(undefined);

    useUserProfileMock.mockReturnValue(
      buildHookValue({
        userProfile: null,
      })
    );

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

  it('disables logout while sign-out is pending and shows inline feedback on failure', async () => {
    let mockRejectSignOut: ((reason?: unknown) => void) | undefined;
    mockSignOut.mockReturnValue(
      new Promise((_, reject) => {
        mockRejectSignOut = reject;
      })
    );
    useUserProfileMock.mockReturnValue(buildHookValue());

    const { getByLabelText, getByText, findByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Sign Out'));
    fireEvent.press(getByText('Yes, sign out'));

    expect(mockSignOut).toHaveBeenCalled();
    expect(getByLabelText('Sign Out').props.accessibilityState).toMatchObject({
      disabled: true,
      busy: true,
    });

    if (mockRejectSignOut) {
      mockRejectSignOut(new Error('logout failed'));
    }

    expect(await findByText('Could not sign out.')).toBeTruthy();
  });
});
