import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { palette } from '@shared/constants/theme';
import { useWorkoutHistorySummary } from '@features/workout/hooks/use-workout-history-summary';

function formatDateLabel(date: Date) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

export function StatsScreen() {
  const { t } = useTranslation();
  const { summary, isLoading } = useWorkoutHistorySummary();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('analytics.loadingTitle')}</Text>
          <Text style={styles.text}>{t('analytics.loadingBody')}</Text>
        </View>
      </View>
    );
  }

  if (summary.totalCompletedSessions === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('analytics.placeholderTitle')}</Text>
          <Text style={styles.text}>{t('analytics.placeholderBody')}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('analytics.metrics.totalSessions')}</Text>
          <Text style={styles.metricValue}>{summary.totalCompletedSessions}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('analytics.metrics.thisWeek')}</Text>
          <Text style={styles.metricValue}>{summary.completedSessionsThisWeek}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t('analytics.metrics.activeDays')}</Text>
          <Text style={styles.metricValue}>{summary.activeDaysThisWeek}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t('analytics.recentTitle')}</Text>
        {summary.recentSessions.map((session) => (
          <View key={session.id} style={styles.sessionRow}>
            <View style={styles.sessionCopy}>
              <Text style={styles.sessionName}>{session.workoutName}</Text>
              <Text style={styles.sessionMeta}>
                {t('analytics.recentMeta', {
                  location: t(`dashboard.context.locationOptions.${session.location}`),
                  date: formatDateLabel(session.completedAt),
                })}
              </Text>
            </View>
            <Text style={styles.sessionSets}>
              {t('analytics.recentSets', {
                completed: session.completedSets,
                total: session.totalSets,
              })}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  metricsGrid: {
    gap: 12,
  },
  metricCard: {
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    padding: 18,
    gap: 6,
  },
  metricLabel: {
    color: palette.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  metricValue: {
    color: palette.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
  },
  card: {
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    padding: 24,
    gap: 12,
  },
  title: {
    color: palette.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  text: {
    color: palette.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: palette.borderSubtle,
  },
  sessionCopy: {
    flex: 1,
    gap: 4,
  },
  sessionName: {
    color: palette.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  sessionMeta: {
    color: palette.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  sessionSets: {
    color: palette.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    alignSelf: 'center',
  },
});
