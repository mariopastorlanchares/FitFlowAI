import { Feather } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import { palette, typography } from '@shared/constants/theme';

interface ActiveSetLoggerProps {
  currentSetNumber: number;
  targetReps: number;
  targetWeight?: number;
  reps: string;
  weight: string;
  isEditing?: boolean;
  isLocked?: boolean;
  children?: React.ReactNode;
  onRepsChange: (reps: string) => void;
  onWeightChange: (weight: string) => void;
}

export function ActiveSetLogger({
  currentSetNumber,
  targetReps,
  targetWeight,
  reps,
  weight,
  isEditing = false,
  isLocked = false,
  children,
  onRepsChange,
  onWeightChange,
}: ActiveSetLoggerProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isCompact = width <= 380;

  const handleDecrementWeight = () => {
    if (isLocked) {
      return;
    }

    const value = parseFloat(weight) || 0;
    onWeightChange(Math.max(0, value - 2.5).toString());
  };

  const handleIncrementWeight = () => {
    if (isLocked) {
      return;
    }

    const value = parseFloat(weight) || 0;
    onWeightChange((value + 2.5).toString());
  };

  const handleDecrementReps = () => {
    if (isLocked) {
      return;
    }

    const value = parseInt(reps, 10) || 0;
    onRepsChange(Math.max(0, value - 1).toString());
  };

  const handleIncrementReps = () => {
    if (isLocked) {
      return;
    }

    const value = parseInt(reps, 10) || 0;
    onRepsChange((value + 1).toString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>
            {isEditing
              ? t('workout.activeSet.editTitle', { current: currentSetNumber })
              : t('workout.activeSet.title')}
          </Text>
          <Text style={styles.helperText}>
            {isEditing
              ? t('workout.activeSet.editingHelper')
              : isLocked
              ? t('workout.activeSet.lockedHelper')
              : t('workout.activeSet.readyHelper')}
          </Text>
        </View>
      </View>

      {children ? <View style={styles.setStripSlot}>{children}</View> : null}

      <View style={styles.targetRow}>
        <Text style={styles.targetLabel}>{t('workout.activeSet.targetLabel')}</Text>
        <Text style={styles.targetValue}>
          {targetWeight ?? 0} kg x {targetReps} {t('workout.activeSet.repsUnit')}
        </Text>
      </View>

      <View style={styles.inputsRow}>
        <View style={styles.metricCard}>
          <Text style={[styles.metricLabel, isCompact && styles.metricLabelCompact]}>
            {t('workout.activeSet.weightLabel')}
          </Text>
          <View style={[styles.inputBox, isCompact && styles.inputBoxCompact]}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                isCompact && styles.actionBtnCompact,
                isLocked && styles.actionBtnDisabled,
              ]}
              onPress={handleDecrementWeight}
              disabled={isLocked}
            >
              <Feather
                name="minus"
                size={isCompact ? 18 : 22}
                color={palette.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.textInputWrapper}>
              <TextInput
                style={[styles.textInput, isCompact && styles.textInputCompact]}
                keyboardType="numeric"
                value={weight}
                onChangeText={onWeightChange}
                selectTextOnFocus
                maxLength={5}
                editable={!isLocked}
              />
              {!isCompact ? <Text style={styles.unitText}>kg</Text> : null}
            </View>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                isCompact && styles.actionBtnCompact,
                isLocked && styles.actionBtnDisabled,
              ]}
              onPress={handleIncrementWeight}
              disabled={isLocked}
            >
              <Feather
                name="plus"
                size={isCompact ? 18 : 22}
                color={palette.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricLabel, isCompact && styles.metricLabelCompact]}>
            {t('workout.activeSet.repsLabel')}
          </Text>
          <View style={[styles.inputBox, isCompact && styles.inputBoxCompact]}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                isCompact && styles.actionBtnCompact,
                isLocked && styles.actionBtnDisabled,
              ]}
              onPress={handleDecrementReps}
              disabled={isLocked}
            >
              <Feather
                name="minus"
                size={isCompact ? 18 : 22}
                color={palette.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.textInputWrapper}>
              <TextInput
                style={[styles.textInput, isCompact && styles.textInputCompact]}
                keyboardType="numeric"
                value={reps}
                onChangeText={onRepsChange}
                selectTextOnFocus
                maxLength={4}
                editable={!isLocked}
              />
              {!isCompact ? (
                <Text style={styles.unitText}>{t('workout.activeSet.repsUnit')}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                isCompact && styles.actionBtnCompact,
                isLocked && styles.actionBtnDisabled,
              ]}
              onPress={handleIncrementReps}
              disabled={isLocked}
            >
              <Feather
                name="plus"
                size={isCompact ? 18 : 22}
                color={palette.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: 4,
  },
  helperText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  setStripSlot: {
    marginBottom: 16,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surfaceMuted,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  targetLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  targetValue: {
    ...typography.body,
    color: palette.textPrimary,
    fontFamily: typography.title.fontFamily,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
  },
  metricLabel: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: 8,
  },
  metricLabelCompact: {
    fontSize: 13,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputBoxCompact: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surfaceInset,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnCompact: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  actionBtnDisabled: {
    opacity: 0.45,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textInput: {
    ...typography.h2,
    color: palette.textPrimary,
    fontSize: 26,
    textAlign: 'center',
    minWidth: 0,
    flexShrink: 1,
    padding: 0,
  },
  textInputCompact: {
    fontSize: 22,
  },
  unitText: {
    ...typography.body,
    color: palette.textSecondary,
    fontSize: 16,
    marginLeft: 2,
    marginTop: 6,
  },
});
