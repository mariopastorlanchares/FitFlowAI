import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { palette, typography } from '@shared/constants/theme';
import { ExerciseSet } from '../../types/workout';

interface SetProgressStripProps {
  sets: ExerciseSet[];
  selectedSetIndex: number;
  nextPendingSetIndex: number;
  isEditingSet: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onSelectSet: (setIndex: number) => void;
  onAddSet: () => void;
  onRemoveLastSet: () => void;
}

export function SetProgressStrip({
  sets,
  selectedSetIndex,
  nextPendingSetIndex,
  isEditingSet,
  expanded,
  onToggleExpanded,
  onSelectSet,
  onAddSet,
  onRemoveLastSet,
}: SetProgressStripProps) {
  const { t } = useTranslation();
  const completedCount = sets.filter((set) => set.completed).length;
  const selectedSet = sets[selectedSetIndex];
  const flowSetNumber = nextPendingSetIndex !== -1 ? nextPendingSetIndex + 1 : sets.length;

  const getChipStyle = (set: ExerciseSet, index: number) => {
    const isSelected = index === selectedSetIndex;
    const isCurrent = index === nextPendingSetIndex;

    if (isSelected && isEditingSet) {
      return {
        backgroundColor: palette.primaryTint,
        borderColor: palette.primaryBorder,
        textColor: palette.primary,
      };
    }

    if (isCurrent) {
      return {
        backgroundColor: palette.primaryTintSoft,
        borderColor: palette.primaryBorder,
        textColor: palette.textPrimary,
      };
    }

    if (set.completed) {
      return {
        backgroundColor: palette.successTint,
        borderColor: palette.successBorder,
        textColor: palette.textPrimary,
      };
    }

    return {
      backgroundColor: palette.surfaceMuted,
      borderColor: palette.border,
      textColor: palette.textSecondary,
    };
  };

  const selectedSetStyle = selectedSet
    ? getChipStyle(selectedSet, selectedSetIndex)
    : {
        backgroundColor: palette.surfaceMuted,
        borderColor: palette.border,
        textColor: palette.textSecondary,
      };

  return (
    <View style={styles.container}>
      {!expanded ? (
        <View style={styles.collapsedRow}>
          <View style={[styles.infoColumn, styles.infoColumnDivider]}>
            <Text style={styles.infoLabel}>{t('workout.setStrip.title')}</Text>
            <Text style={styles.infoValue}>
              {flowSetNumber}/{sets.length}
            </Text>
          </View>

          <View style={[styles.infoColumn, styles.infoColumnDivider]}>
            <Text style={styles.infoLabel}>
              {isEditingSet ? t('workout.setStrip.editing') : t('workout.setStrip.currentSetLabel')}
            </Text>
            <Text style={[styles.infoValue, { color: selectedSetStyle.textColor }]}>
              {selectedSetIndex + 1}
            </Text>
          </View>

          <TouchableOpacity style={styles.reviewAction} onPress={onToggleExpanded}>
            <Text style={styles.reviewActionText}>{t('workout.setStrip.expand')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={[styles.headerRow, styles.headerRowExpanded]}>
            <View>
              <Text style={styles.title}>{t('workout.setStrip.title')}</Text>
              <Text style={styles.summary}>
                {t('workout.setStrip.summary', { completed: completedCount, total: sets.length })}
              </Text>
            </View>

            <TouchableOpacity style={styles.toggleButton} onPress={onToggleExpanded}>
              <Text style={styles.toggleButtonText}>{t('workout.setStrip.collapse')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chipsRow}>
            {sets.map((set, index) => {
              const chipStyle = getChipStyle(set, index);
              const isFuturePending =
                nextPendingSetIndex !== -1 && index > nextPendingSetIndex && !set.completed;

              return (
                <Pressable
                  key={set.id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: chipStyle.backgroundColor,
                      borderColor: chipStyle.borderColor,
                    },
                    index === selectedSetIndex && styles.selectedChip,
                    isFuturePending && styles.disabledChip,
                  ]}
                  onPress={() => onSelectSet(index)}
                  disabled={isFuturePending}
                >
                  <Text style={[styles.chipText, { color: chipStyle.textColor }]}>
                    {index + 1}
                  </Text>
                  <Text style={[styles.chipStatus, { color: chipStyle.textColor }]}>
                    {index === selectedSetIndex && isEditingSet
                      ? t('workout.setStrip.editing')
                      : index === nextPendingSetIndex
                        ? t('workout.setStrip.current')
                        : set.completed
                          ? t('workout.setStrip.completed')
                          : t('workout.setStrip.pending')}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.secondaryAction} onPress={onAddSet}>
              <Text style={styles.secondaryActionText}>{t('workout.setStrip.add')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryAction, sets.length <= 1 && styles.secondaryActionDisabled]}
              onPress={onRemoveLastSet}
              disabled={sets.length <= 1}
            >
              <Text style={styles.secondaryActionText}>{t('workout.setStrip.removeLast')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 14,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSubtle,
  },
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: palette.surfaceInset,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    borderRadius: 14,
    overflow: 'hidden',
  },
  infoColumn: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  infoColumnDivider: {
    borderRightWidth: 1,
    borderRightColor: palette.borderSubtle,
  },
  infoLabel: {
    ...typography.caption,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    ...typography.title,
    color: palette.textPrimary,
  },
  reviewAction: {
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reviewActionText: {
    ...typography.body,
    color: palette.primary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRowExpanded: {
    marginBottom: 12,
  },
  title: {
    ...typography.title,
    color: palette.textPrimary,
  },
  summary: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: 2,
  },
  toggleButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  toggleButtonText: {
    ...typography.body,
    color: palette.primary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedChip: {
    transform: [{ translateY: -1 }],
  },
  disabledChip: {
    opacity: 0.5,
  },
  chipText: {
    ...typography.title,
  },
  chipStatus: {
    ...typography.caption,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: palette.surfaceInset,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryActionDisabled: {
    opacity: 0.45,
  },
  secondaryActionText: {
    ...typography.body,
    color: palette.textPrimary,
  },
});
