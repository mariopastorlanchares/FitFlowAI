import { palette, typography } from '@/constants/theme';
import { WorkoutExercise } from '@/types/workout';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActiveExerciseDisplayProps {
    exercise: WorkoutExercise;
    onRequestAlternative: () => void;
}

export function ActiveExerciseDisplay({ exercise, onRequestAlternative }: ActiveExerciseDisplayProps) {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            {/* Visual Header con Imagen/Placeholder animado (futuro) */}
            <View style={styles.imageContainer}>
                {/* Usaremos el asset generado, por ahora lo forzamos con require si imageUrl no existe */}
                <Image
                    source={require('@/assets/images/squats_placeholder.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.infoRow}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{exercise.name}</Text>
                    {exercise.description && (
                        <Text style={styles.description}>{exercise.description}</Text>
                    )}
                </View>

                <TouchableOpacity onPress={onRequestAlternative} style={styles.altButton}>
                    <Ionicons name="swap-horizontal" size={20} color={palette.error} />
                    <Text style={styles.altButtonText}>{t('workout.request_alternative', { defaultValue: 'Alternativa' })}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    imageContainer: {
        height: 220,
        backgroundColor: '#1E1E1E', // Base oscura
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        // Sombra / Glow sutil
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        ...typography.h2,
        color: palette.textPrimary,
        marginBottom: 4,
    },
    description: {
        ...typography.body,
        color: palette.textSecondary,
    },
    altButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.surfaceActive,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: palette.border,
    },
    altButtonText: {
        ...typography.button,
        color: palette.error,
        fontSize: 12,
        marginLeft: 6,
    }
});
