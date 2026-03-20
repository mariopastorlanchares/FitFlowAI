import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { LoginScreen } from '@features/auth/screens/login-screen';
import { RegisterScreen } from '@features/auth/screens/register-screen';

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'Icon',
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.appName': 'FitFlow AI',
        'common.createAccount': 'Create your account',
        'common.emailLabel': 'Email',
        'common.emailPlaceholder': 'Email address',
        'common.passwordLabel': 'Password',
        'common.passwordPlaceholder': 'Password',
        'common.confirmPasswordLabel': 'Confirm password',
        'common.confirmPasswordPlaceholder': 'Confirm password',
        'common.orConnectWith': 'Or connect with',
        'common.orRegisterWith': 'Or sign up with',
        'common.apple': 'Apple',
        'common.google': 'Google',
        'common.loading': 'Loading...',
        'login.title': 'FitFlow AI',
        'login.eyebrow': 'Quick access',
        'login.subtitle':
          'Get back to today’s workout, your latest logs and the execution flow without losing context.',
        'login.helper':
          'Use the account linked to your training history so the app can recover your progress and recommendations.',
        'login.cta': 'Sign In',
        'login.noAccountText': 'New to FitFlow AI?',
        'login.noAccountLink': 'Sign Up',
        'login.errorEmptyFields': 'Please enter your email and password.',
        'register.eyebrow': 'New account',
        'register.subtitle':
          'Create a focused training account before we connect routines, recovery data and AI suggestions.',
        'register.helper':
          'We will send a verification email before enabling the rest of the flow.',
        'register.cta': 'Sign Up',
        'register.hasAccountText': 'Already have an account?',
        'register.hasAccountLink': 'Sign In',
        'register.errorEmptyFields': 'Please fill in all fields.',
        'register.errorPasswordsDontMatch': 'Passwords do not match.',
        'register.errorPasswordWeak':
          'Password must be at least 8 characters long, contain one number and one uppercase letter.',
        'register.emailVerificationSent':
          'We have sent you a confirmation email. Please check your inbox.',
        'register.successTitle': 'Registration successful!',
      };

      return translations[key] ?? key;
    },
  }),
}));

jest.mock('@features/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
  }),
}));

jest.mock('@shared/lib/i18n', () => ({
  getFirebaseErrorMessage: () => 'Unexpected auth error',
}));

describe('Auth screens', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignUp.mockReset();
  });

  it('shows login validation feedback when fields are empty', () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText('Sign In'));

    expect(getByText('Please enter your email and password.')).toBeTruthy();
  });

  it('submits trimmed credentials from login', async () => {
    mockSignIn.mockResolvedValue(undefined);

    const { getByLabelText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByLabelText('Email'), ' athlete@example.com ');
    fireEvent.changeText(getByLabelText('Password'), 'StrongPass1');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('athlete@example.com', 'StrongPass1');
    });
  });

  it('shows register validation feedback when passwords do not match', () => {
    const { getByLabelText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByLabelText('Email'), 'athlete@example.com');
    fireEvent.changeText(getByLabelText('Password'), 'StrongPass1');
    fireEvent.changeText(getByLabelText('Confirm password'), 'StrongPass2');
    fireEvent.press(getByText('Sign Up'));

    expect(getByText('Passwords do not match.')).toBeTruthy();
  });

  it('shows the success banner after register completes', async () => {
    mockSignUp.mockResolvedValue(undefined);

    const { getByLabelText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByLabelText('Email'), 'athlete@example.com');
    fireEvent.changeText(getByLabelText('Password'), 'StrongPass1');
    fireEvent.changeText(getByLabelText('Confirm password'), 'StrongPass1');
    fireEvent.press(getByText('Sign Up'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('athlete@example.com', 'StrongPass1');
      expect(getByText('Registration successful!')).toBeTruthy();
      expect(
        getByText('We have sent you a confirmation email. Please check your inbox.')
      ).toBeTruthy();
    });
  });
});
