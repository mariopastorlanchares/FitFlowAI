import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, palette } from '@shared/constants/theme';
import { useWorkoutIntent } from '@features/workout/store/use-workout-intent';

const LOCATION_KEYS = ['gym', 'home', 'street', 'park'] as const;
const DURATION_KEYS = ['short', 'medium', 'long', 'extended'] as const;
const ENERGY_KEYS = ['low', 'medium', 'high'] as const;

export function WorkoutContextSelector() {
  const { t } = useTranslation();
  const {
    location: selectedLocation,
    duration: selectedDuration,
    energy: selectedEnergy,
    setLocation: setSelectedLocation,
    setDuration: setSelectedDuration,
    setEnergy: setSelectedEnergy,
  } = useWorkoutIntent();

  const [isExpanded, setIsExpanded] = useState(false);

  const renderChips = <T extends string>(
    title: string,
    options: readonly T[],
    selectedValue: T,
    onSelect: (value: T) => void,
    translationKey: string
  ) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chipsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityLabel={t(`${translationKey}.${option}`)}
              accessibilityState={{ selected: isSelected }}
              hitSlop={6}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(option)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {t(`${translationKey}.${option}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('dashboard.sessionSetup.title')}
        accessibilityHint={
          isExpanded
            ? t('dashboard.sessionSetup.collapseHint')
            : t('dashboard.sessionSetup.expandHint')
        }
        accessibilityState={{ expanded: isExpanded }}
        hitSlop={6}
        style={styles.header}
        onPress={() => setIsExpanded((current) => !current)}
      >
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{t('dashboard.sessionSetup.title')}</Text>
          <View style={styles.summaryChips}>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryChipText}>
                {t(`dashboard.context.locationOptions.${selectedLocation}`)}
              </Text>
            </View>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryChipText}>
                {t(`dashboard.context.durationOptions.${selectedDuration}`)}
              </Text>
            </View>
            <View style={styles.summaryChip}>
              <Text style={styles.summaryChipText}>
                {t(`dashboard.context.energyOptions.${selectedEnergy}`)}
              </Text>
            </View>
          </View>
        </View>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={palette.textSecondary}
        />
      </Pressable>

      {isExpanded ? (
        <View style={styles.expandedContent}>
          {renderChips(
            t('dashboard.context.locationLabel'),
            LOCATION_KEYS,
            selectedLocation,
            setSelectedLocation,
            'dashboard.context.locationOptions'
          )}

          {renderChips(
            t('dashboard.context.durationLabel'),
            DURATION_KEYS,
            selectedDuration,
            setSelectedDuration,
            'dashboard.context.durationOptions'
          )}

          {renderChips(
            t('dashboard.context.energyLabel'),
            ENERGY_KEYS,
            selectedEnergy,
            setSelectedEnergy,
            'dashboard.context.energyOptions'
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: palette.borderSoft,
    overflow: 'hidden',
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
  summaryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  summaryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderCurve: 'continuous',
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.borderSoft,
  },
  summaryChipText: {
    color: palette.textSecondary,
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: palette.borderSoft,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    gap: 16,
  },
  group: {
    gap: 10,
  },
  groupTitle: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 14,
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
});
