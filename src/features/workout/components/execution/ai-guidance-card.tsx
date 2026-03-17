import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { effects, palette, typography } from '@shared/constants/theme';

interface AIGuidanceCardProps {
  targetWeight: number;
  targetReps: number;
  focus?: string;
  advice?: string;
}

export function AIGuidanceCard({
  targetWeight,
  targetReps,
  focus,
  advice,
}: AIGuidanceCardProps) {
  const { t } = useTranslation();
  const resolvedFocus = focus ?? t('workout.ai.defaultFocus');
  const resolvedAdvice = advice ?? t('workout.ai.defaultAdvice');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('workout.ai.title')}</Text>
      </View>
      <View style={styles.content}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: palette.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: palette.primary,
    marginBottom: 20,
    boxShadow: effects.primaryGlow,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: palette.primaryTint,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.primaryBorder,
  },
  headerTitle: {
    ...typography.h3,
    color: palette.primary,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  recommendationText: {
    ...typography.body,
    color: palette.textPrimary,
    fontSize: 15,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: palette.textPrimary,
  },
  subText: {
    ...typography.body,
    fontSize: 14,
    color: palette.textSecondary,
  },
});
