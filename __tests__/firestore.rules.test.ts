/** @jest-environment node */

import { readFileSync } from 'fs';
import path from 'path';

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const PROJECT_ID = 'demo-fitflowai';
const RULES_PATH = path.resolve(__dirname, '..', 'firestore.rules');

function getEmulatorConfig() {
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

  if (!emulatorHost) {
    throw new Error(
      'FIRESTORE_EMULATOR_HOST is not defined. Run this suite through `npm run test:firestore-rules`.'
    );
  }

  const [host, port] = emulatorHost.split(':');

  return {
    host,
    port: Number(port),
  };
}

function buildUserProfileDoc(authUid: string) {
  return {
    authUid,
    experienceLevel: 'beginner',
    preferredLocations: ['gym', 'home'],
    defaultLocation: 'gym',
    homeEquipment: {
      dumbbells: {
        isPair: true,
      },
    },
    contextProfiles: {
      park: {
        enabledCapabilities: ['pullup_bar'],
        templateId: 'park_v1',
      },
    },
    createdAt: new Date('2026-03-23T18:00:00Z'),
    updatedAt: new Date('2026-03-23T18:00:00Z'),
  };
}

function buildCompletedWorkoutSessionDoc(authUid: string) {
  return {
    authUid,
    source: 'live_generated',
    status: 'completed',
    workoutName: 'Strength session',
    context: {
      location: 'gym',
      duration: 'medium',
      energy: 'high',
    },
    displayBlocks: [],
    exercises: [],
    totalExercises: 2,
    totalSets: 6,
    completedSets: 6,
    startedAt: new Date('2026-04-02T18:00:00Z'),
    completedAt: new Date('2026-04-02T18:45:00Z'),
    createdAt: new Date('2026-04-02T18:45:00Z'),
    updatedAt: new Date('2026-04-02T18:45:00Z'),
  };
}

describe('firestore.rules', () => {
  let testEnv: RulesTestEnvironment;
  let consoleWarnSpy: jest.SpyInstance;

  beforeAll(async () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const emulator = getEmulatorConfig();

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        host: emulator.host,
        port: emulator.port,
        rules: readFileSync(RULES_PATH, 'utf8'),
      },
    });
  });

  afterEach(async () => {
    await testEnv.clearFirestore();
  });

  afterAll(async () => {
    await testEnv.cleanup();
    consoleWarnSpy.mockRestore();
  });

  it('allows an authenticated user to create and read their own profile', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const aliceProfileRef = doc(aliceDb, 'userProfiles/alice');

    await assertSucceeds(setDoc(aliceProfileRef, buildUserProfileDoc('alice')));
    await assertSucceeds(getDoc(aliceProfileRef));
  });

  it('denies reading another user profile', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'userProfiles/alice'), buildUserProfileDoc('alice'));
    });

    const bobDb = testEnv.authenticatedContext('bob').firestore();

    await assertFails(getDoc(doc(bobDb, 'userProfiles/alice')));
  });

  it('denies creating a profile with a mismatched authUid', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();

    await assertFails(setDoc(doc(aliceDb, 'userProfiles/alice'), buildUserProfileDoc('bob')));
  });

  it('denies changing authUid during update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'userProfiles/alice'), buildUserProfileDoc('alice'));
    });

    const aliceDb = testEnv.authenticatedContext('alice').firestore();

    await assertFails(
      updateDoc(doc(aliceDb, 'userProfiles/alice'), {
        authUid: 'mallory',
        updatedAt: new Date('2026-03-23T19:00:00Z'),
      })
    );
  });

  it('denies deleting the profile even for the owner', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'userProfiles/alice'), buildUserProfileDoc('alice'));
    });

    const aliceDb = testEnv.authenticatedContext('alice').firestore();

    await assertFails(deleteDoc(doc(aliceDb, 'userProfiles/alice')));
  });

  it('allows an authenticated user to create and read their own completed workout session', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const aliceWorkoutRef = doc(aliceDb, 'userProfiles/alice/workoutSessions/session-1');

    await assertSucceeds(setDoc(aliceWorkoutRef, buildCompletedWorkoutSessionDoc('alice')));
    await assertSucceeds(getDoc(aliceWorkoutRef));
  });

  it('denies reading another user workout session', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), 'userProfiles/alice/workoutSessions/session-1'),
        buildCompletedWorkoutSessionDoc('alice')
      );
    });

    const bobDb = testEnv.authenticatedContext('bob').firestore();

    await assertFails(getDoc(doc(bobDb, 'userProfiles/alice/workoutSessions/session-1')));
  });

  it('denies creating a workout session with a mismatched authUid', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();

    await assertFails(
      setDoc(
        doc(aliceDb, 'userProfiles/alice/workoutSessions/session-1'),
        buildCompletedWorkoutSessionDoc('bob')
      )
    );
  });

  it('allows idempotent owner updates for a stored completed workout session', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), 'userProfiles/alice/workoutSessions/session-1'),
        buildCompletedWorkoutSessionDoc('alice')
      );
    });

    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const sessionRef = doc(aliceDb, 'userProfiles/alice/workoutSessions/session-1');

    await assertSucceeds(
      updateDoc(sessionRef, {
        workoutName: 'Updated name',
        updatedAt: new Date('2026-04-02T19:00:00Z'),
      })
    );
  });

  it('denies changing authUid or status for a stored workout session', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(
        doc(context.firestore(), 'userProfiles/alice/workoutSessions/session-1'),
        buildCompletedWorkoutSessionDoc('alice')
      );
    });

    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const sessionRef = doc(aliceDb, 'userProfiles/alice/workoutSessions/session-1');

    await assertFails(
      updateDoc(sessionRef, {
        authUid: 'mallory',
        updatedAt: new Date('2026-04-02T19:00:00Z'),
      })
    );
    await assertFails(
      updateDoc(sessionRef, {
        status: 'in_progress',
        updatedAt: new Date('2026-04-02T19:00:00Z'),
      })
    );
    await assertFails(deleteDoc(sessionRef));
  });
});
