import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { effects, palette, typography } from '@shared/constants/theme';

interface ExecutionControlsProps {
  isExerciseFinished: boolean;
  isLastExercise: boolean;
  isEditingSet: boolean;
  isBusy?: boolean;
  restActive: boolean;
  onNextAction: () => void;
}

export function ExecutionControls({
  isExerciseFinished,
  isLastExercise,
  isEditingSet,
  isBusy = false,
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
  const helperText = isEditingSet
    ? t('workout.controls.helperEditing')
    : isExerciseFinished
      ? t('workout.controls.helperFinished')
      : restActive
        ? t('workout.controls.helperRest')
        : t('workout.controls.helperReady');

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={primaryActionText}
        accessibilityHint={helperText}
        accessibilityState={{ disabled: isBusy }}
        onPress={onNextAction}
        disabled={isBusy}
        style={({ pressed }) => [
          styles.primaryButton,
          isBusy ? styles.primaryButtonDisabled : null,
          pressed ? styles.primaryButtonPressed : null,
        ]}
      >
        <Text style={styles.primaryButtonText}>{primaryActionText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 6,
    backgroundColor: palette.surfaceInset,
    borderTopWidth: 1,
    borderTopColor: palette.borderSubtle,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: palette.primary,
    paddingVertical: 15,
    alignItems: 'center',
    boxShadow: effects.primaryButton,
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    ...typography.button,
    color: palette.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
