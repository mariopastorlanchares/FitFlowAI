import { palette, typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// Podríamos usar react-native-circular-progress o dibujarlo con react-native-svg
// Para esta fase usaremos un mock visual con bordes redondos de Expo/React Native estándar.

interface RestTimerLargeProps {
    timeLeft: number;
    totalTime: number;
    onSkip: () => void;
}

export function RestTimerLarge({ timeLeft, totalTime, onSkip }: RestTimerLargeProps) {
    const progress = totalTime > 0 ? timeLeft / totalTime : 0;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const totalMinutes = Math.floor(totalTime / 60);
    const totalSeconds = totalTime % 60;
    const formattedTotal = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            {/* Este es un contenedor simulando el SVG circular de momento */}
            <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                    <Text style={styles.timeText}>{formattedTime}</Text>
                    <Text style={styles.goalText}>Goal {formattedTotal} min</Text>
                </View>

                {/* Arco de progreso superpuesto (simplificado para MVP usando view/border) */}
                <View style={[styles.progressArc, {
                    borderTopColor: palette.primary,
                    borderRightColor: progress > 0.25 ? palette.primary : 'transparent',
                    borderBottomColor: progress > 0.5 ? palette.primary : 'transparent',
                    borderLeftColor: progress > 0.75 ? palette.primary : 'transparent',
                    transform: [{ rotate: '45deg' }]
                }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    outerCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
        // Efecto Glow
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 8,
    },
    innerCircle: {
        width: 124,
        height: 124,
        borderRadius: 62,
        backgroundColor: '#121212', // mismo que el fondo o ligeramente más oscuro
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    timeText: {
        ...typography.h1,
        color: palette.textPrimary,
        fontSize: 32,
    },
    goalText: {
        ...typography.body,
        color: palette.textSecondary,
        fontSize: 12,
        marginTop: 4,
    },
    progressArc: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 8,
        borderColor: 'transparent', // The rest is transparent, we override specific sides
        zIndex: 1,
    }
});
