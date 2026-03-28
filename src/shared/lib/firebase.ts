import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// @ts-ignore - Export present at runtime
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

/**
 * Firebase config loaded from environment variables.
 * Values come from .env (EXPO_PUBLIC_ prefix required by Expo).
 * To find them again: Firebase Console → ⚙️ Settings → General → Your apps.
 */
const firebaseEnv = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missingFirebaseEnvVars = Object.entries({
    EXPO_PUBLIC_FIREBASE_API_KEY: firebaseEnv.apiKey,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseEnv.authDomain,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: firebaseEnv.projectId,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseEnv.storageBucket,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseEnv.messagingSenderId,
    EXPO_PUBLIC_FIREBASE_APP_ID: firebaseEnv.appId,
}).flatMap(([envVar, value]) =>
    typeof value === 'string' && value.trim().length > 0 ? [] : [envVar]
);

if (missingFirebaseEnvVars.length > 0) {
    throw new Error(
        `Missing Firebase environment variables: ${missingFirebaseEnvVars.join(', ')}. ` +
        'Create a .env file from .env.example and copy the Firebase web app config from Firebase Console.'
    );
}

const firebaseConfig = {
    apiKey: firebaseEnv.apiKey,
    authDomain: firebaseEnv.authDomain,
    projectId: firebaseEnv.projectId,
    storageBucket: firebaseEnv.storageBucket,
    messagingSenderId: firebaseEnv.messagingSenderId,
    appId: firebaseEnv.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

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
} catch {
    // If it's already initialized (e.g. in hot reload), use getAuth
    auth = getAuth(app);
}

const db = getFirestore(app);
const functionsRegion = 'europe-west1';
const functionsEmulatorHost = process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST;
const functionsEmulatorPort = Number(
    process.env.EXPO_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT ?? '5001'
);

let functionsClientPromise: Promise<any> | null = null;

export async function getFirebaseFunctionsClient() {
    if (!functionsClientPromise) {
        functionsClientPromise = import('firebase/functions').then(
            ({ connectFunctionsEmulator, getFunctions }) => {
                const functions = getFunctions(app, functionsRegion);

                if (
                    typeof functionsEmulatorHost === 'string' &&
                    functionsEmulatorHost.trim().length > 0 &&
                    Number.isInteger(functionsEmulatorPort)
                ) {
                    connectFunctionsEmulator(functions, functionsEmulatorHost, functionsEmulatorPort);
                }

                return functions;
            }
        );
    }

    return functionsClientPromise;
}

export { app, auth, db };

