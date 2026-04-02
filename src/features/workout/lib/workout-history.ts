import type {
  PersistedCompletedWorkoutSession,
  WorkoutHistoryContextSnapshot,
  WorkoutHistorySessionSummary,
} from '@shared/types/workout-history';

import type { ActiveWorkoutSession } from '../types/workout';

function cloneDefined<T>(value: T): T {
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => cloneDefined(entry)).filter((entry) => entry !== undefined) as T;
  }

  if (value && typeof value === 'object') {
    const sanitizedEntries = Object.entries(value).flatMap(([key, entryValue]) => {
      if (entryValue === undefined) {
        return [];
      }

      return [[key, cloneDefined(entryValue)]];
    });

    return Object.fromEntries(sanitizedEntries) as T;
  }

  return value;
}

function toDate(value: { toDate: () => Date } | Date | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }

  return null;
}

function buildLocalDayKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function sanitizeDocumentIdSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export function getStartOfCurrentWeek(now: Date) {
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);

  const currentDay = startOfWeek.getDay();
  const offsetFromMonday = currentDay === 0 ? 6 : currentDay - 1;
  startOfWeek.setDate(startOfWeek.getDate() - offsetFromMonday);

  return startOfWeek;
}

export function getActiveDayCount(dates: Date[]) {
  return new Set(dates.map((date) => buildLocalDayKey(date))).size;
}

export function buildCompletedWorkoutSessionId(
  session: Pick<ActiveWorkoutSession, 'id' | 'sourceSessionId' | 'startTime'>
) {
  const baseId = sanitizeDocumentIdSegment(session.sourceSessionId ?? session.id ?? 'session');
  const startedAtMs = session.startTime.getTime();

  return `completed_${baseId}_${startedAtMs}`;
}

export function buildCompletedWorkoutSessionRecord(args: {
  authUid: string;
  session: ActiveWorkoutSession;
  context: WorkoutHistoryContextSnapshot;
  completedAt?: Date;
}): Omit<PersistedCompletedWorkoutSession, 'createdAt' | 'updatedAt'> {
  const { authUid, session, context, completedAt = new Date() } = args;
  const totalSets = session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const completedSets = session.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length,
    0
  );

  return cloneDefined({
    authUid,
    sourceSessionId: session.sourceSessionId,
    source: session.source,
    status: 'completed' as const,
    workoutName: session.workoutName,
    sessionGoal: session.sessionGoal,
    sessionNotes: session.sessionNotes,
    summary: session.summary,
    context,
    displayBlocks: session.displayBlocks,
    exercises: session.exercises,
    totalExercises: session.exercises.length,
    totalSets,
    completedSets,
    startedAt: session.startTime,
    completedAt,
  });
}

export function buildWorkoutHistorySessionSummary(
  id: string,
  session: PersistedCompletedWorkoutSession
): WorkoutHistorySessionSummary | null {
  const completedAt = toDate(session.completedAt);

  if (!completedAt) {
    return null;
  }

  return {
    id,
    workoutName: session.workoutName,
    source: session.source,
    sessionGoal: session.sessionGoal,
    location: session.context.location,
    completedAt,
    totalExercises: session.totalExercises,
    totalSets: session.totalSets,
    completedSets: session.completedSets,
  };
}
