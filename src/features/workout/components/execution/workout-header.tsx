import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { palette, typography } from '@shared/constants/theme';

interface WorkoutHeaderProps {
  onClose: () => void;
  sessionElapsedTime: string;
  exerciseElapsedTime: string;
  restElapsedTime?: string | null;
  workoutName: string;
  currentExerciseIndex: number;
  totalExercises: number;
}

export function WorkoutHeader({
  onClose,
  sessionElapsedTime,
  exerciseElapsedTime,
  restElapsedTime,
  workoutName,
  currentExerciseIndex,
  totalExercises,
}: WorkoutHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color={palette.textPrimary} />
        </TouchableOpacity>

        <View style={styles.titleBlock}>
          <Text style={styles.workoutName} numberOfLines={1}>
            {workoutName}
          </Text>
          <Text style={styles.exerciseProgress}>
            {t('workout.header.exerciseProgress', {
              current: currentExerciseIndex + 1,
              total: totalExercises,
            })}
          </Text>
        </View>
      </View>

      <View style={styles.timersRow}>
        <View style={styles.timerBadge}>
          <Ionicons name="stopwatch-outline" size={14} color={palette.primary} />
          <View style={styles.timerCopy}>
            <Text style={styles.timerLabel}>{t('workout.header.totalTimer')}</Text>
            <Text style={styles.timerValue}>{sessionElapsedTime}</Text>
          </View>
        </View>

        <View style={styles.timerBadge}>
          <Ionicons name="barbell-outline" size={14} color={palette.primary} />
          <View style={styles.timerCopy}>
            <Text style={styles.timerLabel}>{t('workout.header.exerciseTimer')}</Text>
            <Text style={styles.timerValue}>{exerciseElapsedTime}</Text>
          </View>
        </View>

        {restElapsedTime ? (
          <View style={styles.timerBadge}>
            <Ionicons name="timer-outline" size={14} color={palette.primary} />
            <View style={styles.timerCopy}>
              <Text style={styles.timerLabel}>{t('workout.header.restTimer')}</Text>
              <Text style={styles.timerValue}>{restElapsedTime}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
  },
  workoutName: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: 1,
  },
  exerciseProgress: {
    ...typography.body,
    color: palette.textSecondary,
  },
  timersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    minHeight: 44,
  },
  timerCopy: {
    marginLeft: 7,
  },
  timerLabel: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  timerValue: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: '700',
  },
});
