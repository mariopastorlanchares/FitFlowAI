import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@shared/lib/firebase';
import {
  ContextProfile,
  ContextProfileLocation,
  HomeEquipment,
  TrainingLocation,
  UserProfile,
  CreateUserProfileInput,
} from '@shared/types/user-profile';
import { getDefaultUserProfileInput } from '../utils/profile-defaults';

const USER_PROFILES_COLLECTION = 'userProfiles';

function userProfileRef(authUid: string) {
  return doc(db, USER_PROFILES_COLLECTION, authUid);
}

function resolveDefaultLocation(
  preferredLocations?: TrainingLocation[],
  defaultLocation?: TrainingLocation
): TrainingLocation {
  if (defaultLocation) {
    return defaultLocation;
  }

  if (preferredLocations && preferredLocations.length > 0) {
    return preferredLocations[0];
  }

  return 'gym';
}

function normalizeUserProfile(authUid: string, data: Record<string, unknown>): UserProfile {
  const preferredLocations = (data.preferredLocations as TrainingLocation[]) ?? ['gym', 'home'];

  return {
    authUid,
    experienceLevel: (data.experienceLevel as UserProfile['experienceLevel']) ?? 'beginner',
    preferredLocations,
    defaultLocation: resolveDefaultLocation(
      preferredLocations,
      data.defaultLocation as TrainingLocation | undefined
    ),
    homeEquipment: (data.homeEquipment as HomeEquipment) ?? {},
    contextProfiles:
      (data.contextProfiles as UserProfile['contextProfiles']) ?? {},
    createdAt: (data.createdAt as UserProfile['createdAt']) ?? null,
    updatedAt: (data.updatedAt as UserProfile['updatedAt']) ?? null,
  };
}

export async function getUserProfile(authUid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(userProfileRef(authUid));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeUserProfile(authUid, snapshot.data());
}

export async function createUserProfile(input: CreateUserProfileInput) {
  const existingSnapshot = await getDoc(userProfileRef(input.authUid));

  if (existingSnapshot.exists()) {
    return normalizeUserProfile(input.authUid, existingSnapshot.data());
  }

  const defaults = getDefaultUserProfileInput();
  const preferredLocations = input.preferredLocations ?? defaults.preferredLocations;
  const defaultLocation = resolveDefaultLocation(preferredLocations, input.defaultLocation);

  await setDoc(userProfileRef(input.authUid), {
    authUid: input.authUid,
    experienceLevel: input.experienceLevel ?? defaults.experienceLevel,
    preferredLocations,
    defaultLocation,
    homeEquipment: input.homeEquipment ?? defaults.homeEquipment,
    contextProfiles: input.contextProfiles ?? defaults.contextProfiles,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    authUid: input.authUid,
    experienceLevel: input.experienceLevel ?? defaults.experienceLevel,
    preferredLocations,
    defaultLocation,
    homeEquipment: input.homeEquipment ?? defaults.homeEquipment,
    contextProfiles: input.contextProfiles ?? {},
    createdAt: null,
    updatedAt: null,
  };
}

export async function updateUserProfilePreferences(
  authUid: string,
  payload: {
    preferredLocations: TrainingLocation[];
    defaultLocation: TrainingLocation;
  }
) {
  await updateDoc(userProfileRef(authUid), {
    preferredLocations: payload.preferredLocations,
    defaultLocation: payload.defaultLocation,
    updatedAt: serverTimestamp(),
  });
}

export async function updateHomeEquipment(authUid: string, homeEquipment: HomeEquipment) {
  await updateDoc(userProfileRef(authUid), {
    homeEquipment,
    updatedAt: serverTimestamp(),
  });
}

export async function updateContextProfile(
  authUid: string,
  location: ContextProfileLocation,
  profile: Omit<ContextProfile, 'updatedAt'>
) {
  await updateDoc(userProfileRef(authUid), {
    [`contextProfiles.${location}`]: {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });
}
