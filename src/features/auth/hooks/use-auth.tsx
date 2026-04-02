import { User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  onAuthChange,
  signIn as signInService,
  signOut as signOutService,
  signUp as signUpService,
  waitForInitialAuthState,
} from '../services/auth-service';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (!isMounted) {
        return;
      }

      setUser(firebaseUser);
    });

    waitForInitialAuthState()
      .then((initialUser) => {
        if (!isMounted) {
          return;
        }

        setUser(initialUser);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    signIn: signInService,
    signUp: signUpService,
    signOut: signOutService,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
