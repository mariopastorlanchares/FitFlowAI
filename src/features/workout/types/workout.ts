import { ExerciseId } from '@shared/types/exercise-catalog';
import { SelectionReason, SessionGoal, WorkoutBlockType } from '@shared/types/generator-contract';

export type WorkoutSessionSource = 'live_generated' | 'fallback_preview';

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

export type WorkoutDisplayExercise = {
  entryId: string;
  exerciseId: ExerciseId;
  name: string;
  description?: string;
  coachNotes?: string;
  selectionReason?: SelectionReason;
};

export type WorkoutDisplayBlock = {
  blockId: string;
  blockType: WorkoutBlockType;
  title?: string;
  orderIndex: number;
  restSeconds?: number;
  rounds?: number;
  durationSeconds?: number;
  intervalSeconds?: number;
  exercises: WorkoutDisplayExercise[];
};

export type ActiveWorkoutSession = {
  id: string;
  sourceSessionId?: string;
  source: WorkoutSessionSource;
  workoutName: string;
  sessionGoal?: SessionGoal;
  sessionNotes?: string;
  summary?: string;
  displayBlocks: WorkoutDisplayBlock[];
  exercises: WorkoutExercise[];
  startTime: Date;
  endTime?: Date;
  currentExerciseIndex: number;
};
