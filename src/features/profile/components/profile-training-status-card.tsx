import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { UserProfile } from '@shared/types/user-profile';
import { fonts, palette } from '@shared/constants/theme';
import { PrimaryButton } from '@shared/ui/primary-button';

type ProfileTrainingStatus = 'loading' | 'ready' | 'error';

interface ProfileTrainingStatusCardProps {
  status: ProfileTrainingStatus;
  userProfile: UserProfile | null;
  onRetry: () => void;
  isRetrying: boolean;
}

function getHomeEquipmentCount(userProfile: UserProfile | null) {
  if (!userProfile) {
    return 0;
  }

  return Object.keys(userProfile.homeEquipment).length;
}

function getContextProfileCount(userProfile: UserProfile | null) {
  if (!userProfile) {
    return 0;
  }

  return Object.keys(userProfile.contextProfiles).length;
}

export function ProfileTrainingStatusCard({
  status,
  userProfile,
  onRetry,
  isRetrying,
}: ProfileTrainingStatusCardProps) {
  const { t } = useTranslation();

  const statusTone =
    status === 'ready'
      ? styles.statusReady
      : status === 'error'
        ? styles.statusError
        : styles.statusLoading;

  const statusLabel = t(`profile.training.status.${status}`);
  const titleKey =
    status === 'ready'
      ? 'profile.training.readyTitle'
      : status === 'error'
        ? 'profile.training.errorTitle'
        : 'profile.training.loadingTitle';
  const bodyKey =
    status === 'ready'
      ? 'profile.training.readyBody'
      : status === 'error'
        ? 'profile.training.errorBody'
        : 'profile.training.loadingBody';

  const preferredLocations = userProfile?.preferredLocations.length
    ? userProfile.preferredLocations
        .map((location) => t(`dashboard.context.locationOptions.${location}`))
        .join(' · ')
    : t('profile.training.values.empty');

  const defaultLocation = userProfile
    ? t(`dashboard.context.locationOptions.${userProfile.defaultLocation}`)
    : t('profile.training.values.empty');

  const experienceLevel = userProfile
    ? t(`profile.training.experienceLevels.${userProfile.experienceLevel}`)
    : t('profile.training.values.empty');

  const homeEquipmentCount = getHomeEquipmentCount(userProfile);
  const contextProfileCount = getContextProfileCount(userProfile);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>{t('profile.training.eyebrow')}</Text>
          <Text style={styles.title}>{t(titleKey)}</Text>
        </View>
        <View style={[styles.statusPill, statusTone]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={styles.description}>{t(bodyKey)}</Text>

      {status === 'ready' && userProfile ? (
        <View style={styles.metrics}>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('profile.training.fields.experienceLevel')}</Text>
            <Text selectable style={styles.metricValue}>
              {experienceLevel}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('profile.training.fields.defaultLocation')}</Text>
            <Text selectable style={styles.metricValue}>
              {defaultLocation}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>
              {t('profile.training.fields.preferredLocations')}
            </Text>
            <Text selectable style={styles.metricValue}>
              {preferredLocations}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('profile.training.fields.homeEquipment')}</Text>
            <Text selectable style={styles.metricValue}>
              {t('profile.training.values.homeEquipmentCount', { count: homeEquipmentCount })}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>{t('profile.training.fields.contextProfiles')}</Text>
            <Text selectable style={styles.metricValue}>
              {t('profile.training.values.contextProfilesCount', { count: contextProfileCount })}
            </Text>
          </View>
        </View>
      ) : null}

      {status === 'error' ? (
        <View style={styles.retryContainer}>
          <PrimaryButton
            label={isRetrying ? t('common.loading') : t('profile.training.actions.retry')}
            onPress={onRetry}
            isLoading={isRetrying}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    color: palette.primary,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.textPrimary,
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  statusPill: {
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusLoading: {
    backgroundColor: palette.primaryTintSoft,
    borderColor: palette.primaryBorder,
  },
  statusReady: {
    backgroundColor: palette.successTint,
    borderColor: palette.successBorder,
  },
  statusError: {
    backgroundColor: palette.dangerTint,
    borderColor: palette.dangerBorder,
  },
  statusText: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
  description: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  metrics: {
    backgroundColor: palette.surfaceInset,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    padding: 14,
    gap: 12,
  },
  metricRow: {
    gap: 4,
  },
  metricLabel: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  retryContainer: {
    paddingTop: 4,
  },
});
