import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { effects, palette, typography } from '@shared/constants/theme';

interface ExecutionControlsProps {
  isExerciseFinished: boolean;
  isLastExercise: boolean;
  isEditingSet: boolean;
  restActive: boolean;
  onNextAction: () => void;
}

export function ExecutionControls({
  isExerciseFinished,
  isLastExercise,
  isEditingSet,
  restActive,
  onNextAction,
}: ExecutionControlsProps) {
  const { t } = useTranslation();
  const primaryActionText = isEditingSet
    ? t('workout.controls.saveChanges')
    : isExerciseFinished && isLastExercise
      ? t('workout.controls.finish')
      : isExerciseFinished
        ? t('workout.controls.nextExercise')
        : t('workout.controls.logSet');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.primaryButton} onPress={onNextAction}>
        <Text style={styles.primaryButtonText}>{primaryActionText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: palette.surfaceInset,
    borderTopWidth: 1,
    borderTopColor: palette.borderSubtle,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: palette.primary,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: effects.primaryButton,
  },
  primaryButtonText: {
    ...typography.button,
    color: palette.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
