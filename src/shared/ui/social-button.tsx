import { Pressable } from 'react-native';

import { palette } from '@shared/constants/theme';

interface SocialButtonProps {
    provider: 'apple' | 'google';
    onPress: () => void;
    icon: React.ReactNode;
}

/**
 * Social login button (Apple / Google).
 * Apple → white border, Google → orange border.
 */
export function SocialButton({ provider, onPress, icon }: SocialButtonProps) {
    const isGoogle = provider === 'google';

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                borderRadius: 28,
                borderCurve: 'continuous',
                borderWidth: 2,
                borderColor: isGoogle ? palette.primary : palette.textPrimary,
                backgroundColor: pressed
                    ? isGoogle
                        ? palette.primaryTintSoft
                        : palette.neutralTint
                    : isGoogle
                        ? palette.primaryTintFaint
                        : palette.neutralTintFaint,
            })}
        >
            {icon}
        </Pressable>
    );
}
