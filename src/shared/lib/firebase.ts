import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-ignore - Export present at runtime
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Platform } from 'react-native';

/**
 * Firebase config loaded from environment variables.
 * Values come from .env (EXPO_PUBLIC_ prefix required by Expo).
 * To find them again: Firebase Console → ⚙️ Settings → General → Your apps.
 */
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "dummy",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "dummy",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "dummy",
};

let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

let auth: Auth;
try {
    if (Platform.OS === 'web') {
        auth = getAuth(app);
    } else {
        // Attempt to initialize auth with persistence
        auth = initializeAuth(app, {
            // @ts-ignore - Some Firebase declaration versions don't export this properly even though it exists.
            persistence: getReactNativePersistence(AsyncStorage)
        });
    }
} catch (error) {
    // If it's already initialized (e.g. in hot reload), use getAuth
    auth = getAuth(app);
}

export { app, auth };

