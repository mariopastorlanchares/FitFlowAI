import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActiveSetLogger } from '../components/execution/active-set-logger';
import { AIGuidanceCard } from '../components/execution/ai-guidance-card';
import { ExecutionControls } from '../components/execution/execution-controls';
import { ExerciseMedia } from '../components/execution/exercise-media';
import { RestTimerLarge } from '../components/execution/rest-timer-large';
import { SessionContextCard } from '../components/execution/session-context-card';
import { SetProgressStrip } from '../components/execution/set-progress-strip';
import { WorkoutHeader } from '../components/execution/workout-header';
import { useWorkoutSession } from '../hooks/use-workout-session';
import { AppBackground } from '@shared/components/app-background';
import { palette, typography } from '@shared/constants/theme';

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function WorkoutExecutionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    session,
    isLoading,
    isFinishing,
    currentExercise,
    currentBlock,
    currentBlockIndex,
    isLastExercise,
    currentExerciseIndex,
    selectedSet,
    selectedSetIndex,
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
  } = useWorkoutSession('1');

  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState(0);
  const [exerciseElapsedSeconds, setExerciseElapsedSeconds] = useState(0);
  const [setStripExpanded, setSetStripExpanded] = useState(false);
  const [activeReps, setActiveReps] = useState('0');
  const [activeWeight, setActiveWeight] = useState('0');
  const [aiComment, setAiComment] = useState('');
  const sessionRunKey = session
    ? `${session.sourceSessionId ?? session.id}:${session.startTime.getTime()}`
    : null;

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionElapsedSeconds((previousTime) => previousTime + 1);
      setExerciseElapsedSeconds((previousTime) => previousTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setExerciseElapsedSeconds(0);
  }, [currentExerciseIndex]);

  useEffect(() => {
    if (!selectedSet) {
      return;
    }

    setActiveReps((selectedSet.actualReps || selectedSet.targetReps || '0').toString());
    setActiveWeight((selectedSet.actualWeight ?? selectedSet.targetWeight ?? '0').toString());
    setAiComment('');
  }, [selectedSet]);

  useEffect(() => {
    if (!sessionRunKey) {
      return;
    }

    setSessionElapsedSeconds(0);
    setExerciseElapsedSeconds(0);
    setSetStripExpanded(false);
  }, [sessionRunKey]);

  const isExerciseFinished = nextPendingSetIndex === -1;
  const hasPendingSet = nextPendingSetIndex !== -1;

  const handlePrimaryAction = async () => {
    if (!selectedSet) {
      return;
    }

    const finalReps = parseInt(activeReps, 10) || 0;
    const finalWeight = parseFloat(activeWeight) || 0;

    if (isEditingSet) {
      updateSet(currentExerciseIndex, selectedSet.id, finalReps, finalWeight);
      return;
    }

    if (!hasPendingSet) {
      if (isLastExercise) {
        const didFinish = await finishWorkout();

        if (didFinish) {
          router.replace('/(tabs)');
        }
      } else {
        nextExercise();
      }

      return;
    }

    completeSet(currentExerciseIndex, selectedSet.id, finalReps, finalWeight);
  };

  const handleAiCommentChange = (comment: string) => {
    setAiComment(comment);
  };

  const handleAiFeedbackSubmit = () => {
    const trimmedComment = aiComment.trim();

    if (!trimmedComment) {
      return;
    }

    const wasSent = sendAIFeedback(trimmedComment);

    if (wasSent) {
      setAiComment('');
    }
  };

  if (isLoading || !currentExercise || !session || !selectedSet) {
    return (
      <SafeAreaView style={styles.container}>
        <AppBackground>
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.loadingTitle}>{t('workout.loading.title')}</Text>
            <Text style={styles.loadingBody}>{t('workout.loading.body')}</Text>
          </View>
        </AppBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppBackground>
        <WorkoutHeader
          onClose={() => router.navigate('/')}
          sessionElapsedTime={formatTime(sessionElapsedSeconds)}
          exerciseElapsedTime={formatTime(exerciseElapsedSeconds)}
          restElapsedTime={restActive ? formatTime(restTimeLeft) : null}
          workoutName={session.workoutName}
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={session.exercises.length}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SessionContextCard
            source={session.source}
            summary={session.summary ?? session.sessionNotes}
            currentBlock={currentBlock}
            currentBlockIndex={currentBlockIndex}
            totalBlocks={session.displayBlocks.length}
            currentExerciseId={currentExercise.exerciseId}
          />

          <ExerciseMedia
            name={currentExercise.name}
            description={currentExercise.description}
            imageUrl={currentExercise.imageUrl}
            onRequestAlternative={requestAlternative}
          />

          <ActiveSetLogger
            currentSetNumber={selectedSetIndex + 1}
            targetReps={selectedSet.targetReps}
            targetWeight={selectedSet.targetWeight}
            reps={activeReps}
            weight={activeWeight}
            isEditing={isEditingSet}
            isLocked={isExerciseFinished && !isEditingSet}
            onRepsChange={setActiveReps}
            onWeightChange={setActiveWeight}
          >
            <SetProgressStrip
              sets={currentExercise.sets}
              selectedSetIndex={selectedSetIndex}
              nextPendingSetIndex={nextPendingSetIndex}
              isEditingSet={isEditingSet}
              expanded={setStripExpanded}
              onToggleExpanded={() => setSetStripExpanded((previousState) => !previousState)}
              onSelectSet={selectSet}
              onAddSet={() => addSet(currentExerciseIndex)}
              onRemoveLastSet={() => removeLastSet(currentExerciseIndex)}
            />
          </ActiveSetLogger>

          {restActive ? (
            <View style={styles.timerSection}>
              <Text style={styles.timerTitle}>{t('workout.rest.title')}</Text>
              <RestTimerLarge
                timeLeft={restTimeLeft}
                totalTime={currentExercise.restSeconds}
                onSkip={skipRest}
              />
            </View>
          ) : null}

          <AIGuidanceCard
            targetWeight={selectedSet.targetWeight || 0}
            targetReps={selectedSet.targetReps}
            feedback={aiComment}
            onFeedbackChange={handleAiCommentChange}
            onSubmitFeedback={handleAiFeedbackSubmit}
          />
        </ScrollView>

        <ExecutionControls
          isExerciseFinished={isExerciseFinished}
          isLastExercise={isLastExercise}
          isEditingSet={isEditingSet}
          isBusy={isFinishing}
          restActive={restActive}
          onNextAction={handlePrimaryAction}
        />
      </AppBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surfaceInset,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  loadingTitle: {
    ...typography.h3,
    color: palette.textPrimary,
    textAlign: 'center',
  },
  loadingBody: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
  },
  timerSection: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timerTitle: {
    ...typography.title,
    color: palette.textPrimary,
    marginBottom: 16,
  },
});
