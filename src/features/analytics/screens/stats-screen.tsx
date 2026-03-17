import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { palette } from '@shared/constants/theme';

export function StatsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('analytics.placeholderTitle')}</Text>
        <Text style={styles.text}>{t('analytics.placeholderBody')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
});
