import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@shared/lib/firebase';

import {
  onAuthChange,
  signIn,
  signOut,
  signUp,
  waitForInitialAuthState,
} from '@features/auth/services/auth-service';

jest.mock('@shared/lib/firebase', () => ({
  auth: { appName: 'test-auth', authStateReady: jest.fn(), currentUser: null },
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
    (auth as { currentUser: unknown }).currentUser = null;
  });

  it('delegates sign in to Firebase Auth', async () => {
    await signIn('coach@fitflow.ai', 'Secret123');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
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
      auth,
      'coach@fitflow.ai',
      'Secret123'
    );
    expect(sendEmailVerification).toHaveBeenCalledWith({ uid: 'abc123' });
  });

  it('subscribes to auth state changes through Firebase', () => {
    const callback = jest.fn();

    onAuthChange(callback);

    expect(onAuthStateChanged).toHaveBeenCalledWith(auth, callback);
  });

  it('waits for the initial Firebase auth hydration before reading currentUser', async () => {
    (auth.authStateReady as jest.Mock).mockResolvedValue(undefined);
    (auth as { currentUser: unknown }).currentUser = { uid: 'abc123' };

    await expect(waitForInitialAuthState()).resolves.toEqual({ uid: 'abc123' });
    expect(auth.authStateReady).toHaveBeenCalled();
  });

  it('delegates sign out to Firebase Auth', async () => {
    await signOut();

    expect(firebaseSignOut).toHaveBeenCalledWith(auth);
  });
});
