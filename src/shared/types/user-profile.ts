import type { Timestamp } from 'firebase/firestore';
import type {
  ContextCapabilityId,
  ContextProfileLocation,
  ExperienceLevel,
  HomeEquipment,
  TrainingLocation,
} from './workout-context';

export {
  CONTEXT_CAPABILITY_IDS,
  HOME_EQUIPMENT_IDS,
} from './workout-context';
export type {
  ContextCapabilityId,
  ContextProfileLocation,
  ExperienceLevel,
  HomeEquipment,
  HomeEquipmentId,
  TrainingLocation,
} from './workout-context';

export type ContextProfileTemplateId = 'gym_v1' | 'park_v1' | 'street_v1';

export interface ContextProfile {
  enabledCapabilities: ContextCapabilityId[];
  templateId: ContextProfileTemplateId;
  updatedAt: Timestamp | null;
}

export interface UserProfile {
  authUid: string;
  experienceLevel: ExperienceLevel;
  preferredLocations: TrainingLocation[];
  defaultLocation: TrainingLocation;
  homeEquipment: HomeEquipment;
  contextProfiles: Partial<Record<ContextProfileLocation, ContextProfile>>;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface CreateUserProfileInput {
  authUid: string;
  experienceLevel?: ExperienceLevel;
  preferredLocations?: TrainingLocation[];
  defaultLocation?: TrainingLocation;
  homeEquipment?: HomeEquipment;
  contextProfiles?: Partial<Record<ContextProfileLocation, Omit<ContextProfile, 'updatedAt'>>>;
}
