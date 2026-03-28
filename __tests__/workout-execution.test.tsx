import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { useWorkoutSession } from '@features/workout/hooks/use-workout-session';
import { WorkoutExecutionScreen } from '@features/workout/screens/workout-execution-screen';

const mockNavigate = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
  }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  Feather: 'Feather',
}));

jest.mock('@shared/components/app-background', () => ({
  AppBackground: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@features/workout/hooks/use-workout-session', () => ({
  useWorkoutSession: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string | number>) => {
      const translations: Record<string, string> = {
        'workout.header.totalTimer': 'Session',
        'workout.header.exerciseTimer': 'Exercise',
        'workout.header.restTimer': 'Rest',
        'workout.exercise.currentLabel': 'Current exercise',
        'workout.exercise.alternativeAction': 'See alternative',
        'workout.exercise.mediaPending':
          'Reference media is still pending. Use the exercise name and description for now.',
        'workout.generatedSession.sources.live_generated': 'Live AI',
        'workout.generatedSession.sources.fallback_preview': 'Preview',
        'workout.generatedSession.currentBlock': 'Current block',
        'workout.generatedSession.exerciseFlow': 'Block flow',
        'workout.generatedSession.blockTypes.straight_sets': 'Straight sets',
        'workout.generatedSession.blockTypes.superset': 'Superset',
        'workout.generatedSession.blockTypes.triset': 'Triset',
        'workout.generatedSession.blockTypes.circuit': 'Circuit',
        'workout.generatedSession.blockTypes.emom': 'EMOM',
        'workout.activeSet.title': 'Log this set',
        'workout.activeSet.editTitle': `Edit set ${options?.current}`,
        'workout.activeSet.targetLabel': 'Target',
        'workout.activeSet.weightLabel': 'Weight',
        'workout.activeSet.repsLabel': 'Reps',
        'workout.activeSet.repsUnit': 'reps',
        'workout.activeSet.readyHelper': 'Adjust the result before saving it.',
        'workout.activeSet.editingHelper': 'You are correcting a completed set.',
        'workout.activeSet.lockedHelper':
          'All sets for this exercise are already completed.',
        'workout.rest.title': 'REST TIMER',
        'workout.rest.skip': 'Skip rest',
        'workout.ai.title': 'AI support',
        'workout.ai.recommendationLabel': 'Suggested target:',
        'workout.ai.pendingTitle': 'AI feedback is not connected yet',
        'workout.ai.pendingBody':
          'Personalized guidance will appear here once the recommendation flow is connected.',
        'workout.ai.pendingFeedbackBody':
          'This note is not being sent anywhere yet. We will wire this action once the AI flow is available.',
        'workout.ai.feedbackLabel': 'Anything to adjust?',
        'workout.ai.feedbackPlaceholder':
          'Tell the AI if something feels off, unstable or unavailable.',
        'workout.ai.feedbackSubmit': 'Send to AI',
        'workout.controls.logSet': 'Save set',
        'workout.controls.saveChanges': 'Save changes',
        'workout.controls.nextExercise': 'Next exercise',
        'workout.controls.finish': 'Finish workout',
        'workout.controls.helperReady': 'Save the current set when you finish it.',
        'workout.controls.helperEditing':
          'You are editing a previous set. Saving changes will not trigger rest.',
        'workout.controls.helperRest':
          'Rest is running, but you can prepare the next set now.',
        'workout.controls.helperFinished':
          'This exercise is complete. Move on when you are ready.',
        'workout.setStrip.title': 'Sets',
        'workout.setStrip.currentSetLabel': 'Current set',
        'workout.setStrip.collapse': 'Hide',
        'workout.setStrip.expand': 'Review',
        'workout.setStrip.add': 'Add set',
        'workout.setStrip.removeLast': 'Remove last',
        'workout.setStrip.current': 'Current',
        'workout.setStrip.editing': 'Editing',
        'workout.setStrip.completed': 'Done',
        'workout.setStrip.pending': 'Pending',
      };

      if (key === 'workout.header.exerciseProgress') {
        return `Exercise ${options?.current} of ${options?.total}`;
      }

      if (key === 'workout.ai.recommendation') {
        return `${options?.weight} kg x ${options?.reps} reps`;
      }

      if (key === 'workout.ai.focusAdvice') {
        return `(Focus: ${options?.focus}). ${options?.advice}`;
      }

      if (key === 'workout.generatedSession.blockProgress') {
        return `Block ${options?.current} of ${options?.total}`;
      }

      if (key === 'workout.generatedSession.cadence.rounds') {
        return `${options?.count} rounds`;
      }

      if (key === 'workout.generatedSession.cadence.durationMinutes') {
        return `${options?.minutes} min`;
      }

      if (key === 'workout.generatedSession.cadence.intervalSeconds') {
        return `Every ${options?.seconds} sec`;
      }

      if (key === 'workout.generatedSession.cadence.restSeconds') {
        return `${options?.seconds} sec rest`;
      }

      if (key === 'workout.rest.goal') {
        return `Goal ${options?.time}`;
      }

      if (key === 'workout.activeSet.progress') {
        return `Set ${options?.current} of ${options?.total}.`;
      }

      if (key === 'workout.setStrip.summary') {
        return `${options?.completed}/${options?.total} completed`;
      }

      return translations[key] ?? key;
    },
  }),
}));

