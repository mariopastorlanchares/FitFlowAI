import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { fonts, palette } from '@shared/constants/theme';
import { PrimaryButton } from '@shared/ui/primary-button';
import { ContextCapabilityId, ContextProfile, UserProfile } from '@shared/types/user-profile';
import {
  EDITABLE_CONTEXT_PROFILE_LOCATIONS,
  EditableContextProfileLocation,
  getContextProfileTemplateDefinition,
  isContextProfileDirty,
} from '../utils/context-profile-templates';

interface ProfileContextSettingsCardProps {
  userProfile: UserProfile;
  draftContextProfiles: Record<EditableContextProfileLocation, Omit<ContextProfile, 'updatedAt'>>;
  isSaving: boolean;
  onToggleCapability: (
    location: EditableContextProfileLocation,
    capabilityId: ContextCapabilityId
  ) => void;
  onSave: () => void;
}

export function ProfileContextSettingsCard({
  userProfile,
  draftContextProfiles,
  isSaving,
  onToggleCapability,
  onSave,
}: ProfileContextSettingsCardProps) {
  const { t } = useTranslation();

  const configuredContextsCount = EDITABLE_CONTEXT_PROFILE_LOCATIONS.filter(
    (location) => userProfile.contextProfiles[location]
  ).length;
  const isDirty = EDITABLE_CONTEXT_PROFILE_LOCATIONS.some((location) =>
    isContextProfileDirty(userProfile, location, draftContextProfiles[location])
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>{t('profile.contexts.eyebrow')}</Text>
          <Text style={styles.title}>{t('profile.contexts.title')}</Text>
          <Text style={styles.description}>{t('profile.contexts.description')}</Text>
        </View>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryPillText}>
            {t('profile.contexts.summary', { count: configuredContextsCount })}
          </Text>
        </View>
      </View>

      {EDITABLE_CONTEXT_PROFILE_LOCATIONS.map((location) => {
        const draft = draftContextProfiles[location];
        const templateDefinition = getContextProfileTemplateDefinition(location);
        const isCustomized = Boolean(userProfile.contextProfiles[location]);

        return (
          <View key={location} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>
                {t(`dashboard.context.locationOptions.${location}`)}
              </Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>
                  {isCustomized
                    ? t('profile.contexts.status.saved')
                    : t('profile.contexts.status.template')}
                </Text>
              </View>
            </View>
            <Text style={styles.helperText}>
              {t(`profile.contexts.helpers.${location}`)}
            </Text>
            <View style={styles.chipsContainer}>
              {templateDefinition.capabilityIds.map((capabilityId) => {
                const isSelected = draft.enabledCapabilities.includes(capabilityId);

                return (
                  <Pressable
                    key={`${location}-${capabilityId}`}
                    accessibilityRole="button"
                    accessibilityLabel={t(`profile.contexts.capabilityOptions.${capabilityId}`)}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => onToggleCapability(location, capabilityId)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {t(`profile.contexts.capabilityOptions.${capabilityId}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}

      <View style={styles.footer}>
        <Text style={styles.futureNote}>{t('profile.contexts.futureNote')}</Text>
        <PrimaryButton
          label={t('profile.contexts.save')}
          accessibilityHint={
            isDirty ? t('profile.contexts.saveHint') : t('profile.contexts.saveDisabledHint')
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
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  groupTitle: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderCurve: 'continuous',
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  statusPillText: {
    color: palette.textSecondary,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  futureNote: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
