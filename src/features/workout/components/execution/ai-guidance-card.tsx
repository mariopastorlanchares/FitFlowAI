import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
  const isSubmitDisabled = !feedback.trim();
  const hasPersonalizedGuidance = Boolean(focus || advice);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{t('workout.ai.title')}</Text>
      <Text style={styles.recommendationText}>
        <Text style={styles.boldText}>{t('workout.ai.recommendationLabel')}</Text>{' '}
        {t('workout.ai.recommendation', { weight: targetWeight, reps: targetReps })}
      </Text>
      <Text style={styles.subText}>
        {hasPersonalizedGuidance
          ? t('workout.ai.focusAdvice', {
              focus,
              advice,
            })
          : t('workout.ai.pendingBody')}
      </Text>

      <Text style={styles.feedbackLabel}>{t('workout.ai.feedbackLabel')}</Text>
      <TextInput
        style={styles.feedbackInput}
        accessibilityLabel={t('workout.ai.feedbackLabel')}
        accessibilityHint={t('workout.ai.feedbackPlaceholder')}
        placeholder={t('workout.ai.feedbackPlaceholder')}
        placeholderTextColor={palette.textSecondary}
        value={feedback}
        onChangeText={onFeedbackChange}
        multiline
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('workout.ai.feedbackSubmit')}
        accessibilityHint={t('workout.ai.pendingFeedbackBody')}
        accessibilityState={{ disabled: isSubmitDisabled }}
        onPress={onSubmitFeedback}
        disabled={isSubmitDisabled}
        style={({ pressed }) => [
          styles.submitButton,
          isSubmitDisabled && styles.submitButtonDisabled,
          pressed && !isSubmitDisabled ? styles.submitButtonPressed : null,
        ]}
      >
        <Text style={styles.submitButtonText}>{t('workout.ai.feedbackSubmit')}</Text>
      </Pressable>
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
    marginBottom: 8,
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
  submitButtonPressed: {
    opacity: 0.82,
  },
  submitButtonText: {
    ...typography.body,
    color: palette.textPrimary,
    fontFamily: typography.title.fontFamily,
  },
});
