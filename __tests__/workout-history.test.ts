import {
  buildCompletedWorkoutSessionId,
  buildCompletedWorkoutSessionRecord,
  buildWorkoutHistorySessionSummary,
  getActiveDayCount,
  getStartOfCurrentWeek,
} from '@features/workout/lib/workout-history';
import type { ActiveWorkoutSession } from '@features/workout/types/workout';

const baseSession: ActiveWorkoutSession = {
  id: 'session-1',
  sourceSessionId: 'generated-1',
  source: 'live_generated',
  workoutName: 'Strength session',
  sessionGoal: 'strength',
  summary: 'Heavy lower body focus.',
  displayBlocks: [
    {
      blockId: 'block-1',
      blockType: 'straight_sets',
      orderIndex: 0,
      exercises: [
        {
          entryId: 'entry-1',
          exerciseId: 'back_squat',
          name: 'Back Squat',
        },
      ],
    },
  ],
  exercises: [
    {
      id: 'exercise-1',
      exerciseId: 'back_squat',
      name: 'Back Squat',
      sets: [
        {
          id: 'set-1',
          targetReps: 5,
          targetWeight: 100,
          actualReps: 5,
          actualWeight: 100,
          completed: true,
        },
        {
          id: 'set-2',
          targetReps: 5,
          targetWeight: 100,
          actualReps: 5,
          actualWeight: 100,
          completed: true,
        },
      ],
      restSeconds: 120,
      blockId: 'block-1',
      blockType: 'straight_sets',
    },
  ],
  startTime: new Date('2026-04-02T18:00:00Z'),
  currentExerciseIndex: 0,
};

describe('workout history helpers', () => {
  it('builds a completed workout snapshot with aggregate counts', () => {
    const record = buildCompletedWorkoutSessionRecord({
      authUid: 'user-1',
      session: baseSession,
      context: {
        location: 'gym',
        duration: 'medium',
        energy: 'high',
      },
      completedAt: new Date('2026-04-02T18:45:00Z'),
    });

    expect(record.authUid).toBe('user-1');
    expect(record.status).toBe('completed');
    expect(record.totalExercises).toBe(1);
    expect(record.totalSets).toBe(2);
    expect(record.completedSets).toBe(2);
    expect(record.context.location).toBe('gym');
    expect(record.exercises[0]?.sets[0]?.actualWeight).toBe(100);
  });

  it('builds a deterministic completed-session document id from session identity and start time', () => {
    expect(buildCompletedWorkoutSessionId(baseSession)).toBe('completed_generated-1_1775152800000');
  });

  it('normalizes a persisted session into a lightweight summary', () => {
    const summary = buildWorkoutHistorySessionSummary('doc-1', {
      ...buildCompletedWorkoutSessionRecord({
        authUid: 'user-1',
        session: baseSession,
        context: {
          location: 'gym',
          duration: 'medium',
          energy: 'high',
        },
        completedAt: new Date('2026-04-02T18:45:00Z'),
      }),
      createdAt: null,
      updatedAt: null,
    });

    expect(summary).toEqual({
      id: 'doc-1',
      workoutName: 'Strength session',
      source: 'live_generated',
      sessionGoal: 'strength',
      location: 'gym',
      completedAt: new Date('2026-04-02T18:45:00Z'),
      totalExercises: 1,
      totalSets: 2,
      completedSets: 2,
    });
  });

  it('counts active days in the same week without duplicating repeated dates', () => {
    expect(
      getActiveDayCount([
        new Date('2026-04-01T08:00:00Z'),
        new Date('2026-04-01T18:00:00Z'),
        new Date('2026-04-03T09:00:00Z'),
      ])
    ).toBe(2);
  });

  it('uses monday as the start of the current week', () => {
    const startOfWeek = getStartOfCurrentWeek(new Date('2026-04-05T14:00:00Z'));

    expect(startOfWeek.getDay()).toBe(1);
    expect(startOfWeek.getDate()).toBe(30);
    expect(startOfWeek.getMonth()).toBe(2);
    expect(startOfWeek.getHours()).toBe(0);
    expect(startOfWeek.getMinutes()).toBe(0);
  });
});
