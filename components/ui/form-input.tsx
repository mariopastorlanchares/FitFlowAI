import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { fonts, palette } from '@/constants/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface FormInputProps {
    icon: IconName;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoComplete?: string;
    textContentType?: string;
}

/**
 * Pill-shaped input field with leading icon.
 * Supports secure text entry with a toggle eye icon.
 */
export function FormInput({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoComplete,
    textContentType,
}: FormInputProps) {
    const [hidden, setHidden] = useState(secureTextEntry);

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: palette.inputBackground,
                borderWidth: 1,
                borderColor: palette.inputBorder,
                borderRadius: 28,
                borderCurve: 'continuous',
                paddingHorizontal: 18,
                height: 54,
                gap: 12,
            }}
        >
            <MaterialCommunityIcons
                name={icon}
                size={20}
                color={palette.textSecondary}
            />
            <TextInput
                style={{
                    flex: 1,
                    color: palette.textPrimary,
                    fontSize: 16,
                    fontFamily: fonts.regular,
                }}
                placeholder={placeholder}
                placeholderTextColor={palette.textSecondary}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={hidden}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoComplete={autoComplete as any}
                textContentType={textContentType as any}
            />
            {secureTextEntry && (
                <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8}>
                    <MaterialCommunityIcons
                        name={hidden ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={palette.textSecondary}
                    />
                </Pressable>
            )}
        </View>
    );
}
