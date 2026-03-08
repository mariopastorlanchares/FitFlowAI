import { palette } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DashboardGridItemProps {
    iconName: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
}

export function DashboardGridItem({ iconName, title, subtitle, onPress }: DashboardGridItemProps) {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={iconName} size={32} color={palette.primary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: palette.surface,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1, // Cuadrada ideal
        width: '48%', // Para 2 columnas
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        color: palette.textPrimary,
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
    },
    subtitle: {
        color: palette.textSecondary,
        fontFamily: 'Inter_400Regular',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    }
});
