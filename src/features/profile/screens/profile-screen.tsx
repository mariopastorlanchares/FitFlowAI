import {
  CircleHelp,
  Globe,
  LogOut,
  Settings,
  Shield,
  User as UserIcon,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@features/auth/hooks/use-auth';
import { ProfileContextSettingsCard } from '../components/profile-context-settings-card';
import { useUserProfile } from '../hooks/use-user-profile';
import { ProfileOptionRow } from '../components/profile-option-row';
import { ProfileOperationalSettingsCard } from '../components/profile-operational-settings-card';
import { ProfileTrainingStatusCard } from '../components/profile-training-status-card';
import { palette } from '@shared/constants/theme';
import { ConfirmModal } from '@shared/ui/confirm-modal';
import { StatusBanner } from '@shared/ui/status-banner';
import { getDefaultUserProfileInput } from '../utils/profile-defaults';
import {
  ContextCapabilityId,
  ContextProfile,
  ExperienceLevel,
  HomeEquipment,
  HomeEquipmentId,
  TrainingLocation,
  UserProfile,
} from '@shared/types/user-profile';
import {
  EDITABLE_CONTEXT_PROFILE_LOCATIONS,
  EditableContextProfileLocation,
  getEffectiveContextProfile,
  isContextProfileDirty,
  normalizeContextCapabilitiesOrder,
} from '../utils/context-profile-templates';

function cloneHomeEquipment(homeEquipment: HomeEquipment): HomeEquipment {
  return Object.fromEntries(
    Object.entries(homeEquipment).map(([key, value]) => [key, value ? { ...value } : value])
  ) as HomeEquipment;
}

function createDraftContextProfiles(userProfile: UserProfile | null) {
  return Object.fromEntries(
    EDITABLE_CONTEXT_PROFILE_LOCATIONS.map((location) => [
      location,
      getEffectiveContextProfile(userProfile, location),
    ])
  ) as Record<EditableContextProfileLocation, Omit<ContextProfile, 'updatedAt'>>;
}

export function ProfileScreen() {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const {
    userProfile,
    isLoading: isUserProfileLoading,
    error: userProfileError,
    createUserProfile,
    isCreatingProfile,
    updateUserProfilePreferences,
    updateHomeEquipment,
    updateContextProfile,
    isUpdatingPreferences,
    isUpdatingHomeEquipment,
    isUpdatingContextProfile,
  } = useUserProfile();
  const userEmail = user?.email || t('profile.noEmail');

  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [draftExperienceLevel, setDraftExperienceLevel] = useState<ExperienceLevel>('beginner');
  const [draftPreferredLocations, setDraftPreferredLocations] = useState<TrainingLocation[]>([
    'gym',
    'home',
  ]);
  const [draftDefaultLocation, setDraftDefaultLocation] = useState<TrainingLocation>('gym');
  const [draftHomeEquipment, setDraftHomeEquipment] = useState<HomeEquipment>({});
  const [draftContextProfiles, setDraftContextProfiles] = useState(() =>
    createDraftContextProfiles(null)
  );
  const hasAttemptedBootstrap = useRef(false);

  useEffect(() => {
    hasAttemptedBootstrap.current = false;
    setActionError(null);
  }, [user?.uid]);

  useEffect(() => {
    if (!userProfile) {
      return;
    }

    setDraftExperienceLevel(userProfile.experienceLevel);
    setDraftPreferredLocations(userProfile.preferredLocations);
    setDraftDefaultLocation(userProfile.defaultLocation);
    setDraftHomeEquipment(cloneHomeEquipment(userProfile.homeEquipment));
    setDraftContextProfiles(createDraftContextProfiles(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    if (isUserProfileLoading || isCreatingProfile || userProfile || userProfileError) {
      return;
    }

    if (hasAttemptedBootstrap.current) {
      return;
    }

    hasAttemptedBootstrap.current = true;

    createUserProfile(getDefaultUserProfileInput()).catch(() => {
      // Error state is surfaced by the hook and rendered by the screen.
    });
  }, [
    createUserProfile,
    isCreatingProfile,
    isUserProfileLoading,
    user?.uid,
    userProfile,
    userProfileError,
  ]);

  const confirmLogout = async () => {
    setIsLogoutVisible(false);
    setActionError(null);
    setIsSigningOut(true);

    try {
      await signOut();
    } catch {
      setActionError(t('profile.logoutError'));
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleRetryProfileBootstrap = async () => {
    hasAttemptedBootstrap.current = true;
    setActionError(null);

    try {
      await createUserProfile(getDefaultUserProfileInput());
    } catch {
      // Error banner/card state is enough for this V1 slice.
    }
  };

  const profileStatus = userProfile
    ? 'ready'
    : userProfileError
      ? 'error'
      : 'loading';

  const isSavingOperationalProfile = isUpdatingPreferences || isUpdatingHomeEquipment;
  const isSavingContextProfiles = isUpdatingContextProfile;

  const handleTogglePreferredLocation = (location: TrainingLocation) => {
    setActionError(null);
    setDraftPreferredLocations((current) => {
      const isSelected = current.includes(location);

      if (isSelected && current.length === 1) {
        return current;
      }

      const nextLocations = isSelected
        ? current.filter((item) => item !== location)
        : [...current, location];

      if (!nextLocations.includes(draftDefaultLocation)) {
        setDraftDefaultLocation(nextLocations[0] ?? 'gym');
      }

      return nextLocations;
    });
  };

  const handleToggleHomeEquipment = (equipmentId: HomeEquipmentId) => {
    setActionError(null);
    setDraftHomeEquipment((current) => {
      const nextEquipment = { ...current };

      if (equipmentId in nextEquipment) {
        delete nextEquipment[equipmentId];
      } else {
        nextEquipment[equipmentId] = {};
      }

      return nextEquipment;
    });
  };

  const handleToggleContextCapability = (
    location: EditableContextProfileLocation,
    capabilityId: ContextCapabilityId
  ) => {
    setActionError(null);
    setDraftContextProfiles((current) => {
      const currentProfile = current[location];
      const isEnabled = currentProfile.enabledCapabilities.includes(capabilityId);
      const nextCapabilities = isEnabled
        ? currentProfile.enabledCapabilities.filter((item) => item !== capabilityId)
        : [...currentProfile.enabledCapabilities, capabilityId];

      return {
        ...current,
        [location]: {
          ...currentProfile,
          enabledCapabilities: normalizeContextCapabilitiesOrder(location, nextCapabilities),
        },
      };
    });
  };

  const handleSaveOperationalProfile = async () => {
    if (!userProfile) {
      return;
    }

    setActionError(null);

    try {
      await Promise.all([
        updateUserProfilePreferences({
          preferredLocations: draftPreferredLocations,
          defaultLocation: draftDefaultLocation,
        }),
        updateHomeEquipment(draftHomeEquipment),
      ]);
    } catch {
      setActionError(t('profile.operational.saveError'));
    }
  };

  const handleSaveContextProfiles = async () => {
    if (!userProfile) {
      return;
    }

    const dirtyLocations = EDITABLE_CONTEXT_PROFILE_LOCATIONS.filter((location) =>
      isContextProfileDirty(userProfile, location, draftContextProfiles[location])
    );

    if (dirtyLocations.length === 0) {
      return;
    }

    setActionError(null);

    try {
      await Promise.all(
        dirtyLocations.map((location) =>
          updateContextProfile({
            location,
            profile: draftContextProfiles[location],
          })
        )
      );
    } catch {
      setActionError(t('profile.contexts.saveError'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <UserIcon size={40} color={palette.background} />
          </View>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>

        {actionError ? (
          <View style={styles.feedbackSection}>
            <StatusBanner kind="error" title={t('common.error')} body={actionError} />
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.sections.training')}</Text>
          <ProfileTrainingStatusCard
            status={profileStatus}
            userProfile={userProfile}
            onRetry={handleRetryProfileBootstrap}
            isRetrying={isCreatingProfile}
          />
        </View>

        {profileStatus === 'ready' && userProfile ? (
          <View style={styles.section}>
            <ProfileOperationalSettingsCard
              userProfile={userProfile}
              draftExperienceLevel={draftExperienceLevel}
              draftPreferredLocations={draftPreferredLocations}
              draftDefaultLocation={draftDefaultLocation}
              draftHomeEquipment={draftHomeEquipment}
              isSaving={isSavingOperationalProfile}
              onSelectExperienceLevel={(value) => {
                setActionError(null);
                setDraftExperienceLevel(value);
              }}
              onTogglePreferredLocation={handleTogglePreferredLocation}
              onSelectDefaultLocation={(value) => {
                setActionError(null);
                setDraftDefaultLocation(value);
              }}
              onToggleHomeEquipment={handleToggleHomeEquipment}
              onSave={handleSaveOperationalProfile}
            />
          </View>
        ) : null}

        {profileStatus === 'ready' && userProfile ? (
          <View style={styles.section}>
            <ProfileContextSettingsCard
              userProfile={userProfile}
              draftContextProfiles={draftContextProfiles}
              isSaving={isSavingContextProfiles}
              onToggleCapability={handleToggleContextCapability}
              onSave={handleSaveContextProfiles}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.sections.account')}</Text>
          <View style={styles.card}>
            <ProfileOptionRow
              icon={<UserIcon size={20} color={palette.textPrimary} />}
              title={t('profile.options.personalInfo')}
              hasTopBorder={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.sections.preferences')}</Text>
          <View style={styles.card}>
            <ProfileOptionRow
              icon={<Settings size={20} color={palette.textPrimary} />}
              title={t('profile.options.theme')}
              hasTopBorder={false}
            />
            <ProfileOptionRow
              icon={<Globe size={20} color={palette.textPrimary} />}
              title={t('profile.options.language')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.sections.support')}</Text>
          <View style={styles.card}>
            <ProfileOptionRow
              icon={<CircleHelp size={20} color={palette.textPrimary} />}
              title={t('profile.options.help')}
              hasTopBorder={false}
            />
            <ProfileOptionRow
              icon={<Shield size={20} color={palette.textPrimary} />}
              title={t('profile.options.privacy')}
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('profile.logout')}
          accessibilityHint={t('profile.logoutHint')}
          accessibilityState={{ disabled: isSigningOut, busy: isSigningOut }}
          disabled={isSigningOut}
          style={({ pressed }) => [
            styles.logoutButton,
            isSigningOut ? styles.logoutButtonBusy : null,
            pressed && !isSigningOut ? styles.logoutButtonPressed : null,
          ]}
          onPress={() => {
            setActionError(null);
            setIsLogoutVisible(true);
          }}
        >
          <LogOut size={20} color={palette.danger} />
          <Text style={styles.logoutText}>
            {isSigningOut ? t('common.loading') : t('profile.logout')}
          </Text>
          {isSigningOut ? <ActivityIndicator color={palette.danger} size="small" /> : null}
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <ConfirmModal
        visible={isLogoutVisible}
        title={t('profile.logoutConfirmTitle')}
        message={t('profile.logoutConfirmMessage')}
        cancelText={t('profile.logoutCancel')}
        confirmText={t('profile.logoutConfirm')}
        onCancel={() => setIsLogoutVisible(false)}
        onConfirm={confirmLogout}
        isDestructive
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: palette.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  emailText: {
    color: palette.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  feedbackSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: palette.textSecondary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: palette.surface,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  logoutButtonBusy: {
    opacity: 0.72,
  },
  logoutButtonPressed: {
    opacity: 0.88,
  },
  logoutText: {
    color: palette.danger,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});
