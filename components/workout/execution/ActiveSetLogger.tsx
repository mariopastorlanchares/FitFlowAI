import { palette, typography } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ActiveSetLoggerProps {
    currentSetNumber: number;
    totalSets: number;
    reps: string;
    weight: string;
    onRepsChange: (reps: string) => void;
    onWeightChange: (weight: string) => void;
}

export function ActiveSetLogger({
    currentSetNumber,
    totalSets,
    reps,
    weight,
    onRepsChange,
    onWeightChange
}: ActiveSetLoggerProps) {
    const handleDecrementWeight = () => {
        const val = parseFloat(weight) || 0;
        onWeightChange(Math.max(0, val - 2.5).toString());
    };
    const handleIncrementWeight = () => {
        const val = parseFloat(weight) || 0;
        onWeightChange((val + 2.5).toString());
    };
    const handleDecrementReps = () => {
        const val = parseInt(reps, 10) || 0;
        onRepsChange(Math.max(0, val - 1).toString());
    };
    const handleIncrementReps = () => {
        const val = parseInt(reps, 10) || 0;
        onRepsChange((val + 1).toString());
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputsRow}>
                {/* Bloque de Peso */}
                <View style={styles.inputBox}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleDecrementWeight}>
                        <Feather name="minus" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={onWeightChange}
                            selectTextOnFocus
                            maxLength={5}
                        />
                        <Text style={styles.unitText}>kg</Text>
                    </View>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleIncrementWeight}>
                        <Feather name="plus" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Separador invisible para gap */}
                <View style={{ width: 12 }} />

                {/* Bloque de Repeticiones */}
                <View style={styles.inputBox}>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleDecrementReps}>
                        <Feather name="minus" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                    <View style={styles.textInputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            keyboardType="numeric"
                            value={reps}
                            onChangeText={onRepsChange}
                            selectTextOnFocus
                            maxLength={4}
                        />
                        <Text style={styles.unitText}>reps</Text>
                    </View>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleIncrementReps}>
                        <Feather name="plus" size={24} color={palette.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.setText}>Set {currentSetNumber} de {totalSets}.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    inputBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1E1E20', // Gris oscuro
        borderWidth: 1,
        borderColor: palette.border,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    actionBtn: {
        padding: 4,
    },
    textInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    textInput: {
        ...typography.h2,
        color: palette.textPrimary,
        fontSize: 26,
        textAlign: 'center',
        minWidth: 40,
        padding: 0,
    },
    unitText: {
        ...typography.body,
        color: palette.textSecondary,
        fontSize: 16,
        marginLeft: 2,
        marginTop: 6,
    },
    setText: {
        ...typography.body,
        fontSize: 14,
        color: palette.textSecondary,
        marginTop: 16,
    }
});
