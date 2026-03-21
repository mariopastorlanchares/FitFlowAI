import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { palette, typography } from '@shared/constants/theme';

interface ExerciseMediaProps {
  name: string;
  description?: string;
  imageUrl?: string;
  onRequestAlternative: () => void;
}

export function ExerciseMedia({
  name,
  description,
  onRequestAlternative,
}: ExerciseMediaProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{t('workout.exercise.currentLabel')}</Text>
      <Text style={styles.exerciseName}>{name}</Text>
      {description ? <Text style={styles.exerciseDescription}>{description}</Text> : null}

      <View style={styles.mediaFrame}>
        <Image
          source={require('@/assets/images/squats_placeholder.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity style={styles.alternativeButton} onPress={onRequestAlternative}>
        <Ionicons name="swap-horizontal" size={18} color={palette.textPrimary} />
        <Text style={styles.alternativeText}>{t('workout.exercise.alternativeAction')}</Text>
      </TouchableOpacity>
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
  eyebrow: {
    ...typography.caption,
    color: palette.primary,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  exerciseName: {
    ...typography.h2,
    color: palette.textPrimary,
    marginBottom: 8,
  },
  exerciseDescription: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: 16,
  },
  mediaFrame: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceInset,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    paddingVertical: 12,
    marginBottom: 16,
  },
  image: {
    width: 180,
    height: 180,
  },
  alternativeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  alternativeText: {
    ...typography.body,
    color: palette.textPrimary,
    marginLeft: 8,
  },
});
