import { Feather } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { palette, typography } from '@shared/constants/theme';

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
  onWeightChange,
}: ActiveSetLoggerProps) {
  const { t } = useTranslation();

  const handleDecrementWeight = () => {
    const value = parseFloat(weight) || 0;
    onWeightChange(Math.max(0, value - 2.5).toString());
  };

  const handleIncrementWeight = () => {
    const value = parseFloat(weight) || 0;
    onWeightChange((value + 2.5).toString());
  };

  const handleDecrementReps = () => {
    const value = parseInt(reps, 10) || 0;
    onRepsChange(Math.max(0, value - 1).toString());
  };

  const handleIncrementReps = () => {
    const value = parseInt(reps, 10) || 0;
    onRepsChange((value + 1).toString());
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsRow}>
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

        <View style={styles.gap} />

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
            <Text style={styles.unitText}>{t('workout.activeSet.repsUnit')}</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={handleIncrementReps}>
            <Feather name="plus" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.setText}>
        {t('workout.activeSet.progress', { current: currentSetNumber, total: totalSets })}
      </Text>
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
    backgroundColor: palette.surfaceMuted,
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
  },
  gap: {
    width: 12,
  },
});
