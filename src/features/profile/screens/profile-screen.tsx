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
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@features/auth/hooks/use-auth';
import { useUserProfile } from '../hooks/use-user-profile';
import { ProfileOptionRow } from '../components/profile-option-row';
import { ProfileOperationalSettingsCard } from '../components/profile-operational-settings-card';
import { ProfileTrainingStatusCard } from '../components/profile-training-status-card';
import { palette } from '@shared/constants/theme';
import { ConfirmModal } from '@shared/ui/confirm-modal';
import { getDefaultUserProfileInput } from '../utils/profile-defaults';
import {
  ExperienceLevel,
  HomeEquipment,
  HomeEquipmentId,
  TrainingLocation,
} from '@shared/types/user-profile';

function cloneHomeEquipment(homeEquipment: HomeEquipment): HomeEquipment {
  return Object.fromEntries(
    Object.entries(homeEquipment).map(([key, value]) => [key, value ? { ...value } : value])
  ) as HomeEquipment;
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
    isUpdatingPreferences,
    isUpdatingHomeEquipment,
  } = useUserProfile();
  const userEmail = user?.email || t('profile.noEmail');

  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [draftExperienceLevel, setDraftExperienceLevel] = useState<ExperienceLevel>('beginner');
  const [draftPreferredLocations, setDraftPreferredLocations] = useState<TrainingLocation[]>([
    'gym',
    'home',
  ]);
  const [draftDefaultLocation, setDraftDefaultLocation] = useState<TrainingLocation>('gym');
  const [draftHomeEquipment, setDraftHomeEquipment] = useState<HomeEquipment>({});
  const hasAttemptedBootstrap = useRef(false);

  useEffect(() => {
    hasAttemptedBootstrap.current = false;
  }, [user?.uid]);

  useEffect(() => {
    if (!userProfile) {
      return;
    }

    setDraftExperienceLevel(userProfile.experienceLevel);
    setDraftPreferredLocations(userProfile.preferredLocations);
    setDraftDefaultLocation(userProfile.defaultLocation);
    setDraftHomeEquipment(cloneHomeEquipment(userProfile.homeEquipment));
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

    try {
      await signOut();
    } catch {
      Alert.alert(t('common.error'), t('profile.logoutError'));
    }
  };

  const handleRetryProfileBootstrap = async () => {
    hasAttemptedBootstrap.current = true;

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

  const handleTogglePreferredLocation = (location: TrainingLocation) => {
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

  const handleSaveOperationalProfile = async () => {
    if (!userProfile) {
      return;
    }

    try {
      await Promise.all([
        updateUserProfilePreferences({
          preferredLocations: draftPreferredLocations,
          defaultLocation: draftDefaultLocation,
        }),
        updateHomeEquipment(draftHomeEquipment),
      ]);
    } catch {
      Alert.alert(t('common.error'), t('profile.operational.saveError'));
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
              onSelectExperienceLevel={setDraftExperienceLevel}
              onTogglePreferredLocation={handleTogglePreferredLocation}
              onSelectDefaultLocation={setDraftDefaultLocation}
              onToggleHomeEquipment={handleToggleHomeEquipment}
              onSave={handleSaveOperationalProfile}
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

        <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLogoutVisible(true)}>
          <LogOut size={20} color={palette.danger} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

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
  logoutText: {
    color: palette.danger,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});
