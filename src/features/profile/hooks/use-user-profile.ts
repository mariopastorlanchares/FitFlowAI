import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@features/auth/hooks/use-auth';
import {
  createUserProfile,
  getUserProfile,
  updateContextProfile,
  updateHomeEquipment,
  updateUserProfilePreferences,
} from '../services/profile-service';
import {
  ContextProfile,
  ContextProfileLocation,
  CreateUserProfileInput,
  HomeEquipment,
  TrainingLocation,
} from '@shared/types/user-profile';

const userProfileQueryKey = (authUid: string) => ['user-profile', authUid] as const;

function requireAuthUid(authUid: string | null): string {
  if (!authUid) {
    throw new Error('User profile operations require an authenticated user.');
  }

  return authUid;
}

export function useUserProfile() {
  const { user } = useAuth();
  const authUid = user?.uid ?? null;
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: authUid ? userProfileQueryKey(authUid) : ['user-profile', 'anonymous'],
    queryFn: () => getUserProfile(requireAuthUid(authUid)),
    enabled: Boolean(authUid),
  });

  const invalidateUserProfile = async () => {
    if (!authUid) {
      return;
    }

    await queryClient.invalidateQueries({ queryKey: userProfileQueryKey(authUid) });
  };

  const createProfileMutation = useMutation({
    mutationFn: (input: Omit<CreateUserProfileInput, 'authUid'>) =>
      createUserProfile({ ...input, authUid: requireAuthUid(authUid) }),
    onSuccess: invalidateUserProfile,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (payload: {
      preferredLocations: TrainingLocation[];
      defaultLocation: TrainingLocation;
    }) => updateUserProfilePreferences(requireAuthUid(authUid), payload),
    onSuccess: invalidateUserProfile,
  });

  const updateHomeEquipmentMutation = useMutation({
    mutationFn: (homeEquipment: HomeEquipment) =>
      updateHomeEquipment(requireAuthUid(authUid), homeEquipment),
    onSuccess: invalidateUserProfile,
  });

  const updateContextProfileMutation = useMutation({
    mutationFn: ({
      location,
      profile,
    }: {
      location: ContextProfileLocation;
      profile: Omit<ContextProfile, 'updatedAt'>;
    }) => updateContextProfile(requireAuthUid(authUid), location, profile),
    onSuccess: invalidateUserProfile,
  });

  return {
    userProfile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    error:
      profileQuery.error ??
      createProfileMutation.error ??
      updatePreferencesMutation.error ??
      updateHomeEquipmentMutation.error ??
      updateContextProfileMutation.error ??
      null,
    refetch: profileQuery.refetch,
    createUserProfile: createProfileMutation.mutateAsync,
    updateUserProfilePreferences: updatePreferencesMutation.mutateAsync,
    updateHomeEquipment: updateHomeEquipmentMutation.mutateAsync,
    updateContextProfile: updateContextProfileMutation.mutateAsync,
    isCreatingProfile: createProfileMutation.isPending,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    isUpdatingHomeEquipment: updateHomeEquipmentMutation.isPending,
    isUpdatingContextProfile: updateContextProfileMutation.isPending,
  };
}
