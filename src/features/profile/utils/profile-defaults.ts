import { CreateUserProfileInput } from '@shared/types/user-profile';

export function getDefaultUserProfileInput(): Omit<CreateUserProfileInput, 'authUid'> {
  return {
    experienceLevel: 'beginner',
    preferredLocations: ['gym', 'home'],
    defaultLocation: 'gym',
    homeEquipment: {},
    contextProfiles: {},
  };
}
