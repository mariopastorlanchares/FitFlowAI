import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';

import { onAuthChange, signIn, signOut, signUp } from '@features/auth/services/auth-service';

jest.mock('@shared/lib/firebase', () => ({
  auth: { appName: 'test-auth' },
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendEmailVerification: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

describe('auth-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates sign in to Firebase Auth', async () => {
    await signIn('coach@fitflow.ai', 'Secret123');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      { appName: 'test-auth' },
      'coach@fitflow.ai',
      'Secret123'
    );
  });

  it('sends a verification email after successful sign up', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: 'abc123' },
    });

    await signUp('coach@fitflow.ai', 'Secret123');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      { appName: 'test-auth' },
      'coach@fitflow.ai',
      'Secret123'
    );
    expect(sendEmailVerification).toHaveBeenCalledWith({ uid: 'abc123' });
  });

  it('subscribes to auth state changes through Firebase', () => {
    const callback = jest.fn();

    onAuthChange(callback);

    expect(onAuthStateChanged).toHaveBeenCalledWith({ appName: 'test-auth' }, callback);
  });

  it('delegates sign out to Firebase Auth', async () => {
    await signOut();

    expect(firebaseSignOut).toHaveBeenCalledWith({ appName: 'test-auth' });
  });
});
