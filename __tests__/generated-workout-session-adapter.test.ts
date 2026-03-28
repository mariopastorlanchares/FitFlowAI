import { adaptGeneratedWorkoutSession } from '@features/workout/services/generated-workout-session-adapter';
import { GeneratedWorkoutSession } from '@shared/types/generator-contract';

describe('generated workout session adapter', () => {
  it('adapts a structured straight-sets session into the workout view model', () => {
    const session: GeneratedWorkoutSession = {
      session_id: 'session-1',
      session_type: 'generated_ephemeral',
      location: 'gym',
      session_goal: 'strength',
      estimated_duration_minutes: 40,
      summary: 'Structured preview session.',
      session_notes: 'Keep one rep in reserve.',
      blocks: [
        {
          block_id: 'block-1',
          block_type: 'straight_sets',
          order_index: 0,
          title: 'Primary lift',
          exercise: {
            entry_id: 'entry-1',
            exercise_id: 'back_squat',
            prescription: {
              set_count: 3,
              target_reps: [10, 8, 8],
              intensity_method: 'load_kg',
              intensity_value: 60,
            },
            coach_notes: 'Stay braced.',
            selection_reason: {
              reason_codes: ['matches_goal', 'fits_equipment'],
            },
          },
          rest_seconds_after_exercise: 90,
        },
      ],
    };

    const adapted = adaptGeneratedWorkoutSession(session);

    expect(adapted).toMatchObject({
      id: 'session-1',
      sourceSessionId: 'session-1',
      source: 'live_generated',
      workoutName: 'Strength session',
      sessionGoal: 'strength',
      sessionNotes: 'Keep one rep in reserve.',
      summary: 'Structured preview session.',
      currentExerciseIndex: 0,
    });
    expect(adapted.displayBlocks).toEqual([
      {
        blockId: 'block-1',
        blockType: 'straight_sets',
        title: 'Primary lift',
        orderIndex: 0,
        restSeconds: 90,
        exercises: [
          {
            entryId: 'entry-1',
            exerciseId: 'back_squat',
            name: 'Back Squat',
            description: 'Barbell squat pattern used as a canonical lower-body strength exercise.',
            coachNotes: 'Stay braced.',
            selectionReason: {
              reason_codes: ['matches_goal', 'fits_equipment'],
            },
          },
        ],
      },
    ]);
    expect(adapted.exercises[0]).toMatchObject({
      id: 'block-1:entry-1',
      exerciseId: 'back_squat',
      blockId: 'block-1',
      blockType: 'straight_sets',
      blockTitle: 'Primary lift',
      coachNotes: 'Stay braced.',
      restSeconds: 90,
      selectionReason: {
        reason_codes: ['matches_goal', 'fits_equipment'],
      },
    });
    expect(adapted.exercises[0]?.sets).toEqual([
      {
        id: 'entry-1-set-1',
        targetReps: 10,
        targetWeight: 60,
        actualReps: 10,
        actualWeight: 60,
        completed: false,
      },
      {
        id: 'entry-1-set-2',
        targetReps: 8,
        targetWeight: 60,
        actualReps: 8,
        actualWeight: 60,
        completed: false,
      },
      {
        id: 'entry-1-set-3',
        targetReps: 8,
        targetWeight: 60,
        actualReps: 8,
        actualWeight: 60,
        completed: false,
      },
    ]);
  });

  it('flattens composite blocks into a sequential exercise list for the current UI', () => {
    const session: GeneratedWorkoutSession = {
      session_id: 'session-2',
      session_type: 'generated_ephemeral',
      location: 'home',
      session_goal: 'hypertrophy',
      estimated_duration_minutes: 35,
      blocks: [
        {
          block_id: 'block-1',
          block_type: 'superset',
          order_index: 0,
          exercises: [
            {
              entry_id: 'entry-1',
              exercise_id: 'dumbbell_floor_press',
              prescription: {
                set_count: 3,
                target_reps: 12,
                intensity_method: 'load_kg',
                intensity_value: 20,
              },
            },
            {
              entry_id: 'entry-2',
              exercise_id: 'band_row',
              prescription: {
                set_count: 3,
                target_reps: 15,
                intensity_method: 'bodyweight',
              },
            },
          ],
          rest_seconds_after_block: 75,
        },
      ],
    };

    const adapted = adaptGeneratedWorkoutSession(session);

    expect(adapted.displayBlocks).toEqual([
      {
        blockId: 'block-1',
        blockType: 'superset',
        title: undefined,
        orderIndex: 0,
        restSeconds: 75,
        exercises: [
          {
            entryId: 'entry-1',
            exerciseId: 'dumbbell_floor_press',
            name: 'Dumbbell Floor Press',
            description: 'Horizontal push option for home setups with dumbbells and no bench.',
            coachNotes: undefined,
            selectionReason: undefined,
          },
          {
            entryId: 'entry-2',
            exerciseId: 'band_row',
            name: 'Band Row',
            description: 'Horizontal pull variation that only depends on resistance bands.',
            coachNotes: undefined,
            selectionReason: undefined,
          },
        ],
      },
    ]);
    expect(adapted.exercises).toHaveLength(2);
    expect(adapted.exercises[0]).toMatchObject({
      id: 'block-1:entry-1',
      blockType: 'superset',
      restSeconds: 75,
    });
    expect(adapted.exercises[1]).toMatchObject({
      id: 'block-1:entry-2',
      blockType: 'superset',
      restSeconds: 75,
    });
  });

  it('adapts circuit and emom blocks without losing structured timing cues', () => {
    const session: GeneratedWorkoutSession = {
      session_id: 'session-3',
      session_type: 'generated_ephemeral',
      location: 'park',
      session_goal: 'conditioning',
      estimated_duration_minutes: 20,
      blocks: [
        {
          block_id: 'block-1',
          block_type: 'circuit',
          order_index: 0,
          title: 'Circuit opener',
          exercises: [
            {
              entry_id: 'entry-1',
              exercise_id: 'push_up',
              prescription: {
                target_reps: [15, 12],
                intensity_method: 'bodyweight',
              },
              selection_reason: {
                reason_codes: ['time_efficient'],
                reason_text: 'Simple opener with low setup cost.',
              },
            },
          ],
          rounds: 2,
          rest_seconds_after_round: 45,
        },
        {
          block_id: 'block-2',
          block_type: 'emom',
          order_index: 1,
          exercises: [
            {
              entry_id: 'entry-2',
              exercise_id: 'pull_up',
              prescription: {
                target_reps: 5,
                intensity_method: 'bodyweight',
              },
              coach_notes: 'Reset grip every minute.',
            },
          ],
          duration_seconds: 600,
          interval_seconds: 60,
        },
      ],
    };

    const adapted = adaptGeneratedWorkoutSession(session);

    expect(adapted.workoutName).toBe('Conditioning session');
    expect(adapted.exercises).toHaveLength(2);
    expect(adapted.displayBlocks).toEqual([
      {
        blockId: 'block-1',
        blockType: 'circuit',
        title: 'Circuit opener',
        orderIndex: 0,
        restSeconds: 45,
        rounds: 2,
        durationSeconds: undefined,
        exercises: [
          {
            entryId: 'entry-1',
            exerciseId: 'push_up',
            name: 'Push-Up',
            description: 'Bodyweight horizontal push variation that works without extra equipment.',
            coachNotes: undefined,
            selectionReason: {
              reason_codes: ['time_efficient'],
              reason_text: 'Simple opener with low setup cost.',
            },
          },
        ],
      },
      {
        blockId: 'block-2',
        blockType: 'emom',
        title: undefined,
        orderIndex: 1,
        restSeconds: undefined,
        intervalSeconds: 60,
        durationSeconds: 600,
        exercises: [
          {
            entryId: 'entry-2',
            exerciseId: 'pull_up',
            name: 'Pull-Up',
            description: 'Vertical pull exercise that requires a pull-up bar.',
            coachNotes: 'Reset grip every minute.',
            selectionReason: undefined,
          },
        ],
      },
    ]);
    expect(adapted.exercises[0]).toMatchObject({
      exerciseId: 'push_up',
      blockType: 'circuit',
      blockTitle: 'Circuit opener',
      restSeconds: 45,
      selectionReason: {
        reason_codes: ['time_efficient'],
        reason_text: 'Simple opener with low setup cost.',
      },
      sets: [
        {
          targetReps: 15,
        },
        {
          targetReps: 12,
        },
      ],
    });
    expect(adapted.exercises[1]).toMatchObject({
      exerciseId: 'pull_up',
      blockType: 'emom',
      restSeconds: 60,
      coachNotes: 'Reset grip every minute.',
    });
  });
});
