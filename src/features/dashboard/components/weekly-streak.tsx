import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@shared/constants/theme';

export function WeeklyStreak() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.label}>{t('dashboard.weeklyStreak.label')} </Text>
        <Text style={styles.value}>
          {t('dashboard.weeklyStreak.progress', { completed: 3, goal: 4 })}{' '}
        </Text>
        <Text style={styles.caption}>{t('dashboard.weeklyStreak.caption')}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${palette.primary}40`,
    alignSelf: 'center',
    marginTop: 24,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  label: {
    color: palette.textPrimary,
  },
  value: {
    color: palette.primary,
  },
  caption: {
    color: palette.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
});
