import { Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@features/auth/hooks/use-auth';
import { useUserProfile } from '@features/profile/hooks/use-user-profile';
import type { WorkoutHistoryContextSnapshot } from '@shared/types/workout-history';
import { getWorkoutSession } from '../services/workout-service';
import { recordCompletedWorkoutSession } from '../services/workout-history-service';
import { useWorkoutIntent } from '../store/use-workout-intent';
import { ActiveWorkoutSession, ExerciseSet, WorkoutDisplayBlock } from '../types/workout';
import i18n from '@shared/lib/i18n';
import { workoutHistorySummaryQueryKey } from './use-workout-history-summary';

function buildSetId() {
  return `set-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function getNextPendingIndex(sets: ExerciseSet[]) {
  return sets.findIndex((set) => !set.completed);
}

function getDefaultSelectedIndex(sets: ExerciseSet[]) {
  const nextPendingIndex = getNextPendingIndex(sets);

  if (nextPendingIndex !== -1) {
    return nextPendingIndex;
  }

  return Math.max(0, sets.length - 1);
}

const FINISH_WORKOUT_TIMEOUT_MS = 6000;
const FINISH_WORKOUT_TIMEOUT_CODE = 'WORKOUT_FINISH_TIMEOUT';

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(FINISH_WORKOUT_TIMEOUT_CODE));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

function isFinishTimeoutError(error: unknown) {
  return error instanceof Error && error.message === FINISH_WORKOUT_TIMEOUT_CODE;
}

export function useWorkoutSession(workoutId: string | string[]) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<ActiveWorkoutSession | null>(null);
  const [sessionContext, setSessionContext] = useState<WorkoutHistoryContextSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [restActive, setRestActive] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [isEditingSet, setIsEditingSet] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);
  const shouldReloadOnFocusRef = useRef(false);

  const isGenerationContextLoading = isAuthLoading || (Boolean(user) && isProfileLoading);

  useFocusEffect(
    useCallback(() => {
      if (!shouldReloadOnFocusRef.current) {
        return undefined;
      }

      shouldReloadOnFocusRef.current = false;
      setIsLoading(true);
      setReloadNonce((previousValue) => previousValue + 1);

      return undefined;
    }, [])
  );

  useEffect(() => {
    let isMounted = true;

    if (isGenerationContextLoading) {
      return () => {
        isMounted = false;
      };
    }

    async function loadSession() {
      setIsLoading(true);
      const currentIntent = useWorkoutIntent.getState();
      const currentSessionContext: WorkoutHistoryContextSnapshot = {
        location: currentIntent.location,
        duration: currentIntent.duration,
        energy: currentIntent.energy,
      };
      const workoutSession = await getWorkoutSession(workoutId, {
        authUid: user?.uid ?? null,
        userProfile,
        intent: currentIntent,
      });

      if (!isMounted) {
        return;
      }

      setSession(workoutSession);
      setSessionContext(currentSessionContext);
      setSelectedSetIndex(getDefaultSelectedIndex(workoutSession.exercises[0]?.sets ?? []));
      setIsEditingSet(false);
      setRestActive(false);
      setRestTimeLeft(0);
      setIsLoading(false);
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [isGenerationContextLoading, reloadNonce, user?.uid, userProfile, workoutId]);

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

  const currentExercise = useMemo(() => {
    if (!session) {
      return null;
    }

    return session.exercises[session.currentExerciseIndex] ?? null;
  }, [session]);

  const currentBlock = useMemo<WorkoutDisplayBlock | null>(() => {
    if (!session) {
      return null;
    }

    if (!currentExercise?.blockId) {
      return session.displayBlocks[0] ?? null;
    }

    return (
      session.displayBlocks.find((block) => block.blockId === currentExercise.blockId) ??
      session.displayBlocks[0] ??
      null
    );
  }, [currentExercise?.blockId, session]);

  const currentBlockIndex = useMemo(() => {
    if (!session || !currentBlock) {
      return 0;
    }

    const resolvedIndex = session.displayBlocks.findIndex(
      (block) => block.blockId === currentBlock.blockId
    );

    return resolvedIndex >= 0 ? resolvedIndex : 0;
  }, [currentBlock, session]);

  const nextPendingSetIndex = useMemo(() => {
    if (!currentExercise) {
      return -1;
    }

    return getNextPendingIndex(currentExercise.sets);
  }, [currentExercise]);

  const resolvedSelectedSetIndex = useMemo(() => {
    if (!currentExercise) {
      return 0;
    }

    if (selectedSetIndex !== null && currentExercise.sets[selectedSetIndex]) {
      return selectedSetIndex;
    }

    return getDefaultSelectedIndex(currentExercise.sets);
  }, [currentExercise, selectedSetIndex]);

  const selectedSet = useMemo(() => {
    if (!currentExercise) {
      return null;
    }

    return currentExercise.sets[resolvedSelectedSetIndex] ?? null;
  }, [currentExercise, resolvedSelectedSetIndex]);

  const selectSet = useCallback((setIndex: number) => {
    const candidateSet = currentExercise?.sets[setIndex];
    setSelectedSetIndex(setIndex);
    setIsEditingSet(Boolean(candidateSet?.completed));
  }, [currentExercise]);

  const syncSelectionForExercise = useCallback((exercise: ActiveWorkoutSession['exercises'][number]) => {
    setSelectedSetIndex(getDefaultSelectedIndex(exercise.sets));
    setIsEditingSet(false);
  }, []);

  const completeSet = useCallback(
    (exerciseIndex: number, setId: string, actualReps: number, actualWeight: number) => {
      setSession((previousSession) => {
        if (!previousSession) {
          return previousSession;
        }

        const updatedExercises = [...previousSession.exercises];
        const currentExerciseDraft = { ...updatedExercises[exerciseIndex] };
        const setIndex = currentExerciseDraft.sets.findIndex((set) => set.id === setId);

        if (setIndex === -1) {
          return previousSession;
        }

        const updatedSet = { ...currentExerciseDraft.sets[setIndex] };
        updatedSet.actualReps = actualReps;
        updatedSet.actualWeight = actualWeight;
        updatedSet.completed = true;

        const updatedSets = [...currentExerciseDraft.sets];
        updatedSets[setIndex] = updatedSet;
        currentExerciseDraft.sets = updatedSets;
        updatedExercises[exerciseIndex] = currentExerciseDraft;

        setRestTimeLeft(currentExerciseDraft.restSeconds);
        setRestActive(true);

        const newNextPendingIndex = getNextPendingIndex(updatedSets);
        setIsEditingSet(false);
        setSelectedSetIndex(
          newNextPendingIndex !== -1 ? newNextPendingIndex : Math.max(0, updatedSets.length - 1)
        );

        return { ...previousSession, exercises: updatedExercises };
      });
    },
    []
  );

  const updateSet = useCallback(
    (exerciseIndex: number, setId: string, actualReps: number, actualWeight: number) => {
      setSession((previousSession) => {
        if (!previousSession) {
          return previousSession;
        }

        const updatedExercises = [...previousSession.exercises];
        const currentExerciseDraft = { ...updatedExercises[exerciseIndex] };
        const setIndex = currentExerciseDraft.sets.findIndex((set) => set.id === setId);

        if (setIndex === -1) {
          return previousSession;
        }

        const updatedSet = { ...currentExerciseDraft.sets[setIndex] };
        updatedSet.actualReps = actualReps;
        updatedSet.actualWeight = actualWeight;

        const updatedSets = [...currentExerciseDraft.sets];
        updatedSets[setIndex] = updatedSet;
        currentExerciseDraft.sets = updatedSets;
        updatedExercises[exerciseIndex] = currentExerciseDraft;

        const newNextPendingIndex = getNextPendingIndex(updatedSets);
        setIsEditingSet(false);
        setSelectedSetIndex(
          newNextPendingIndex !== -1 ? newNextPendingIndex : Math.max(0, updatedSets.length - 1)
        );

        return { ...previousSession, exercises: updatedExercises };
      });
    },
    []
  );

  const addSet = useCallback((exerciseIndex: number) => {
    setSession((previousSession) => {
      if (!previousSession) {
        return previousSession;
      }

      const updatedExercises = [...previousSession.exercises];
      const currentExerciseDraft = { ...updatedExercises[exerciseIndex] };
      const lastSet = currentExerciseDraft.sets[currentExerciseDraft.sets.length - 1];

      const newSet: ExerciseSet = {
        id: buildSetId(),
        targetReps: lastSet?.targetReps ?? 8,
        targetWeight: lastSet?.targetWeight ?? 0,
        actualReps: lastSet?.actualReps ?? lastSet?.targetReps ?? 8,
        actualWeight: lastSet?.actualWeight ?? lastSet?.targetWeight ?? 0,
        completed: false,
      };

      const updatedSets = [...currentExerciseDraft.sets, newSet];
      currentExerciseDraft.sets = updatedSets;
      updatedExercises[exerciseIndex] = currentExerciseDraft;

      const nextPendingBeforeInsert = getNextPendingIndex(currentExerciseDraft.sets.slice(0, -1));
      setSelectedSetIndex(
        nextPendingBeforeInsert !== -1 ? nextPendingBeforeInsert : updatedSets.length - 1
      );
      setIsEditingSet(false);

      return { ...previousSession, exercises: updatedExercises };
    });
  }, []);

  const removeLastSet = useCallback((exerciseIndex: number) => {
    setSession((previousSession) => {
      if (!previousSession) {
        return previousSession;
      }

      const updatedExercises = [...previousSession.exercises];
      const currentExerciseDraft = { ...updatedExercises[exerciseIndex] };

      if (currentExerciseDraft.sets.length <= 1) {
        return previousSession;
      }

      const updatedSets = currentExerciseDraft.sets.slice(0, -1);
      currentExerciseDraft.sets = updatedSets;
      updatedExercises[exerciseIndex] = currentExerciseDraft;

      const nextSelection = getDefaultSelectedIndex(updatedSets);
      setSelectedSetIndex(nextSelection);
      setIsEditingSet(false);

      return { ...previousSession, exercises: updatedExercises };
    });
  }, []);

  const nextExercise = useCallback(() => {
    setSession((previousSession) => {
      if (!previousSession) {
        return previousSession;
      }

      if (previousSession.currentExerciseIndex < previousSession.exercises.length - 1) {
        const nextIndex = previousSession.currentExerciseIndex + 1;
        const nextExerciseDraft = previousSession.exercises[nextIndex];

        setRestActive(false);
        setRestTimeLeft(0);
        syncSelectionForExercise(nextExerciseDraft);

        return {
          ...previousSession,
          currentExerciseIndex: nextIndex,
        };
      }

      return previousSession;
    });
  }, [syncSelectionForExercise]);

  const skipRest = useCallback(() => {
    setRestActive(false);
    setRestTimeLeft(0);
  }, []);

  const requestAlternative = useCallback(() => {
    Alert.alert(
      i18n.t('workout.feedback.alternativeTitle'),
      i18n.t('workout.feedback.alternativeMessage')
    );
  }, []);

  const sendAIFeedback = useCallback((feedback: string) => {
    void feedback;

    Alert.alert(i18n.t('workout.ai.pendingTitle'), i18n.t('workout.ai.pendingFeedbackBody'));

    return false;
  }, []);

  const finishWorkout = useCallback(async () => {
    if (!session) {
      return false;
    }

    if (!user?.uid || !sessionContext) {
      console.warn('Skipping workout history persistence because auth or session context is missing.');
      return true;
    }

    if (isFinishing) {
      return false;
    }

    try {
      setIsFinishing(true);
      await withTimeout(
        recordCompletedWorkoutSession({
          authUid: user.uid,
          session,
          context: sessionContext,
        }),
        FINISH_WORKOUT_TIMEOUT_MS
      );
      await queryClient.invalidateQueries({ queryKey: workoutHistorySummaryQueryKey(user.uid) });
      shouldReloadOnFocusRef.current = true;

      return true;
    } catch (error) {
      console.warn('Failed to persist completed workout session.', error);
      Alert.alert(
        i18n.t('common.error'),
        i18n.t(isFinishTimeoutError(error) ? 'workout.finish.saveTimeout' : 'workout.finish.saveError')
      );

      return false;
    } finally {
      setIsFinishing(false);
    }
  }, [isFinishing, queryClient, session, sessionContext, user?.uid]);

  return {
    session,
    isLoading,
    isFinishing,
    currentExercise,
    currentBlock,
    currentBlockIndex,
    currentExerciseIndex: session ? session.currentExerciseIndex : 0,
    isLastExercise: session
      ? session.currentExerciseIndex === session.exercises.length - 1
      : false,
    selectedSet,
    selectedSetIndex: resolvedSelectedSetIndex,
    nextPendingSetIndex,
    isEditingSet,
    restActive,
    restTimeLeft,
    selectSet,
    completeSet,
    updateSet,
    addSet,
    removeLastSet,
    nextExercise,
    skipRest,
    requestAlternative,
    sendAIFeedback,
    finishWorkout,
  };
}