type WorkoutExerciseMock = {
  id: string;
  exerciseId: string;
  name: string;
  description: string;
  restSeconds: number;
  sets: {
    id: string;
    targetReps: number;
    targetWeight: number;
    actualReps: number;
    actualWeight: number;
    completed: boolean;
  }[];
};

type HookState = {
  session: {
    id: string;
    source: 'live_generated' | 'fallback_preview';
    workoutName: string;
    summary?: string;
    startTime: Date;
    currentExerciseIndex: number;
    displayBlocks: {
      blockId: string;
      blockType: string;
      title?: string;
      orderIndex: number;
      restSeconds?: number;
      rounds?: number;
      durationSeconds?: number;
      intervalSeconds?: number;
      exercises: {
        entryId: string;
        exerciseId: string;
        name: string;
      }[];
    }[];
    exercises: WorkoutExerciseMock[];
  };
  isLoading: boolean;
  currentExercise: WorkoutExerciseMock;
  currentBlock: {
    blockId: string;
    blockType: string;
    title?: string;
    orderIndex: number;
    restSeconds?: number;
    rounds?: number;
    durationSeconds?: number;
    intervalSeconds?: number;
    exercises: {
      entryId: string;
      exerciseId: string;
      name: string;
    }[];
  } | null;
  currentBlockIndex: number;
  currentExerciseIndex: number;
  isLastExercise: boolean;
  selectedSet: WorkoutExerciseMock['sets'][number];
  selectedSetIndex: number;
  nextPendingSetIndex: number;
  isEditingSet: boolean;
  restActive: boolean;
  restTimeLeft: number;
  selectSet: jest.Mock;
  completeSet: jest.Mock;
  updateSet: jest.Mock;
  addSet: jest.Mock;
  removeLastSet: jest.Mock;
  nextExercise: jest.Mock;
  skipRest: jest.Mock;
  requestAlternative: jest.Mock;
  sendAIFeedback: jest.Mock;
  finishWorkout: jest.Mock;
};

function buildHookState(overrides: Partial<HookState> = {}): HookState {
  const selectSet = jest.fn();
  const completeSet = jest.fn();
  const updateSet = jest.fn();
  const addSet = jest.fn();
  const removeLastSet = jest.fn();
  const nextExercise = jest.fn();
  const skipRest = jest.fn();
  const requestAlternative = jest.fn();
  const sendAIFeedback = jest.fn();
  const finishWorkout = jest.fn();

  const session = {
    id: '1',
    source: 'live_generated' as const,
    workoutName: 'General fitness session',
    summary: 'Live workout generated from the current profile.',
    startTime: new Date('2026-03-21T10:00:00.000Z'),
    currentExerciseIndex: 0,
    displayBlocks: [
      {
        blockId: 'block-1',
        blockType: 'superset',
        title: 'Upper-body pairing',
        orderIndex: 0,
        restSeconds: 90,
        exercises: [
          {
            entryId: 'entry-1',
            exerciseId: 'back_squat',
            name: 'Back Squat',
          },
          {
            entryId: 'entry-2',
            exerciseId: 'leg_press',
            name: 'Leg Press',
          },
        ],
      },
    ],
    exercises: [
      {
        id: 'ex1',
        exerciseId: 'back_squat',
        name: 'Back Squat',
        description: 'Olympic bar, keep your back neutral.',
        restSeconds: 90,
        sets: [
          {
            id: 'set1',
            targetReps: 10,
            targetWeight: 60,
            actualReps: 10,
            actualWeight: 60,
            completed: false,
          },
          {
            id: 'set2',
            targetReps: 8,
            targetWeight: 65,
            actualReps: 8,
            actualWeight: 65,
            completed: true,
          },
        ],
      },
      {
        id: 'ex2',
        exerciseId: 'leg_press',
        name: 'Leg Press',
        description: 'Keep your knees aligned.',
        restSeconds: 60,
        sets: [
          {
            id: 'set3',
            targetReps: 12,
            targetWeight: 160,
            actualReps: 12,
            actualWeight: 160,
            completed: false,
          },
        ],
      },
    ],
  };

  return {
    session,
    isLoading: false,
    currentExercise: session.exercises[0],
    currentBlock: session.displayBlocks[0],
    currentBlockIndex: 0,
    currentExerciseIndex: 0,
    isLastExercise: false,
    selectedSet: session.exercises[0].sets[0],
    selectedSetIndex: 0,
    nextPendingSetIndex: 0,
    isEditingSet: false,
    restActive: true,
    restTimeLeft: 75,
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
    ...overrides,
  };
}

