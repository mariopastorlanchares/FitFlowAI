import { palette, typography } from '@shared/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Consider using Expo LinearGradient here if available in the project, for now mocking with a solid+glossy style.

interface ExecutionControlsProps {
    isExerciseFinished: boolean;
    isLastExercise: boolean;
    onRequestAlternative: () => void;
    onNextAction: () => void;
}

export function ExecutionControls({
    isExerciseFinished,
    isLastExercise,
    onRequestAlternative,
    onNextAction
}: ExecutionControlsProps) {

    const primaryActionText = isExerciseFinished && isLastExercise
        ? "FINALIZAR ENTRENAMIENTO"
        : "LOG SET / SIGUIENTE SET";

    return (
        <View style={styles.container}>
            {/* Botón secundario */}
            <TouchableOpacity style={styles.secondaryButton} onPress={onRequestAlternative}>
                <Text style={styles.secondaryButtonText}>MÁQUINA OCUPADA? VER ALTERNATIVA</Text>
            </TouchableOpacity>

            {/* Botón principal */}
            <TouchableOpacity style={styles.primaryButton} onPress={onNextAction}>
                <Text style={styles.primaryButtonText}>{primaryActionText}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 32, // Padding inferior para dispositivos sin home button
        paddingTop: 16,
        backgroundColor: 'rgba(18, 18, 18, 0.85)', // Desenfoque simulado
    },
    secondaryButton: {
        width: '100%',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: palette.border,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#1E1E20',
    },
    secondaryButtonText: {
        ...typography.button,
        color: palette.textPrimary,
        fontSize: 14,
        letterSpacing: 0.5,
    },
    primaryButton: {
        width: '100%',
        borderRadius: 24,
        backgroundColor: palette.primary,
        paddingVertical: 16,
        alignItems: 'center',
        // Resplandor
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    primaryButtonText: {
        ...typography.button,
        color: palette.textPrimary,
        fontSize: 15,
        letterSpacing: 1,
        fontWeight: 'bold', // Para que destaque más como en la imagen
    }
});
