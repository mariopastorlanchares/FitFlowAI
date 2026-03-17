import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { effects, palette } from '@shared/constants/theme';

export function TodayWorkoutCard() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Text style={styles.subtitle}>{t('dashboard.today_workout')}</Text>
      <Text style={styles.title}>{t('dashboard.card.title')}</Text>
      <Text style={styles.description}>{t('dashboard.card.description')}</Text>

      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={16} color={palette.textSecondary} />
          <Text style={styles.metaText}>{t('dashboard.card.duration')}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="target" size={16} color={palette.textSecondary} />
          <Text style={styles.metaText}>
            {t('dashboard.focus')}: {t('dashboard.card.focusValue')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.8}
        onPress={() => router.push('/workout')}
      >
        <Text style={styles.actionButtonText}>{t('dashboard.start_workout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: palette.borderSubtle,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
    width: '100%',
    boxShadow: effects.card,
  },
  subtitle: {
    color: palette.textSecondary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 16,
  },
  title: {
    color: palette.textPrimary,
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: palette.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: palette.textPrimary,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  actionButton: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: palette.primary,
    borderRadius: 30,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: effects.primaryButton,
  },
  actionButtonText: {
    color: palette.textOnPrimary,
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
