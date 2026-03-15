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
                borderColor: isGoogle ? palette.primary : '#FFFFFF',
                backgroundColor: pressed
                    ? isGoogle
                        ? 'rgba(255, 140, 0, 0.1)'
                        : 'rgba(255, 255, 255, 0.08)'
                    : isGoogle
                        ? 'rgba(255, 140, 0, 0.04)'
                        : 'rgba(255, 255, 255, 0.03)',
            })}
        >
            {icon}
        </Pressable>
    );
}
