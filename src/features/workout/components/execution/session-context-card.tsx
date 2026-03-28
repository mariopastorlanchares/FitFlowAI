import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@shared/constants/theme';
import { ExerciseId } from '@shared/types/exercise-catalog';

import { WorkoutDisplayBlock, WorkoutSessionSource } from '../../types/workout';

interface SessionContextCardProps {
  source: WorkoutSessionSource;
  summary?: string;
  currentBlock?: WorkoutDisplayBlock | null;
  currentBlockIndex: number;
  totalBlocks: number;
  currentExerciseId?: ExerciseId;
}

function formatDurationMinutes(totalSeconds: number) {
  return Math.max(1, Math.round(totalSeconds / 60));
}

function buildBlockMetaLabels(
  currentBlock: WorkoutDisplayBlock,
  t: ReturnType<typeof useTranslation>['t']
) {
  const labels: string[] = [];

  if (currentBlock.rounds) {
    labels.push(t('workout.generatedSession.cadence.rounds', { count: currentBlock.rounds }));
  }

  if (currentBlock.durationSeconds) {
    labels.push(
      t('workout.generatedSession.cadence.durationMinutes', {
        minutes: formatDurationMinutes(currentBlock.durationSeconds),
      })
    );
  }

  if (currentBlock.intervalSeconds) {
    labels.push(
      t('workout.generatedSession.cadence.intervalSeconds', {
        seconds: currentBlock.intervalSeconds,
      })
    );
  }

  if (currentBlock.restSeconds) {
    labels.push(
      t('workout.generatedSession.cadence.restSeconds', {
        seconds: currentBlock.restSeconds,
      })
    );
  }

  return labels;
}

export function SessionContextCard({
  source,
  summary,
  currentBlock,
  currentBlockIndex,
  totalBlocks,
  currentExerciseId,
}: SessionContextCardProps) {
  const { t } = useTranslation();

  if (!summary && !currentBlock) {
    return null;
  }

  const blockTypeLabel = currentBlock
    ? t(`workout.generatedSession.blockTypes.${currentBlock.blockType}` as any)
    : null;
  const blockMetaLabels = currentBlock ? buildBlockMetaLabels(currentBlock, t) : [];

  return (
    <View style={styles.container}>
      <View style={styles.badgesRow}>
        <View
          style={[
            styles.badge,
            source === 'live_generated' ? styles.liveBadge : styles.fallbackBadge,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              source === 'live_generated' ? styles.liveBadgeText : styles.fallbackBadgeText,
            ]}
          >
            {t(`workout.generatedSession.sources.${source}` as any)}
          </Text>
        </View>

        {currentBlock ? (
          <>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {t('workout.generatedSession.blockProgress', {
                  current: currentBlockIndex + 1,
                  total: totalBlocks,
                })}
              </Text>
            </View>
            <View style={[styles.badge, styles.primaryBadge]}>
              <Text style={[styles.badgeText, styles.primaryBadgeText]}>{blockTypeLabel}</Text>
            </View>
          </>
        ) : null}
      </View>

      {currentBlock ? (
        <>
          <Text style={styles.eyebrow}>{t('workout.generatedSession.currentBlock')}</Text>
          <Text style={styles.blockTitle}>{currentBlock.title ?? blockTypeLabel}</Text>
        </>
      ) : null}

      {summary ? <Text style={styles.summary}>{summary}</Text> : null}

      {blockMetaLabels.length > 0 ? (
        <View style={styles.metaRow}>
          {blockMetaLabels.map((label) => (
            <View key={label} style={styles.metaPill}>
              <Text style={styles.metaText}>{label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {currentBlock && currentBlock.exercises.length > 1 ? (
        <>
          <Text style={styles.sectionLabel}>{t('workout.generatedSession.exerciseFlow')}</Text>
          <View style={styles.exerciseFlow}>
            {currentBlock.exercises.map((exercise) => {
              const isActive = exercise.exerciseId === currentExerciseId;

              return (
                <View
                  key={exercise.entryId}
                  style={[styles.exerciseChip, isActive && styles.exerciseChipActive]}
                >
                  <Text
                    style={[styles.exerciseChipText, isActive && styles.exerciseChipTextActive]}
                  >
                    {exercise.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      ) : null}
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
    gap: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  liveBadge: {
    backgroundColor: palette.successTint,
    borderColor: palette.successBorder,
  },
  fallbackBadge: {
    backgroundColor: palette.primaryTintFaint,
    borderColor: palette.primaryBorder,
  },
  primaryBadge: {
    backgroundColor: palette.primaryTint,
    borderColor: palette.primaryBorder,
  },
  badgeText: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  liveBadgeText: {
    color: palette.success,
    fontFamily: typography.title.fontFamily,
  },
  fallbackBadgeText: {
    color: palette.primaryLight,
    fontFamily: typography.title.fontFamily,
  },
  primaryBadgeText: {
    color: palette.primaryLight,
    fontFamily: typography.title.fontFamily,
  },
  eyebrow: {
    ...typography.caption,
    color: palette.primary,
    letterSpacing: 0.8,
  },
  blockTitle: {
    ...typography.h3,
    color: palette.textPrimary,
  },
  summary: {
    ...typography.body,
    color: palette.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaPill: {
    backgroundColor: palette.surfaceInset,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  sectionLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  exerciseFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseChip: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  exerciseChipActive: {
    backgroundColor: palette.primaryTint,
    borderColor: palette.primaryBorder,
  },
  exerciseChipText: {
    ...typography.body,
    color: palette.textPrimary,
  },
  exerciseChipTextActive: {
    fontFamily: typography.title.fontFamily,
  },
});
