import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { palette, typography } from '@shared/constants/theme';

interface WorkoutHeaderProps {
  onClose: () => void;
  elapsedTime: string;
}

export function WorkoutHeader({ onClose, elapsedTime }: WorkoutHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.logoContainer} onPress={onClose} activeOpacity={0.7}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={palette.textPrimary}
          style={styles.backIcon}
        />
        <Image
          source={require('@/assets/images/fitflow_logo.png')}
          style={styles.logoImage}
          contentFit="contain"
        />
        <Text style={styles.appName}>{t('common.appName')}</Text>
      </TouchableOpacity>

      <View style={styles.timerBadge}>
        <Ionicons
          name="stopwatch-outline"
          size={16}
          color={palette.primary}
          style={styles.icon}
        />
        <Text style={styles.timerText}>{elapsedTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 6,
  },
  appName: {
    ...typography.h2,
    color: palette.textPrimary,
    fontSize: 22,
  },
  logoImage: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  icon: {
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
  },
  timerText: {
    ...typography.body,
    fontWeight: '700',
    color: palette.textPrimary,
    marginLeft: 6,
    fontSize: 14,
  },
});
