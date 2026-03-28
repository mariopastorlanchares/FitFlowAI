import {
  ExercisePrescription,
  GeneratedExerciseEntry,
  GeneratedWorkoutSession,
  WorkoutBlock,
} from '@shared/types/generator-contract';
import { getExerciseDisplayCopy } from '@shared/lib/exercise-catalog';
import i18n from '@shared/lib/i18n';

import { ActiveWorkoutSession, ExerciseSet, WorkoutExercise } from '../types/workout';

function getSetCount(prescription: ExercisePrescription) {
  if (prescription.set_count && prescription.set_count > 0) {
    return prescription.set_count;
  }

  if (Array.isArray(prescription.target_reps) && prescription.target_reps.length > 0) {
    return prescription.target_reps.length;
  }

  return 1;
}

function getTargetRepsForSet(prescription: ExercisePrescription, setIndex: number) {
  if (Array.isArray(prescription.target_reps)) {
    return prescription.target_reps[setIndex] ?? prescription.target_reps[prescription.target_reps.length - 1] ?? 0;
  }

  return prescription.target_reps ?? 0;
}

function getTargetWeight(prescription: ExercisePrescription) {
  if (prescription.intensity_method !== 'load_kg') {
    return undefined;
  }

  return prescription.intensity_value ?? 0;
}

function buildExerciseSets(entry: GeneratedExerciseEntry): ExerciseSet[] {
  const setCount = getSetCount(entry.prescription);
  const targetWeight = getTargetWeight(entry.prescription);

  return Array.from({ length: setCount }, (_, setIndex) => ({
    id: `${entry.entry_id}-set-${setIndex + 1}`,
    targetReps: getTargetRepsForSet(entry.prescription, setIndex),
    targetWeight,
    actualReps: getTargetRepsForSet(entry.prescription, setIndex),
    actualWeight: targetWeight,
    completed: false,
  }));
}

function getBlockRestSeconds(block: WorkoutBlock) {
  switch (block.block_type) {
    case 'straight_sets':
      return block.rest_seconds_after_exercise ?? 60;
    case 'superset':
    case 'triset':
      return block.rest_seconds_after_block;
    case 'circuit':
      return block.rest_seconds_after_round ?? 60;
    case 'emom':
      return block.interval_seconds;
    default:
      return 60;
  }
}

function buildWorkoutExercise(
  block: WorkoutBlock,
  entry: GeneratedExerciseEntry,
  restSeconds: number
): WorkoutExercise {
  const displayCopy = getExerciseDisplayCopy(entry.exercise_id);

  return {
    id: `${block.block_id}:${entry.entry_id}`,
    exerciseId: entry.exercise_id,
    name: displayCopy.name,
    description: displayCopy.description,
    sets: buildExerciseSets(entry),
    restSeconds,
    blockId: block.block_id,
    blockType: block.block_type,
    blockTitle: block.title,
    coachNotes: entry.coach_notes,
    selectionReason: entry.selection_reason,
  };
}

function flattenBlockExercises(block: WorkoutBlock): WorkoutExercise[] {
  const restSeconds = getBlockRestSeconds(block);

  if (block.block_type === 'straight_sets') {
    return [buildWorkoutExercise(block, block.exercise, restSeconds)];
  }

  return block.exercises.map((entry) => buildWorkoutExercise(block, entry, restSeconds));
}

function getWorkoutName(session: GeneratedWorkoutSession) {
  return i18n.t('workout.generatedSession.title', {
    goal: i18n.t(`workout.generatedSession.goals.${session.session_goal}` as any),
  });
}

export function adaptGeneratedWorkoutSession(
  session: GeneratedWorkoutSession
): ActiveWorkoutSession {
  const exercises = session.blocks.flatMap((block) => flattenBlockExercises(block));

  return {
    id: session.session_id,
    sourceSessionId: session.session_id,
    workoutName: getWorkoutName(session),
    sessionGoal: session.session_goal,
    sessionNotes: session.session_notes,
    summary: session.summary,
    exercises,
    startTime: new Date(),
    currentExerciseIndex: 0,
  };
}
