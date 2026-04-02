import { Pressable, Text } from 'react-native';

import { fonts, palette } from '@shared/constants/theme';

interface SocialButtonProps {
    provider: 'apple' | 'google';
    onPress: () => void;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

export function SocialButton({
    provider,
    onPress,
    icon,
    label,
    disabled = false,
    accessibilityLabel,
    accessibilityHint,
}: SocialButtonProps) {
    const isGoogle = provider === 'google';

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={disabled ? undefined : onPress}
            style={({ pressed }) => ({
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                borderRadius: 18,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: isGoogle ? palette.primaryBorder : palette.borderSoft,
                backgroundColor: pressed ? palette.surfaceActive : palette.surfaceMuted,
                gap: 10,
                opacity: disabled ? 0.7 : 1,
            })}
        >
            {icon}
            <Text
                style={{
                    color: palette.textPrimary,
                    fontFamily: fonts.semiBold,
                    fontSize: 15,
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}
