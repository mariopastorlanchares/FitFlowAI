import { render } from '@testing-library/react-native';
import React from 'react';
import ProfileScreen from '../app/(tabs)/profile';

// Mock the translations
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: any = {
                'profile.title': 'My Profile',
                'profile.noEmail': 'No email associated',
                'profile.logout': 'Sign Out',
                'profile.sections.account': 'Account',
                'profile.options.personalInfo': 'Personal Information',
                'profile.sections.preferences': 'Preferences',
                'profile.options.theme': 'Theme',
                'profile.options.language': 'Language',
                'profile.sections.support': 'Support',
                'profile.options.help': 'Help Center',
                'profile.options.privacy': 'Privacy Policy'
            };
            return translations[key] || key;
        },
    }),
}));

// Mock Firebase Auth
jest.mock('@/lib/firebase', () => ({
    auth: {
        currentUser: {
            email: 'test@example.com',
        },
    },
}));

// Mock Firebase signOut
jest.mock('firebase/auth', () => ({
    signOut: jest.fn(),
}));

describe('ProfileScreen', () => {
    it('renders correctly with user email', () => {
        const { getByText } = render(<ProfileScreen />);

        // Check if the title is rendered
        expect(getByText('My Profile')).toBeTruthy();

        // Check if the mocked user email is rendered
        expect(getByText('test@example.com')).toBeTruthy();

        // Check if sections are rendered
        expect(getByText('Account')).toBeTruthy();
        expect(getByText('Preferences')).toBeTruthy();
        expect(getByText('Support')).toBeTruthy();
    });

    it('contains the logout button', () => {
        const { getByText } = render(<ProfileScreen />);

        // Check if the logout button is rendered
        expect(getByText('Sign Out')).toBeTruthy();
    });
});
