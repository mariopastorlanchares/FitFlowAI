import { AppBackground } from '@/components/app-background';
import { ActiveSetLogger } from '@/components/workout/execution/ActiveSetLogger';
import { AIGuidanceCard } from '@/components/workout/execution/AIGuidanceCard';
import { ExecutionControls } from '@/components/workout/execution/ExecutionControls';
import { ExerciseMedia } from '@/components/workout/execution/ExerciseMedia';
import { RestTimerLarge } from '@/components/workout/execution/RestTimerLarge';
import { WorkoutHeader } from '@/components/workout/execution/WorkoutHeader';
import { palette, typography } from '@/constants/theme';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function WorkoutExecutionScreen() {
    const router = useRouter();

    // Como ahora es un Tab, de momento codeamos '1' como ID de sesión activo
    const {
        session,
        isLoading,
        currentExercise,
        isLastExercise,
        currentExerciseIndex,
        restActive,
        restTimeLeft,
        toggleSet,
        nextExercise,
        skipRest,
        requestAlternative,
        sendAIFeedback,
        finishWorkout
    } = useWorkoutSession('1');

    // Temporizador global básico
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const activeSetIndex = currentExercise ? currentExercise.sets.findIndex(s => !s.completed) : -1;
    const hasNextSet = activeSetIndex !== -1;
    const isExerciseFinished = activeSetIndex === -1;

    // Si ya terminaron todas las series de este ejercicio, mostramos la última para no romper la UI,
    // o el usuario avanzará con el botón.
    const displaySetIndex = hasNextSet ? activeSetIndex : Math.max(0, (currentExercise?.sets.length || 1) - 1);
    const activeSet = currentExercise ? currentExercise.sets[displaySetIndex] : null;

    // Estados levantados para el formulario de la serie
    const [activeReps, setActiveReps] = useState((activeSet?.actualReps || activeSet?.targetReps || '0').toString());
    const [activeWeight, setActiveWeight] = useState((activeSet?.actualWeight ?? activeSet?.targetWeight ?? '0').toString());
    const [aiComment, setAiComment] = useState('');

    useEffect(() => {
        if (activeSet) {
            setActiveReps((activeSet.actualReps || activeSet.targetReps || '0').toString());
            setActiveWeight((activeSet.actualWeight ?? activeSet.targetWeight ?? '0').toString());
            setAiComment('');
        }
    }, [activeSet?.id]);

    const handleLogSet = () => {
        if (!hasNextSet) {
            if (isLastExercise) {
                finishWorkout();
                router.replace('/(tabs)');
            } else {
                nextExercise();
            }
            return;
        }
        if (activeSet) {
            const finalReps = parseInt(activeReps, 10) || 0;
            const finalWeight = parseFloat(activeWeight) || 0;
            toggleSet(currentExerciseIndex, activeSet.id, finalReps, finalWeight);
        }
    };

    if (isLoading || !currentExercise || !session || !activeSet) {
        return <View style={styles.container} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppBackground>
                <WorkoutHeader
                    onClose={() => router.navigate('/')}
                    elapsedTime={formatTime(elapsedSeconds)}
                />

                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Tarjeta de Sugerencia AI */}
                    <AIGuidanceCard
                        targetWeight={activeSet.targetWeight || 0}
                        targetReps={activeSet.targetReps}
                    />

                    {/* Media del Ejercicio */}
                    <ExerciseMedia
                        name={currentExercise.name}
                        imageUrl={currentExercise.imageUrl}
                    />

                    {/* Log de la serie actual */}
                    <ActiveSetLogger
                        currentSetNumber={displaySetIndex + 1}
                        totalSets={currentExercise.sets.length}
                        reps={activeReps}
                        weight={activeWeight}
                        onRepsChange={setActiveReps}
                        onWeightChange={setActiveWeight}
                    />

                    {/* Input de comentario para la IA */}
                    <View style={styles.commentContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Comentario a la IA (ej. me cuesta el hombro derecho)"
                            placeholderTextColor={palette.textSecondary}
                            value={aiComment}
                            onChangeText={setAiComment}
                            multiline
                        />
                    </View>

                    {/* Temporizador de descanso (aparece grande si estamos descansando) */}
                    {restActive && (
                        <View style={styles.timerSection}>
                            <Text style={styles.timerTitle}>TEMPORIZADOR DE DESCANSO</Text>
                            <RestTimerLarge
                                timeLeft={restTimeLeft}
                                totalTime={currentExercise.restSeconds}
                                onSkip={skipRest}
                            />
                        </View>
                    )}

                </ScrollView>

                {/* Botones inferiores */}
                <ExecutionControls
                    isExerciseFinished={isExerciseFinished}
                    isLastExercise={isLastExercise}
                    onRequestAlternative={requestAlternative}
                    onNextAction={handleLogSet}
                />
            </AppBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
        alignItems: 'center',
    },
    timerSection: {
        width: '100%',
        alignItems: 'center',
        marginTop: 24,
    },
    timerTitle: {
        ...typography.h3,
        color: palette.primary,
        textTransform: 'uppercase',
        marginBottom: 16,
        letterSpacing: 1,
    },
    commentContainer: {
        width: '100%',
        marginTop: 16,
    },
    commentInput: {
        backgroundColor: '#1E1E20',
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        color: palette.textPrimary,
        minHeight: 80,
        ...typography.body,
        textAlignVertical: 'top',
    }
});
