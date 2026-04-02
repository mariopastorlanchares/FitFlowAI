import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { fonts, palette } from '@shared/constants/theme';
import { useWorkoutHistorySummary } from '@features/workout/hooks/use-workout-history-summary';

export function WeeklyStreak() {
  const { t } = useTranslation();
  const { summary, isLoading } = useWorkoutHistorySummary();
  const latestSession = summary.recentSessions[0] ?? null;
  const weeklyTargetSessions = 4;
  const progressPercent = isLoading
    ? 0
    : Math.min((summary.completedSessionsThisWeek / weeklyTargetSessions) * 100, 100);
  const progressWidth: `${number}%` = `${progressPercent}%`;
  const progressValue = isLoading
    ? t('common.loading')
    : t('dashboard.weeklyStreak.progressLabel', { count: summary.completedSessionsThisWeek });
  const caption = isLoading
    ? t('dashboard.weeklyStreak.loadingCaption')
    : summary.totalCompletedSessions > 0
      ? t('dashboard.weeklyStreak.captionReady', { count: summary.totalCompletedSessions })
      : t('dashboard.weeklyStreak.emptyCaption');
  const helper = isLoading
    ? t('dashboard.weeklyStreak.loadingHelper')
    : summary.totalCompletedSessions > 0 && latestSession
      ? t('dashboard.weeklyStreak.helperReady', { name: latestSession.workoutName })
      : t('dashboard.weeklyStreak.emptyHelper');
  const activeDaysLabel = isLoading
    ? '...'
    : t('dashboard.weeklyStreak.daysLabel', { count: summary.activeDaysThisWeek });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.label}>{t('dashboard.weeklyStreak.label')}</Text>
          <Text style={styles.title}>{t('dashboard.weeklyStreak.title')}</Text>
        </View>
        <Text style={styles.progressValue}>{progressValue}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.caption}>{caption}</Text>
        <Text style={styles.days}>{activeDaysLabel}</Text>
      </View>

      <Text style={styles.helper}>{helper}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: 18,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerCopy: {
    gap: 2,
  },
  label: {
    color: palette.primaryLight,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
  progressValue: {
    color: palette.textPrimary,
    fontFamily: fonts.extraBold,
    fontSize: 22,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: palette.surfaceMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  caption: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  days: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  helper: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
