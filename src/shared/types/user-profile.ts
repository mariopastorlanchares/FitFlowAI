import { Timestamp } from 'firebase/firestore';

export type TrainingLocation = 'home' | 'gym' | 'street' | 'park';

export type ContextProfileLocation = Exclude<TrainingLocation, 'home'>;

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export const HOME_EQUIPMENT_IDS = [
  'dumbbells',
  'barbell',
  'bench',
  'bands',
  'pullup_bar',
  'kettlebell',
] as const;

export type HomeEquipmentId = (typeof HOME_EQUIPMENT_IDS)[number];

export const CONTEXT_CAPABILITY_IDS = [
  'dumbbells',
  'barbell',
  'bench',
  'bands',
  'pullup_bar',
  'kettlebell',
  'parallel_bars',
  'rings_anchor',
  'machine_access',
] as const;

export type ContextCapabilityId = (typeof CONTEXT_CAPABILITY_IDS)[number];

export interface DumbbellsProfile {
  isPair?: boolean;
  adjustable?: boolean;
  maxWeightKg?: number;
}

export interface BarbellProfile {
  platesAvailable?: boolean;
  maxLoadKg?: number;
}

export interface BenchProfile {
  adjustableIncline?: boolean;
}

export interface BandsProfile {
  hasMultipleTensions?: boolean;
}

export interface KettlebellProfile {
  availableWeightsKg?: number[];
}

export interface HomeEquipment {
  dumbbells?: DumbbellsProfile;
  barbell?: BarbellProfile;
  bench?: BenchProfile;
  bands?: BandsProfile;
  pullup_bar?: Record<string, never>;
  kettlebell?: KettlebellProfile;
}

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
