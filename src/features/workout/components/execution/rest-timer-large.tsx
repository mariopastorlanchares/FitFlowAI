import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { effects, palette, typography } from '@shared/constants/theme';

interface RestTimerLargeProps {
  timeLeft: number;
  totalTime: number;
  onSkip: () => void;
}

export function RestTimerLarge({ timeLeft, totalTime, onSkip }: RestTimerLargeProps) {
  const { t } = useTranslation();
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const totalMinutes = Math.floor(totalTime / 60);
  const totalSeconds = totalTime % 60;
  const formattedTotal = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <Text style={styles.timeText}>{formattedTime}</Text>
          <Text style={styles.goalText}>{t('workout.rest.goal', { time: formattedTotal })}</Text>
        </View>

        <View
          style={[
            styles.progressArc,
            {
              borderTopColor: palette.primary,
              borderRightColor: progress > 0.25 ? palette.primary : 'transparent',
              borderBottomColor: progress > 0.5 ? palette.primary : 'transparent',
              borderLeftColor: progress > 0.75 ? palette.primary : 'transparent',
              transform: [{ rotate: '45deg' }],
            },
          ]}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('workout.rest.skip')}
        onPress={onSkip}
        style={({ pressed }) => [styles.skipButton, pressed ? styles.skipButtonPressed : null]}
      >
        <Text style={styles.skipButtonText}>{t('workout.rest.skip')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: palette.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: effects.primaryButton,
  },
  innerCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: palette.surfaceInset,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timeText: {
    ...typography.h1,
    color: palette.textPrimary,
    fontSize: 32,
  },
  goalText: {
    ...typography.body,
    color: palette.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  progressArc: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: 'transparent',
    zIndex: 1,
  },
  skipButton: {
    marginTop: 16,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  skipButtonPressed: {
    opacity: 0.82,
  },
  skipButtonText: {
    ...typography.body,
    color: palette.textPrimary,
  },
});
