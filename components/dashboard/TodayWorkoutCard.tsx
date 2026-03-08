import { palette } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function TodayWorkoutCard() {
    const { t } = useTranslation();

    return (
        <View style={styles.card}>
            {/* Header / Subtitle */}
            <Text style={styles.subtitle}>{t('dashboard.today_workout')}</Text>

            {/* Main Title */}
            <Text style={styles.title}>DÍA 1 EMPUJE</Text>

            {/* Description */}
            <Text style={styles.description}>(Pecho, Hombro, Tríceps)</Text>

            {/* Footer with Icons */}
            <View style={styles.footer}>
                <View style={styles.metaItem}>
                    <Feather name="clock" size={16} color={palette.textSecondary} />
                    <Text style={styles.metaText}>45-50 {t('dashboard.time')}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Feather name="target" size={16} color={palette.textSecondary} />
                    <Text style={styles.metaText}>{t('dashboard.focus')}: Fuerza</Text>
                </View>
            </View>

            {/* Nuevo CTA Discreto Integrado */}
            <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={() => console.log('Empezar Entrenamiento context')}
            >
                <Text style={styles.actionButtonText}>{t('dashboard.start_workout')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: palette.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 12, // Reducido para juntarlo más con Summary
        width: '100%',
    },
    subtitle: {
        color: palette.textSecondary,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        letterSpacing: 1,
        marginBottom: 16,
    },
    title: {
        color: palette.textPrimary,
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        color: palette.textSecondary,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        marginBottom: 32,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        color: palette.textPrimary,
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
    },
    actionButton: {
        marginTop: 24,
        paddingVertical: 16, // Aumentado para encuadrar mejor el texto
        paddingHorizontal: 32,
        backgroundColor: palette.primary,
        borderRadius: 30, // Un poco más redondeado
        width: '85%', // Un pelín más ancho 
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    actionButtonText: {
        color: palette.background,
        fontFamily: 'Inter_800ExtraBold', // Más peso tipográfico
        fontSize: 16, // Ligeramente mayor
        letterSpacing: 1,
        textAlign: 'center',
        textTransform: 'uppercase', // Más contundente como CTA
    }
});
