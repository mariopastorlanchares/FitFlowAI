import { ExerciseId } from '@shared/types/exercise-catalog';
import { SelectionReason, SessionGoal, WorkoutBlockType } from '@shared/types/generator-contract';

export type ExerciseSet = {
  id: string;
  targetReps: number;
  targetWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: ExerciseId;
  name: string;
  description?: string;
  videoUrl?: string;
  imageUrl?: string;
  sets: ExerciseSet[];
  restSeconds: number;
  blockId?: string;
  blockType?: WorkoutBlockType;
  blockTitle?: string;
  coachNotes?: string;
  selectionReason?: SelectionReason;
};

export type ActiveWorkoutSession = {
  id: string;
  sourceSessionId?: string;
  workoutName: string;
  sessionGoal?: SessionGoal;
  sessionNotes?: string;
  summary?: string;
  exercises: WorkoutExercise[];
  startTime: Date;
  endTime?: Date;
  currentExerciseIndex: number;
};
