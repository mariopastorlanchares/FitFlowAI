import { ActiveWorkoutSession } from '@/types/workout';
import { useCallback, useEffect, useState } from 'react';

// Datos de prueba iniciales
const mockWorkout: ActiveWorkoutSession = {
    id: '1',
    workoutName: 'Día de Pecho V2',
    startTime: new Date(),
    currentExerciseIndex: 0,
    exercises: [
        {
            id: 'ex1',
            name: 'Sentadillas',
            description: 'Barra olímpica, espalda recta.',
            restSeconds: 90,
            sets: [
                { id: 'set1', targetReps: 10, targetWeight: 60, actualReps: 10, actualWeight: 60, completed: false },
                { id: 'set2', targetReps: 8, targetWeight: 65, actualReps: 8, actualWeight: 65, completed: false },
                { id: 'set3', targetReps: 8, targetWeight: 65, actualReps: 8, actualWeight: 65, completed: false },
            ]
        },
        {
            id: 'ex2',
            name: 'Prensa de Piernas',
            description: 'Mantener rodillas alineadas.',
            restSeconds: 60,
            sets: [
                { id: 'set4', targetReps: 12, targetWeight: 160, actualReps: 12, actualWeight: 160, completed: false },
                { id: 'set5', targetReps: 12, targetWeight: 160, actualReps: 12, actualWeight: 160, completed: false },
            ]
        }
    ]
};

export function useWorkoutSession(workoutId: string | string[]) {
    const [session, setSession] = useState<ActiveWorkoutSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Estado del temporizador de descanso
    const [restActive, setRestActive] = useState(false);
    const [restTimeLeft, setRestTimeLeft] = useState(0);

    // Cargar sesión
    useEffect(() => {
        // Simular carga asincrónica de datos de DB o estado global
        const load = setTimeout(() => {
            setSession(mockWorkout);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(load);
    }, [workoutId]);

    // Lógica del temporizador
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (restActive && restTimeLeft > 0) {
            interval = setInterval(() => {
                setRestTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (restTimeLeft === 0 && restActive) {
            setRestActive(false);
            // Optionally: Play a sound or vibrate
        }
        return () => clearInterval(interval);
    }, [restActive, restTimeLeft]);

    const toggleSet = useCallback((exerciseIndex: number, setId: string, actualReps: number, actualWeight: number) => {
        setSession(prev => {
            if (!prev) return prev;

            const updatedExercises = [...prev.exercises];
            const currentEx = { ...updatedExercises[exerciseIndex] };
            const setIndex = currentEx.sets.findIndex(s => s.id === setId);

            if (setIndex === -1) return prev;

            const setToUpdate = { ...currentEx.sets[setIndex] };
            const wasCompleted = setToUpdate.completed;

            setToUpdate.actualReps = actualReps;
            setToUpdate.actualWeight = actualWeight;
            setToUpdate.completed = !wasCompleted;

            const newSets = [...currentEx.sets];
            newSets[setIndex] = setToUpdate;
            currentEx.sets = newSets;
            updatedExercises[exerciseIndex] = currentEx;

            // Iniciar descanso si marcamos como completado
            if (!wasCompleted) {
                setRestTimeLeft(currentEx.restSeconds);
                setRestActive(true);
            }

            return { ...prev, exercises: updatedExercises };
        });
    }, []);

    const nextExercise = useCallback(() => {
        setSession(prev => {
            if (!prev) return prev;
            if (prev.currentExerciseIndex < prev.exercises.length - 1) {
                // Cancel timer before moving to next exercise
                setRestActive(false);
                setRestTimeLeft(0);
                return { ...prev, currentExerciseIndex: prev.currentExerciseIndex + 1 };
            }
            return prev;
        });
    }, []);

    const skipRest = useCallback(() => {
        setRestActive(false);
        setRestTimeLeft(0);
    }, []);

    const requestAlternative = useCallback(() => {
        console.log("Mock: Solicitando alternativa a la IA...");
        alert("Simulación: Solicitando máquina alternativa a Gemini...");
    }, []);

    const sendAIFeedback = useCallback((feedback: string) => {
        console.log("Mock: Enviando feedback a la IA: ", feedback);
    }, []);

    const finishWorkout = useCallback(() => {
        console.log("Mock: Finalizando entrenamiento", session);
    }, [session]);

    return {
        session,
        isLoading,
        currentExercise: session ? session.exercises[session.currentExerciseIndex] : null,
        currentExerciseIndex: session ? session.currentExerciseIndex : 0,
        isLastExercise: session ? session.currentExerciseIndex === session.exercises.length - 1 : false,
        restActive,
        restTimeLeft,
        toggleSet,
        nextExercise,
        skipRest,
        requestAlternative,
        sendAIFeedback,
        finishWorkout,
    };
}
