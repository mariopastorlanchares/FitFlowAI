import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  ExperienceLevel,
  HOME_EQUIPMENT_IDS,
  HomeEquipment,
  HomeEquipmentId,
  TrainingLocation,
  UserProfile,
} from '@shared/types/user-profile';
import { fonts, palette } from '@shared/constants/theme';
import { PrimaryButton } from '@shared/ui/primary-button';

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
const TRAINING_LOCATIONS: TrainingLocation[] = ['gym', 'home', 'street', 'park'];

interface ProfileOperationalSettingsCardProps {
  userProfile: UserProfile;
  draftExperienceLevel: ExperienceLevel;
  draftPreferredLocations: TrainingLocation[];
  draftDefaultLocation: TrainingLocation;
  draftHomeEquipment: HomeEquipment;
  isSaving: boolean;
  onSelectExperienceLevel: (value: ExperienceLevel) => void;
  onTogglePreferredLocation: (value: TrainingLocation) => void;
  onSelectDefaultLocation: (value: TrainingLocation) => void;
  onToggleHomeEquipment: (value: HomeEquipmentId) => void;
  onSave: () => void;
}

function isEquipmentSelected(homeEquipment: HomeEquipment, equipmentId: HomeEquipmentId) {
  return equipmentId in homeEquipment;
}

export function ProfileOperationalSettingsCard({
  userProfile,
  draftExperienceLevel,
  draftPreferredLocations,
  draftDefaultLocation,
  draftHomeEquipment,
  isSaving,
  onSelectExperienceLevel,
  onTogglePreferredLocation,
  onSelectDefaultLocation,
  onToggleHomeEquipment,
  onSave,
}: ProfileOperationalSettingsCardProps) {
  const { t } = useTranslation();

  const initialHomeEquipmentCount = Object.keys(userProfile.homeEquipment).length;
  const currentHomeEquipmentCount = Object.keys(draftHomeEquipment).length;

  const isDirty =
    draftExperienceLevel !== userProfile.experienceLevel ||
    draftDefaultLocation !== userProfile.defaultLocation ||
    currentHomeEquipmentCount !== initialHomeEquipmentCount ||
    draftPreferredLocations.length !== userProfile.preferredLocations.length ||
    draftPreferredLocations.some((location) => !userProfile.preferredLocations.includes(location)) ||
    HOME_EQUIPMENT_IDS.some(
      (equipmentId) =>
        isEquipmentSelected(draftHomeEquipment, equipmentId) !==
        isEquipmentSelected(userProfile.homeEquipment, equipmentId)
    );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{t('profile.operational.eyebrow')}</Text>
          <Text selectable style={styles.title}>
            {t('profile.operational.title')}
          </Text>
          <Text style={styles.description}>{t('profile.operational.description')}</Text>
        </View>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryPillText}>
            {t('profile.operational.summary', { count: currentHomeEquipmentCount })}
          </Text>
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{t('profile.operational.groups.experience')}</Text>
        <View style={styles.chipsContainer}>
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = draftExperienceLevel === level;
            return (
              <Pressable
                key={level}
                accessibilityRole="button"
                accessibilityLabel={t(`profile.training.experienceLevels.${level}`)}
                accessibilityState={{ selected: isSelected }}
                hitSlop={6}
                onPress={() => onSelectExperienceLevel(level)}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {t(`profile.training.experienceLevels.${level}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{t('profile.operational.groups.preferredLocations')}</Text>
        <Text style={styles.helperText}>{t('profile.operational.preferredLocationsHelper')}</Text>
        <View style={styles.chipsContainer}>
          {TRAINING_LOCATIONS.map((location) => {
            const isSelected = draftPreferredLocations.includes(location);
            return (
              <Pressable
                key={location}
                accessibilityRole="button"
                accessibilityLabel={t(`dashboard.context.locationOptions.${location}`)}
                accessibilityState={{ selected: isSelected }}
                hitSlop={6}
                onPress={() => onTogglePreferredLocation(location)}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {t(`dashboard.context.locationOptions.${location}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{t('profile.operational.groups.defaultLocation')}</Text>
        <Text style={styles.helperText}>{t('profile.operational.defaultLocationHelper')}</Text>
        <View style={styles.chipsContainer}>
          {draftPreferredLocations.map((location) => {
            const isSelected = draftDefaultLocation === location;
            return (
              <Pressable
                key={location}
                accessibilityRole="button"
                accessibilityLabel={t(`dashboard.context.locationOptions.${location}`)}
                accessibilityState={{ selected: isSelected }}
                hitSlop={6}
                onPress={() => onSelectDefaultLocation(location)}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {t(`dashboard.context.locationOptions.${location}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>{t('profile.operational.groups.homeEquipment')}</Text>
        <Text style={styles.helperText}>{t('profile.operational.homeEquipmentHelper')}</Text>
        <View style={styles.chipsContainer}>
          {HOME_EQUIPMENT_IDS.map((equipmentId) => {
            const isSelected = isEquipmentSelected(draftHomeEquipment, equipmentId);
            return (
              <Pressable
                key={equipmentId}
                accessibilityRole="button"
                accessibilityLabel={t(`profile.operational.homeEquipmentOptions.${equipmentId}`)}
                accessibilityState={{ selected: isSelected }}
                hitSlop={6}
                onPress={() => onToggleHomeEquipment(equipmentId)}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {t(`profile.operational.homeEquipmentOptions.${equipmentId}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.contextSummary}>
          {t('profile.operational.contextProfilesSummary', {
            count: Object.keys(userProfile.contextProfiles).length,
          })}
        </Text>
        <PrimaryButton
          label={t('profile.operational.save')}
          accessibilityHint={
            isDirty
              ? t('profile.operational.saveHint')
              : t('profile.operational.saveDisabledHint')
          }
          onPress={onSave}
          isLoading={isSaving}
          disabled={!isDirty}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: palette.border,
    padding: 18,
    gap: 18,
  },
  header: {
    gap: 14,
  },
  headerCopy: {
    gap: 6,
  },
  eyebrow: {
    color: palette.primaryLight,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.textPrimary,
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  description: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderCurve: 'continuous',
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  summaryPillText: {
    color: palette.textSecondary,
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
  group: {
    gap: 10,
  },
  groupTitle: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  helperText: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  chipSelected: {
    backgroundColor: palette.primaryTintSoft,
    borderColor: palette.primaryBorder,
  },
  chipText: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  chipTextSelected: {
    color: palette.primaryLight,
    fontFamily: fonts.semiBold,
  },
  footer: {
    gap: 12,
  },
  contextSummary: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
