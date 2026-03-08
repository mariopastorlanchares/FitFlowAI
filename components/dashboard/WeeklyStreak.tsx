import { palette } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export function WeeklyStreak() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                <Text style={styles.label}>{t('dashboard.weekly_streak')} </Text>
                <Text style={styles.value}>3/4 </Text>
                <Text style={styles.caption}>[cite: 3Sesiones]</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: palette.surface,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: palette.primary + '40', // 40% opacity orange
        alignSelf: 'center',
        marginTop: 24,
    },
    text: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
    },
    label: {
        color: palette.textPrimary,
    },
    value: {
        color: palette.primary,
    },
    caption: {
        color: palette.textSecondary,
        fontFamily: 'Inter_400Regular',
    }
});
