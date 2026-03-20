import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { fonts, palette } from '@shared/constants/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface FormInputProps {
    icon: IconName;
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType'];
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoComplete?: React.ComponentProps<typeof TextInput>['autoComplete'];
    textContentType?: React.ComponentProps<typeof TextInput>['textContentType'];
    returnKeyType?: React.ComponentProps<typeof TextInput>['returnKeyType'];
    autoFocus?: boolean;
    onSubmitEditing?: React.ComponentProps<typeof TextInput>['onSubmitEditing'];
}

export function FormInput({
    icon,
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoComplete,
    textContentType,
    returnKeyType,
    autoFocus = false,
    onSubmitEditing,
}: FormInputProps) {
    const [hidden, setHidden] = useState(secureTextEntry);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={{ gap: 8 }}>
            {label ? (
                <Text
                    style={{
                        color: palette.textSecondary,
                        fontSize: 13,
                        fontFamily: fonts.semiBold,
                        letterSpacing: 0.2,
                    }}
                >
                    {label}
                </Text>
            ) : null}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: palette.surfaceMuted,
                    borderWidth: 1,
                    borderColor: isFocused ? palette.inputBorderActive : palette.inputBorder,
                    borderRadius: 20,
                    borderCurve: 'continuous',
                    paddingHorizontal: 16,
                    minHeight: 58,
                    gap: 12,
                }}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={20}
                    color={isFocused ? palette.primaryLight : palette.textSecondary}
                />
                <TextInput
                    style={{
                        flex: 1,
                        color: palette.textPrimary,
                        fontSize: 16,
                        fontFamily: fonts.regular,
                        paddingVertical: 16,
                    }}
                    accessibilityLabel={label ?? placeholder}
                    placeholder={placeholder}
                    placeholderTextColor={palette.textSecondary}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={hidden}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                    returnKeyType={returnKeyType}
                    autoFocus={autoFocus}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
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
        </View>
    );
}
