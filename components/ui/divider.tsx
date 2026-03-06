import { Text, View } from 'react-native';

import { fonts, palette } from '@/constants/theme';

interface DividerProps {
    label: string;
}

/**
 * Horizontal line with centered text label.
 * Used for "O entra con" style separators.
 */
export function Divider({ label }: DividerProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
            }}
        >
            <View
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: palette.border,
                }}
            />
            <Text
                style={{
                    color: palette.textSecondary,
                    fontSize: 14,
                    fontFamily: fonts.regular,
                }}
            >
                {label}
            </Text>
            <View
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: palette.border,
                }}
            />
        </View>
    );
}
