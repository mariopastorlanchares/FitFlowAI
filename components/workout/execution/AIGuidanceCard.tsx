import { palette, typography } from '@shared/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AIGuidanceCardProps {
    targetWeight: number;
    targetReps: number;
    focus?: string; // e.g. "Hipertrofia, RIR 2"
    advice?: string; // e.g. "Sube de 85kg."
}

export function AIGuidanceCard({ targetWeight, targetReps, focus = "Hipertrofia, RIR 2", advice = "Sube de registro anterior." }: AIGuidanceCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>AI GUÍA Y SUGERENCIA</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.recommendationText}>
                    <Text style={styles.boldText}>AI RECOMENDACIÓN:</Text> {targetWeight}kg x {targetReps} reps
                </Text>
                <Text style={styles.subText}>
                    (Foco: {focus}). {advice}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'rgba(28,28,30, 0.7)',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: palette.primary,
        marginBottom: 20,
        // Resplandor naranja simulado
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 10,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: 'rgba(255, 140, 0, 0.15)', // Light orange tint
        paddingVertical: 8,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,140,0,0.3)',
    },
    headerTitle: {
        ...typography.h3,
        color: palette.primary,
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    content: {
        padding: 16,
        paddingTop: 12,
    },
    recommendationText: {
        ...typography.body,
        color: palette.textPrimary,
        fontSize: 15,
        marginBottom: 4,
    },
    boldText: {
        fontWeight: 'bold',
        color: palette.textPrimary,
    },
    subText: {
        ...typography.body,
        fontSize: 14,
        color: palette.textSecondary,
    }
});