describe('WorkoutExecutionScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders operational header timers and main workout blocks in the right order', () => {
    (useWorkoutSession as jest.Mock).mockReturnValue(buildHookState());

    const { getAllByText, getByText, queryByText } = render(<WorkoutExecutionScreen />);

    expect(getByText('Exercise 1 of 2')).toBeTruthy();
    expect(getByText('Live AI')).toBeTruthy();
    expect(getByText('Block 1 of 1')).toBeTruthy();
    expect(getByText('Superset')).toBeTruthy();
    expect(getByText('Upper-body pairing')).toBeTruthy();
    expect(getByText('Block flow')).toBeTruthy();
    expect(getAllByText('Back Squat').length).toBeGreaterThan(0);
    expect(getAllByText('Leg Press').length).toBeGreaterThan(0);
    expect(getByText('Session')).toBeTruthy();
    expect(getByText('Exercise')).toBeTruthy();
    expect(getByText('Rest')).toBeTruthy();
    expect(getByText('Sets')).toBeTruthy();
    expect(getByText('Current exercise')).toBeTruthy();
    expect(getByText('Log this set')).toBeTruthy();
    expect(getByText('REST TIMER')).toBeTruthy();
    expect(getByText('AI support')).toBeTruthy();
    expect(queryByText('Add set')).toBeNull();
    expect(queryByText('Remove last')).toBeNull();
  });

  it('expands the compact set strip and exposes edit/add/remove affordances', () => {
    const hookState = buildHookState();
    (useWorkoutSession as jest.Mock).mockReturnValue(hookState);

    const { getAllByText, getByText } = render(<WorkoutExecutionScreen />);

    fireEvent.press(getAllByText('Review')[0]);
    fireEvent.press(getByText('2'));
    fireEvent.press(getByText('Add set'));
    fireEvent.press(getByText('Remove last'));

    expect(getByText('Hide')).toBeTruthy();
    expect(hookState.selectSet).toHaveBeenCalledWith(1);
    expect(hookState.addSet).toHaveBeenCalledWith(0);
    expect(hookState.removeLastSet).toHaveBeenCalledWith(0);
  });

  it('saves the active pending set through the completion action', () => {
    const hookState = buildHookState();
    (useWorkoutSession as jest.Mock).mockReturnValue(hookState);

    const { getByText } = render(<WorkoutExecutionScreen />);

    fireEvent.press(getByText('Save set'));

    expect(hookState.completeSet).toHaveBeenCalledWith(0, 'set1', 10, 60);
  });

  it('submits AI feedback only when the explicit button is pressed', () => {
    const hookState = buildHookState();
    (useWorkoutSession as jest.Mock).mockReturnValue(hookState);

    const { getByPlaceholderText, getByText } = render(<WorkoutExecutionScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Tell the AI if something feels off, unstable or unavailable.'),
      'Reduce load, left knee feels unstable.'
    );
    fireEvent.press(getByText('Send to AI'));

    expect(hookState.sendAIFeedback).toHaveBeenCalledWith(
      'Reduce load, left knee feels unstable.'
    );
  });

  it('switches to explicit edit mode and saves changes without advancing the flow', () => {
    const hookState = buildHookState({
      selectedSet: {
        id: 'set2',
        targetReps: 8,
        targetWeight: 65,
        actualReps: 8,
        actualWeight: 65,
        completed: true,
      },
      selectedSetIndex: 1,
      nextPendingSetIndex: 0,
      isEditingSet: true,
      restActive: false,
    });

    (useWorkoutSession as jest.Mock).mockReturnValue(hookState);

    const { getByText } = render(<WorkoutExecutionScreen />);

    expect(getByText('Edit set 2')).toBeTruthy();
    expect(getByText('You are correcting a completed set.')).toBeTruthy();

    fireEvent.press(getByText('Save changes'));

    expect(hookState.updateSet).toHaveBeenCalledWith(0, 'set2', 8, 65);
    expect(hookState.completeSet).not.toHaveBeenCalled();
    expect(hookState.nextExercise).not.toHaveBeenCalled();
  });

  it('finishes the workout when the last exercise has no pending sets', () => {
    const baseState = buildHookState();
    const finishedExercise = {
      ...baseState.session.exercises[1],
      sets: [
        {
          id: 'set3',
          targetReps: 12,
          targetWeight: 160,
          actualReps: 12,
          actualWeight: 160,
          completed: true,
        },
      ],
    };

    const hookState = buildHookState({
      session: {
        ...baseState.session,
        currentExerciseIndex: 1,
        exercises: [baseState.session.exercises[0], finishedExercise],
      },
      currentExercise: finishedExercise,
      currentBlock: baseState.session.displayBlocks[0],
      currentBlockIndex: 0,
      currentExerciseIndex: 1,
      isLastExercise: true,
      selectedSet: finishedExercise.sets[0],
      selectedSetIndex: 0,
      nextPendingSetIndex: -1,
      isEditingSet: false,
      restActive: false,
    });

    (useWorkoutSession as jest.Mock).mockReturnValue(hookState);

    const { getByText } = render(<WorkoutExecutionScreen />);

    fireEvent.press(getByText('Finish workout'));

    expect(hookState.finishWorkout).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });
});
