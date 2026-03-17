import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { effects, palette, typography } from '@shared/constants/theme';

interface ExecutionControlsProps {
  isExerciseFinished: boolean;
  isLastExercise: boolean;
  onRequestAlternative: () => void;
  onNextAction: () => void;
}

export function ExecutionControls({
  isExerciseFinished,
  isLastExercise,
  onRequestAlternative,
  onNextAction,
}: ExecutionControlsProps) {
  const { t } = useTranslation();
  const primaryActionText =
    isExerciseFinished && isLastExercise
      ? t('workout.controls.finish')
      : t('workout.controls.nextSet');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.secondaryButton} onPress={onRequestAlternative}>
        <Text style={styles.secondaryButtonText}>{t('workout.controls.alternative')}</Text>
      </TouchableOpacity>

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
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: palette.surfaceInset,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: palette.surfaceMuted,
  },
  secondaryButtonText: {
    ...typography.button,
    color: palette.textPrimary,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: palette.primary,
    paddingVertical: 16,
    alignItems: 'center',
    boxShadow: effects.primaryButton,
  },
  primaryButtonText: {
    ...typography.button,
    color: palette.textOnPrimary,
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
});
