import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActiveSetLogger } from '../components/execution/active-set-logger';
import { AIGuidanceCard } from '../components/execution/ai-guidance-card';
import { ExecutionControls } from '../components/execution/execution-controls';
import { ExerciseMedia } from '../components/execution/exercise-media';
import { RestTimerLarge } from '../components/execution/rest-timer-large';
import { WorkoutHeader } from '../components/execution/workout-header';
import { useWorkoutSession } from '../hooks/use-workout-session';
import { AppBackground } from '@shared/components/app-background';
import { palette, typography } from '@shared/constants/theme';

export function WorkoutExecutionScreen() {
  const { t } = useTranslation();
  const router = useRouter();
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
    finishWorkout,
  } = useWorkoutSession('1');

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((previousTime) => previousTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const activeSetIndex = currentExercise
    ? currentExercise.sets.findIndex((set) => !set.completed)
    : -1;
  const hasNextSet = activeSetIndex !== -1;
  const isExerciseFinished = activeSetIndex === -1;
  const displaySetIndex = hasNextSet
    ? activeSetIndex
    : Math.max(0, (currentExercise?.sets.length || 1) - 1);
  const activeSet = currentExercise ? currentExercise.sets[displaySetIndex] : null;

  const [activeReps, setActiveReps] = useState(
    (activeSet?.actualReps || activeSet?.targetReps || '0').toString()
  );
  const [activeWeight, setActiveWeight] = useState(
    (activeSet?.actualWeight ?? activeSet?.targetWeight ?? '0').toString()
  );
  const [aiComment, setAiComment] = useState('');

  useEffect(() => {
    if (!activeSet) {
      return;
    }

    setActiveReps((activeSet.actualReps || activeSet.targetReps || '0').toString());
    setActiveWeight((activeSet.actualWeight ?? activeSet.targetWeight ?? '0').toString());
    setAiComment('');
  }, [activeSet]);

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

    if (!activeSet) {
      return;
    }

    const finalReps = parseInt(activeReps, 10) || 0;
    const finalWeight = parseFloat(activeWeight) || 0;

    toggleSet(currentExerciseIndex, activeSet.id, finalReps, finalWeight);
  };

  const handleAiCommentChange = (comment: string) => {
    setAiComment(comment);
    sendAIFeedback(comment);
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AIGuidanceCard
            targetWeight={activeSet.targetWeight || 0}
            targetReps={activeSet.targetReps}
          />

          <ExerciseMedia
            name={currentExercise.name}
            imageUrl={currentExercise.imageUrl}
          />

          <ActiveSetLogger
            currentSetNumber={displaySetIndex + 1}
            totalSets={currentExercise.sets.length}
            reps={activeReps}
            weight={activeWeight}
            onRepsChange={setActiveReps}
            onWeightChange={setActiveWeight}
          />

          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder={t('workout.screen.aiCommentPlaceholder')}
              placeholderTextColor={palette.textSecondary}
              value={aiComment}
              onChangeText={handleAiCommentChange}
              multiline
            />
          </View>

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
        </ScrollView>

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
    backgroundColor: palette.surfaceInset,
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
    backgroundColor: palette.surfaceMuted,
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
  },
});
