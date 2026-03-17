import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { palette } from '@shared/constants/theme';

interface ProfileOptionRowProps {
  icon: React.ReactNode;
  title: string;
  hasTopBorder?: boolean;
}

export function ProfileOptionRow({
  icon,
  title,
  hasTopBorder = true,
}: ProfileOptionRowProps) {
  return (
    <TouchableOpacity style={[styles.optionContainer, hasTopBorder && styles.optionBorder]}>
      <View style={styles.optionLeft}>
        {icon}
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <ChevronRight size={20} color={palette.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionBorder: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    color: palette.textPrimary,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
});
