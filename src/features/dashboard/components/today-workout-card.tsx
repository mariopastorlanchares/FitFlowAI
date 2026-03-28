import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, palette } from '@shared/constants/theme';
import { PrimaryButton } from '@shared/ui/primary-button';
import { useWorkoutIntent } from '@features/workout/store/use-workout-intent';

export function TodayWorkoutCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { location, duration, energy } = useWorkoutIntent();

  return (
    <View style={styles.card}>
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>{t('dashboard.today_workout')}</Text>
        <Text style={styles.title}>
          {t('dashboard.card.title', { 
            location: t(`dashboard.context.locationOptions.${location}`) 
          })}
        </Text>
        <Text style={styles.description}>{t('dashboard.card.description')}</Text>
      </View>

      <Text style={styles.summary}>{t('dashboard.card.summary')}</Text>

      <View style={styles.metaGrid}>
        <View style={styles.metaCard}>
          <Feather name="clock" size={16} color={palette.primaryLight} />
          <Text style={styles.metaLabel}>{t('dashboard.time')}</Text>
          <Text style={styles.metaValue}>
            {t(`dashboard.context.durationOptions.${duration}`)}
          </Text>
        </View>
        <View style={styles.metaCard}>
          <Feather name="target" size={16} color={palette.primaryLight} />
          <Text style={styles.metaLabel}>{t('dashboard.focus')}</Text>
          <Text style={styles.metaValue}>
            {t(`dashboard.context.energyOptions.${energy}`)}
          </Text>
        </View>
      </View>

      <PrimaryButton
        label={t('dashboard.start_workout')}
        onPress={() => router.push('/workout')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: palette.surface,
    borderRadius: 28,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: palette.borderSoft,
    padding: 22,
    gap: 18,
  },
  titleBlock: {
    gap: 6,
  },
  kicker: {
    color: palette.primaryLight,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.7,
  },
  title: {
    color: palette.textPrimary,
    fontFamily: fonts.extraBold,
    fontSize: 28,
    lineHeight: 32,
  },
  description: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
  },
  summary: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.borderSoft,
    borderRadius: 20,
    borderCurve: 'continuous',
    padding: 14,
    gap: 6,
  },
  metaLabel: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  metaValue: {
    color: palette.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: 15,
  },
});
