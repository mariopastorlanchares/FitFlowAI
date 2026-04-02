import type { Timestamp } from 'firebase/firestore';

import type { ExerciseId } from './exercise-catalog';
import type { SelectionReason, SessionGoal, WorkoutBlockType } from './generator-contract';
import type { TrainingLocation } from './workout-context';

export type WorkoutHistorySource = 'live_generated' | 'fallback_preview';
export type WorkoutHistoryStatus = 'completed';
export type WorkoutDurationSnapshot = 'short' | 'medium' | 'long' | 'extended';
export type WorkoutEnergySnapshot = 'low' | 'medium' | 'high';

export interface WorkoutHistoryContextSnapshot {
  location: TrainingLocation;
  duration: WorkoutDurationSnapshot;
  energy: WorkoutEnergySnapshot;
}

export interface WorkoutHistorySetRecord {
  id: string;
  targetReps: number;
  targetWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
}

export interface WorkoutHistoryExerciseRecord {
  id: string;
  exerciseId: ExerciseId;
  name: string;
  description?: string;
  sets: WorkoutHistorySetRecord[];
  restSeconds: number;
  blockId?: string;
  blockType?: WorkoutBlockType;
  blockTitle?: string;
  coachNotes?: string;
  selectionReason?: SelectionReason;
}

export interface WorkoutHistoryDisplayExerciseRecord {
  entryId: string;
  exerciseId: ExerciseId;
  name: string;
  description?: string;
  coachNotes?: string;
  selectionReason?: SelectionReason;
}

export interface WorkoutHistoryDisplayBlockRecord {
  blockId: string;
  blockType: WorkoutBlockType;
  title?: string;
  orderIndex: number;
  restSeconds?: number;
  rounds?: number;
  durationSeconds?: number;
  intervalSeconds?: number;
  exercises: WorkoutHistoryDisplayExerciseRecord[];
}

export interface PersistedCompletedWorkoutSession {
  authUid: string;
  sourceSessionId?: string;
  source: WorkoutHistorySource;
  status: WorkoutHistoryStatus;
  workoutName: string;
  sessionGoal?: SessionGoal;
  sessionNotes?: string;
  summary?: string;
  context: WorkoutHistoryContextSnapshot;
  displayBlocks: WorkoutHistoryDisplayBlockRecord[];
  exercises: WorkoutHistoryExerciseRecord[];
  totalExercises: number;
  totalSets: number;
  completedSets: number;
  startedAt: Date | Timestamp | null;
  completedAt: Date | Timestamp | null;
  createdAt: Date | Timestamp | null;
  updatedAt: Date | Timestamp | null;
}

export interface WorkoutHistorySessionSummary {
  id: string;
  workoutName: string;
  source: WorkoutHistorySource;
  sessionGoal?: SessionGoal;
  location: TrainingLocation;
  completedAt: Date;
  totalExercises: number;
  totalSets: number;
  completedSets: number;
}

export interface WorkoutHistorySummary {
  totalCompletedSessions: number;
  completedSessionsThisWeek: number;
  activeDaysThisWeek: number;
  recentSessions: WorkoutHistorySessionSummary[];
}

export const EMPTY_WORKOUT_HISTORY_SUMMARY: WorkoutHistorySummary = {
  totalCompletedSessions: 0,
  completedSessionsThisWeek: 0,
  activeDaysThisWeek: 0,
  recentSessions: [],
};
