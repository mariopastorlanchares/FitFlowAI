import { useCallback, useEffect, useState } from 'react';

import { getWorkoutSession } from '../services/workout-service';
import { ActiveWorkoutSession } from '../types/workout';

export function useWorkoutSession(workoutId: string | string[]) {
  const [session, setSession] = useState<ActiveWorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [restActive, setRestActive] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setIsLoading(true);
      const workoutSession = await getWorkoutSession(workoutId);

      if (!isMounted) {
        return;
      }

      setSession(workoutSession);
      setIsLoading(false);
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [workoutId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (restActive && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((previousTime) => previousTime - 1);
      }, 1000);
    } else if (restTimeLeft === 0 && restActive) {
      setRestActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [restActive, restTimeLeft]);

  const toggleSet = useCallback(
    (exerciseIndex: number, setId: string, actualReps: number, actualWeight: number) => {
      setSession((previousSession) => {
        if (!previousSession) {
          return previousSession;
        }

        const updatedExercises = [...previousSession.exercises];
        const currentExercise = { ...updatedExercises[exerciseIndex] };
        const setIndex = currentExercise.sets.findIndex((set) => set.id === setId);

        if (setIndex === -1) {
          return previousSession;
        }

        const updatedSet = { ...currentExercise.sets[setIndex] };
        const wasCompleted = updatedSet.completed;

        updatedSet.actualReps = actualReps;
        updatedSet.actualWeight = actualWeight;
        updatedSet.completed = !wasCompleted;

        const updatedSets = [...currentExercise.sets];
        updatedSets[setIndex] = updatedSet;
        currentExercise.sets = updatedSets;
        updatedExercises[exerciseIndex] = currentExercise;

        if (!wasCompleted) {
          setRestTimeLeft(currentExercise.restSeconds);
          setRestActive(true);
        }

        return { ...previousSession, exercises: updatedExercises };
      });
    },
    []
  );

  const nextExercise = useCallback(() => {
    setSession((previousSession) => {
      if (!previousSession) {
        return previousSession;
      }

      if (previousSession.currentExerciseIndex < previousSession.exercises.length - 1) {
        setRestActive(false);
        setRestTimeLeft(0);

        return {
          ...previousSession,
          currentExerciseIndex: previousSession.currentExerciseIndex + 1,
        };
      }

      return previousSession;
    });
  }, []);

  const skipRest = useCallback(() => {
    setRestActive(false);
    setRestTimeLeft(0);
  }, []);

  const requestAlternative = useCallback(() => {
    console.log('Mock: Solicitando alternativa a la IA...');
    alert('Simulacion: Solicitando maquina alternativa a Gemini...');
  }, []);

  const sendAIFeedback = useCallback((feedback: string) => {
    console.log('Mock: Enviando feedback a la IA:', feedback);
  }, []);

  const finishWorkout = useCallback(() => {
    console.log('Mock: Finalizando entrenamiento', session);
  }, [session]);

  return {
    session,
    isLoading,
    currentExercise: session ? session.exercises[session.currentExerciseIndex] : null,
    currentExerciseIndex: session ? session.currentExerciseIndex : 0,
    isLastExercise: session
      ? session.currentExerciseIndex === session.exercises.length - 1
      : false,
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
