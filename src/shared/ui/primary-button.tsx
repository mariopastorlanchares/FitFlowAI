import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { effects, fonts, gradients, palette } from '@shared/constants/theme';

interface PrimaryButtonProps {
    label: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export function PrimaryButton({
    label,
    onPress,
    isLoading = false,
    disabled = false,
}: PrimaryButtonProps) {
    const isDisabled = isLoading || disabled;

    return (
        <Pressable
            accessibilityRole="button"
            onPress={isDisabled ? undefined : onPress}
            style={({ pressed }) => ({
                borderRadius: 20,
                borderCurve: 'continuous',
                overflow: 'hidden',
                height: 56,
                borderWidth: 1,
                borderColor: palette.primaryBorder,
                opacity: isDisabled ? 0.7 : pressed ? 0.9 : 1,
                boxShadow: effects.primaryButton,
            })}
        >
            <LinearGradient
                colors={gradients.primaryButton}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    paddingHorizontal: 18,
                }}
            >
                {isLoading ? (
                    <ActivityIndicator color={palette.textOnPrimary} size="small" />
                ) : null}
                <Text
                    style={{
                        color: palette.textOnPrimary,
                        fontSize: 17,
                        fontFamily: fonts.extraBold,
                        letterSpacing: 0.3,
                    }}
                >
                    {label}
                </Text>
            </LinearGradient>
        </Pressable>
    );
}
