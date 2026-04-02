import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { effects, palette, typography } from '@shared/constants/theme';

interface WorkoutCompletionModalProps {
  visible: boolean;
  completedSets: number;
  totalSets: number;
  totalExercises: number;
  onContinue: () => void;
}

export function WorkoutCompletionModal({
  visible,
  completedSets,
  totalSets,
  totalExercises,
  onContinue,
}: WorkoutCompletionModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onContinue}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {Platform.OS !== 'web' ? (
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.backdrop }]} />
        )}

        <Pressable style={StyleSheet.absoluteFill} onPress={onContinue} />

        <View
          accessibilityRole="alert"
          accessibilityViewIsModal
          accessibilityLabel={t('workout.finish.successTitle')}
          style={styles.card}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('workout.finish.successBadge')}</Text>
          </View>

          <Text style={styles.title}>{t('workout.finish.successTitle')}</Text>
          <Text style={styles.body}>{t('workout.finish.successBody')}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>
                {t('workout.finish.successStatsSets', {
                  completed: completedSets,
                  total: totalSets,
                })}
              </Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statValue}>
                {t('workout.finish.successStatsExercises', { count: totalExercises })}
              </Text>
            </View>
          </View>

          <Text style={styles.motivation}>{t('workout.finish.successMotivation')}</Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('workout.finish.successContinue')}
            onPress={onContinue}
            activeOpacity={0.85}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{t('workout.finish.successContinue')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: palette.successBorder,
    backgroundColor: palette.surface,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    boxShadow: effects.modal,
    gap: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.successBorder,
    backgroundColor: palette.successTint,
  },
  badgeText: {
    ...typography.caption,
    color: palette.success,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...typography.h2,
    color: palette.textPrimary,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  statPill: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    backgroundColor: palette.surfaceInset,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  statValue: {
    ...typography.title,
    color: palette.textPrimary,
    textAlign: 'center',
  },
  motivation: {
    ...typography.body,
    color: palette.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: palette.primary,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    boxShadow: effects.primaryButton,
  },
  primaryButtonText: {
    ...typography.button,
    color: palette.textOnPrimary,
  },
});
