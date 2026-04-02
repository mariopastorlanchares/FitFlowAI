import { Text, View } from 'react-native';

import { fonts, palette } from '@shared/constants/theme';

interface StatusBannerProps {
  kind: 'error' | 'success';
  body: string;
  title?: string;
}

export function StatusBanner({ kind, body, title }: StatusBannerProps) {
  const isSuccess = kind === 'success';

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion={isSuccess ? 'polite' : 'assertive'}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 18,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: isSuccess ? palette.successBorder : palette.dangerBorder,
        backgroundColor: isSuccess ? palette.successTint : palette.dangerTint,
        gap: title ? 4 : 0,
      }}
    >
      {title ? (
        <Text
          selectable
          style={{
            color: isSuccess ? palette.success : palette.danger,
            fontFamily: fonts.semiBold,
            fontSize: 14,
          }}
        >
          {title}
        </Text>
      ) : null}
      <Text
        selectable
        style={{
          color: isSuccess ? palette.textPrimary : palette.danger,
          fontFamily: fonts.regular,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {body}
      </Text>
    </View>
  );
}
