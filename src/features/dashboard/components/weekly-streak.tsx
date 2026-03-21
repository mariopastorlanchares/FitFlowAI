import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { fonts, palette } from '@shared/constants/theme';

const COMPLETED_SESSIONS = 3;
const GOAL_SESSIONS = 4;
const ACTIVE_DAYS = 6;

export function WeeklyStreak() {
  const { t } = useTranslation();
  const progressWidth = `${(COMPLETED_SESSIONS / GOAL_SESSIONS) * 100}%` as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.label}>{t('dashboard.weeklyStreak.label')}</Text>
          <Text style={styles.title}>{t('dashboard.weeklyStreak.title')}</Text>
        </View>
        <Text style={styles.progressValue}>
          {t('dashboard.weeklyStreak.progress', {
            completed: COMPLETED_SESSIONS,
            goal: GOAL_SESSIONS,
          })}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.caption}>{t('dashboard.weeklyStreak.caption')}</Text>
        <Text style={styles.days}>
          {t('dashboard.weeklyStreak.daysLabel', { days: ACTIVE_DAYS })}
        </Text>
      </View>

      <Text style={styles.helper}>{t('dashboard.weeklyStreak.helper')}</Text>
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
