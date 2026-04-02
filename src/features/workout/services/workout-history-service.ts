import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import { db } from '@shared/lib/firebase';
import {
  EMPTY_WORKOUT_HISTORY_SUMMARY,
  type PersistedCompletedWorkoutSession,
  type WorkoutHistoryContextSnapshot,
  type WorkoutHistorySummary,
} from '@shared/types/workout-history';

import {
  buildCompletedWorkoutSessionRecord,
  buildCompletedWorkoutSessionId,
  buildWorkoutHistorySessionSummary,
  getActiveDayCount,
  getStartOfCurrentWeek,
} from '../lib/workout-history';
import type { ActiveWorkoutSession } from '../types/workout';

const WORKOUT_SESSIONS_COLLECTION = 'workoutSessions';

function workoutSessionsCollection(authUid: string) {
  return collection(db, 'userProfiles', authUid, WORKOUT_SESSIONS_COLLECTION);
}

function workoutSessionDocument(authUid: string, sessionId: string) {
  return doc(db, 'userProfiles', authUid, WORKOUT_SESSIONS_COLLECTION, sessionId);
}

export async function recordCompletedWorkoutSession(args: {
  authUid: string;
  session: ActiveWorkoutSession;
  context: WorkoutHistoryContextSnapshot;
}) {
  const sessionId = buildCompletedWorkoutSessionId(args.session);
  const record = buildCompletedWorkoutSessionRecord(args);

  await setDoc(workoutSessionDocument(args.authUid, sessionId), {
    ...record,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return sessionId;
}

export async function getWorkoutHistorySummary(authUid: string): Promise<WorkoutHistorySummary> {
  const collectionRef = workoutSessionsCollection(authUid);
  const startOfWeek = getStartOfCurrentWeek(new Date());

  const [totalCountSnapshot, currentWeekSnapshot, recentSnapshot] = await Promise.all([
    getCountFromServer(collectionRef),
    getDocs(query(collectionRef, where('completedAt', '>=', startOfWeek))),
    getDocs(query(collectionRef, orderBy('completedAt', 'desc'), limit(3))),
  ]);

  const recentSessions = recentSnapshot.docs
    .map((snapshot) =>
      buildWorkoutHistorySessionSummary(
        snapshot.id,
        snapshot.data() as PersistedCompletedWorkoutSession
      )
    )
    .filter((session): session is NonNullable<typeof session> => session !== null);

  const weekDates = currentWeekSnapshot.docs
    .map((snapshot) =>
      buildWorkoutHistorySessionSummary(
        snapshot.id,
        snapshot.data() as PersistedCompletedWorkoutSession
      )
    )
    .filter((session): session is NonNullable<typeof session> => session !== null)
    .map((session) => session.completedAt);

  if (totalCountSnapshot.data().count === 0) {
    return EMPTY_WORKOUT_HISTORY_SUMMARY;
  }

  return {
    totalCompletedSessions: totalCountSnapshot.data().count,
    completedSessionsThisWeek: currentWeekSnapshot.size,
    activeDaysThisWeek: getActiveDayCount(weekDates),
    recentSessions,
  };
}
