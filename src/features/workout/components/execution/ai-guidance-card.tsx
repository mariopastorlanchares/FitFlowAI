import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { palette, typography } from '@shared/constants/theme';

interface AIGuidanceCardProps {
  targetWeight: number;
  targetReps: number;
  focus?: string;
  advice?: string;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onSubmitFeedback: () => void;
}

export function AIGuidanceCard({
  targetWeight,
  targetReps,
  focus,
  advice,
  feedback,
  onFeedbackChange,
  onSubmitFeedback,
}: AIGuidanceCardProps) {
  const { t } = useTranslation();
  const resolvedFocus = focus ?? t('workout.ai.defaultFocus');
  const resolvedAdvice = advice ?? t('workout.ai.defaultAdvice');
  const isSubmitDisabled = !feedback.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{t('workout.ai.title')}</Text>
      <Text style={styles.recommendationText}>
        <Text style={styles.boldText}>{t('workout.ai.recommendationLabel')}</Text>{' '}
        {t('workout.ai.recommendation', { weight: targetWeight, reps: targetReps })}
      </Text>
      <Text style={styles.subText}>
        {t('workout.ai.focusAdvice', {
          focus: resolvedFocus,
          advice: resolvedAdvice,
        })}
      </Text>

      <Text style={styles.feedbackLabel}>{t('workout.ai.feedbackLabel')}</Text>
      <TextInput
        style={styles.feedbackInput}
        placeholder={t('workout.ai.feedbackPlaceholder')}
        placeholderTextColor={palette.textSecondary}
        value={feedback}
        onChangeText={onFeedbackChange}
        multiline
      />

      <TouchableOpacity
        style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
        onPress={onSubmitFeedback}
        disabled={isSubmitDisabled}
      >
        <Text style={styles.submitButtonText}>{t('workout.ai.feedbackSubmit')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: palette.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    marginBottom: 16,
  },
  headerTitle: {
    ...typography.title,
    color: palette.textPrimary,
    marginBottom: 10,
  },
  recommendationText: {
    ...typography.body,
    color: palette.textPrimary,
    fontSize: 15,
    marginBottom: 6,
  },
  boldText: {
    fontFamily: typography.title.fontFamily,
    color: palette.textPrimary,
  },
  subText: {
    ...typography.body,
    fontSize: 14,
    color: palette.textSecondary,
    marginBottom: 16,
  },
  feedbackLabel: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: 8,
  },
  feedbackInput: {
    minHeight: 88,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.textPrimary,
    ...typography.body,
    textAlignVertical: 'top',
  },
  submitButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.primaryBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  submitButtonDisabled: {
    opacity: 0.45,
    borderColor: palette.border,
  },
  submitButtonText: {
    ...typography.body,
    color: palette.textPrimary,
    fontFamily: typography.title.fontFamily,
  },
});
