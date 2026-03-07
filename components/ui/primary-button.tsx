import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text } from 'react-native';

import { fonts } from '@/constants/theme';
import { ElegantTypewriter } from './elegant-typewriter';

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    isLoading?: boolean;
}

/**
 * Gradient CTA button with orange glow.
 * Used for main actions like "Iniciar Sesión", "Registrarse", etc.
 */
export function PrimaryButton({ label, onPress, isLoading = false }: PrimaryButtonProps) {
    // Si isLoading es devuelto como true, delegaremos la renderización del \`label\` en ElegantTypewriter


    return (
        <Pressable
            onPress={isLoading ? undefined : onPress}
            style={({ pressed }) => ({
                borderRadius: 30,
                borderCurve: 'continuous',
                overflow: 'hidden',
                height: 56,
                borderWidth: 1.5,
                borderColor: '#3D2200',
                opacity: pressed ? 0.85 : 1,
                boxShadow:
                    '0 4px 28px rgba(255, 140, 0, 0.55), 0 0 12px rgba(255, 180, 0, 0.3)',
            })}
        >
            <LinearGradient
                colors={['#FFB800', '#FF9500', '#EE7700']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {isLoading ? (
                    <ElegantTypewriter
                        text={label}
                        style={{
                            color: '#3A3A3A',
                            fontSize: 18,
                            fontFamily: fonts.extraBold,
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                        }}
                    />
                ) : (
                    <Text
                        style={{
                            color: '#3A3A3A',
                            fontSize: 18,
                            fontFamily: fonts.extraBold,
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                        }}
                    >
                        {label}
                    </Text>
                )}
            </LinearGradient>
        </Pressable>
    );
}
