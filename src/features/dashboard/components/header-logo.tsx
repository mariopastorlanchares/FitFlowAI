import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, palette } from '@shared/constants/theme';

export function HeaderLogo() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Image
          source={require('@/assets/images/fitflow_logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <View style={styles.brandCopy}>
          <Text style={styles.eyebrow}>{t('dashboard.header.eyebrow')}</Text>
          <Text style={styles.title}>FitFlow AI</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>{t('dashboard.header.subtitle')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 28,
    height: 28,
  },
  brandCopy: {
    gap: 2,
  },
  eyebrow: {
    color: palette.primaryLight,
    fontFamily: fonts.semiBold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.textPrimary,
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: palette.textSecondary,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },
});
