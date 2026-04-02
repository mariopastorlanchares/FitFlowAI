import {
  buildGenerateWorkoutSessionInput,
  sanitizeGeneratedWorkoutSession,
  validateGenerateWorkoutSessionInput,
  validateGeneratedWorkoutSession,
} from '@shared/lib/generator-contract';
import { EffectiveCapabilityId } from '@shared/types/exercise-catalog';
import { UserProfile } from '@shared/types/user-profile';

function buildProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    authUid: 'user-1',
    experienceLevel: 'intermediate',
    preferredLocations: ['gym', 'home'],
    defaultLocation: 'gym',
    homeEquipment: {
      dumbbells: { isPair: true, adjustable: true, maxWeightKg: 24 },
      bench: { adjustableIncline: true },
    },
    contextProfiles: {
      gym: {
        enabledCapabilities: ['dumbbells', 'barbell', 'bench', 'machine_access'],
        templateId: 'gym_v1',
        updatedAt: null,
      },
      park: {
        enabledCapabilities: ['pullup_bar', 'parallel_bars'],
        templateId: 'park_v1',
        updatedAt: null,
      },
    },
    createdAt: null,
    updatedAt: null,
    ...overrides,
  };
}

describe('generator contract builder', () => {
  it('builds a home payload from home equipment and implicit bodyweight', () => {
    const input = buildGenerateWorkoutSessionInput({
      requestId: 'req-home',
      location: 'home',
      profile: buildProfile(),
      preferredBlockTypes: ['straight_sets', 'superset'],
      durationMinutes: 45,
      sessionGoal: 'hypertrophy',
    });

    expect(input).toEqual({
      request_id: 'req-home',
      location: 'home',
      experience_level: 'intermediate',
      available_capabilities: ['bodyweight', 'dumbbells', 'bench'],
      preferred_block_types: ['straight_sets', 'superset'],
      duration_minutes: 45,
      session_goal: 'hypertrophy',
      equipment_profile: {
        home_equipment: {
          dumbbells: { isPair: true, adjustable: true, maxWeightKg: 24 },
          bench: { adjustableIncline: true },
        },
      },
    });
  });

  it('builds a contextual payload from saved context capabilities outside home', () => {
    const input = buildGenerateWorkoutSessionInput({
      requestId: 'req-park',
      location: 'park',
      profile: buildProfile(),
      preferredBlockTypes: ['circuit'],
      durationMinutes: 30,
      sessionGoal: 'conditioning',
    });

    expect(input.available_capabilities).toEqual(['bodyweight', 'pullup_bar', 'parallel_bars']);
    expect(input.equipment_profile.context_capabilities).toEqual(['pullup_bar', 'parallel_bars']);
  });
});

describe('generator contract validation', () => {
  it('accepts a valid input payload', () => {
    const input = buildGenerateWorkoutSessionInput({
      requestId: 'req-valid',
      location: 'gym',
      profile: buildProfile(),
      preferredBlockTypes: ['straight_sets', 'triset'],
      durationMinutes: 50,
      sessionGoal: 'strength',
    });

    expect(validateGenerateWorkoutSessionInput(input)).toEqual({
      success: true,
      data: input,
    });
  });

  it('accepts null context_capabilities from transport when the field is effectively absent', () => {
    const input = buildGenerateWorkoutSessionInput({
      requestId: 'req-null-context',
      location: 'home',
      profile: buildProfile(),
      preferredBlockTypes: ['straight_sets'],
      durationMinutes: 35,
      sessionGoal: 'general_fitness',
    });

    const result = validateGenerateWorkoutSessionInput({
      ...input,
      equipment_profile: {
        ...input.equipment_profile,
        context_capabilities: null,
      },
    });

    expect(result).toEqual({
      success: true,
      data: {
        ...input,
        equipment_profile: {
          ...input.equipment_profile,
          context_capabilities: null,
        },
      },
    });
  });

  it('rejects an invalid generated session with structural and domain errors', () => {
    const result = validateGeneratedWorkoutSession({
      session_id: '',
      session_type: 'generated_ephemeral',
      location: 'home',
      session_goal: 'strength',
      estimated_duration_minutes: 45,
      blocks: [
        {
          block_id: 'block-1',
          block_type: 'circuit',
          order_index: 0,
          exercises: [
            {
              entry_id: 'entry-1',
              exercise_id: 'leg_press',
              prescription: {
                intensity_method: 'load_kg',
                target_reps: 10,
              },
            },
          ],
        },
        {
          block_id: 'block-2',
          block_type: 'emom',
          order_index: 1,
          exercises: [
            {
              entry_id: 'entry-2',
              exercise_id: 'push_up',
              prescription: {
                intensity_method: 'bodyweight',
                target_reps: [12, 12],
              },
            },
          ],
          duration_seconds: 600,
          interval_seconds: 45,
        },
      ],
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error('Expected invalid generated session.');
    }

    expect(result.errors).toContain('session_id must be a non-empty string.');
    expect(result.errors).toContain('blocks[0] must include rounds or duration_seconds.');
    expect(result.errors).toContain('blocks[1].interval_seconds must be exactly 60.');
  });

  it('accepts a valid generated session payload', () => {
    const session = {
      session_id: 'session-1',
      session_type: 'generated_ephemeral' as const,
      location: 'park' as const,
      session_goal: 'skill' as const,
      estimated_duration_minutes: 35,
      summary: 'Short calisthenics session.',
      session_notes: 'Stay submaximal.',
      blocks: [
        {
          block_id: 'block-1',
          block_type: 'straight_sets' as const,
          order_index: 0,
          exercise: {
            entry_id: 'entry-1',
            exercise_id: 'pull_up' as const,
            prescription: {
              set_count: 5,
              target_reps: 5,
              intensity_method: 'bodyweight' as const,
            },
            selection_reason: {
              reason_codes: ['fits_location', 'fits_equipment'],
              reason_text: 'Matches the saved park setup.',
            },
            coach_notes: 'Leave one rep in reserve.',
          },
          rest_seconds_after_exercise: 90,
        },
        {
          block_id: 'block-2',
          block_type: 'emom' as const,
          order_index: 1,
          exercises: [
            {
              entry_id: 'entry-2',
              exercise_id: 'push_up' as const,
              prescription: {
                target_reps: 12,
                intensity_method: 'bodyweight' as const,
              },
            },
          ],
          duration_seconds: 600,
          interval_seconds: 60 as const,
        },
      ],
    };

    expect(validateGeneratedWorkoutSession(session)).toEqual({
      success: true,
      data: session,
    });
  });

  it('normalizes null optional transport fields in a generated session payload', () => {
    const session = {
      session_id: 'session-nullable-1',
      session_type: 'generated_ephemeral' as const,
      location: 'gym' as const,
      session_goal: 'general_fitness' as const,
      estimated_duration_minutes: 30,
      summary: null,
      session_notes: null,
      blocks: [
        {
          block_id: 'block-1',
          block_type: 'straight_sets' as const,
          order_index: 0,
          title: null,
          exercise: {
            entry_id: 'entry-1',
            exercise_id: 'push_up' as const,
            prescription: {
              set_count: 3,
              target_reps: 12,
              intensity_method: 'bodyweight' as const,
            },
            coach_notes: null,
          },
          rest_seconds_after_exercise: 60,
        },
      ],
    };

    expect(validateGeneratedWorkoutSession(session)).toEqual({
      success: true,
      data: {
        session_id: 'session-nullable-1',
        session_type: 'generated_ephemeral',
        location: 'gym',
        session_goal: 'general_fitness',
        estimated_duration_minutes: 30,
        summary: undefined,
        session_notes: undefined,
        blocks: [
          {
            block_id: 'block-1',
            block_type: 'straight_sets',
            order_index: 0,
            title: undefined,
            exercise: {
              entry_id: 'entry-1',
              exercise_id: 'push_up',
              prescription: {
                set_count: 3,
                target_reps: 12,
                intensity_method: 'bodyweight',
                intensity_value: undefined,
                tempo: undefined,
              },
              selection_reason: undefined,
              coach_notes: undefined,
            },
            rest_seconds_after_exercise: 60,
            exercises: undefined,
            rest_seconds_after_block: undefined,
            rest_seconds_after_round: undefined,
            rounds: undefined,
            duration_seconds: undefined,
            interval_seconds: undefined,
          },
        ],
      },
    });
  });

  it('accepts a valid circuit payload with controlled free-text fields', () => {
    const session = {
      session_id: 'session-circuit-1',
      session_type: 'generated_ephemeral' as const,
      location: 'gym' as const,
      session_goal: 'conditioning' as const,
      estimated_duration_minutes: 24,
      summary: 'Short density block.',
      blocks: [
        {
          block_id: 'block-1',
          block_type: 'circuit' as const,
          order_index: 0,
          title: 'Density finisher',
          exercises: [
            {
              entry_id: 'entry-1',
              exercise_id: 'kettlebell_swing' as const,
              prescription: {
                target_reps: 20,
                intensity_method: 'bodyweight' as const,
              },
              selection_reason: {
                reason_codes: ['matches_goal', 'time_efficient'],
                reason_text: 'Fast hinge pattern to finish the session.',
              },
              coach_notes: 'Keep the hinge explosive.',
            },
          ],
          duration_seconds: 480,
          rest_seconds_after_round: 60,
        },
      ],
    };

    expect(validateGeneratedWorkoutSession(session)).toEqual({
      success: true,
      data: session,
    });
  });
});

describe('generator contract sanitization', () => {
  function sanitizeWithCapabilities(
    session: Parameters<typeof sanitizeGeneratedWorkoutSession>[0],
    availableCapabilities: EffectiveCapabilityId[]
  ) {
    return sanitizeGeneratedWorkoutSession(session, availableCapabilities);
  }

  it('replaces an incompatible exercise with a compatible one from the same movement pattern', () => {
    const result = sanitizeWithCapabilities(
      {
        session_id: 'session-repair-1',
        session_type: 'generated_ephemeral',
        location: 'home',
        session_goal: 'hypertrophy',
        estimated_duration_minutes: 30,
        blocks: [
          {
            block_id: 'block-1',
            block_type: 'straight_sets',
            order_index: 0,
            exercise: {
              entry_id: 'entry-1',
              exercise_id: 'dumbbell_bench_press',
              prescription: {
                set_count: 4,
                target_reps: 10,
                intensity_method: 'load_kg',
              },
            },
            rest_seconds_after_exercise: 75,
          },
        ],
      },
      ['bodyweight', 'dumbbells']
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error('Expected sanitized session.');
    }

    expect(result.data.blocks[0]).toMatchObject({
      block_type: 'straight_sets',
      exercise: {
        exercise_id: 'dumbbell_floor_press',
        selection_reason: {
          reason_codes: ['fits_equipment'],
        },
      },
    });
    expect(result.repairs).toEqual([
      {
        type: 'exercise_replaced',
        block_id: 'block-1',
        entry_id: 'entry-1',
        original_exercise_id: 'dumbbell_bench_press',
        replacement_exercise_id: 'dumbbell_floor_press',
        missing_capabilities: ['bench'],
      },
    ]);
  });

  it('drops a block when no compatible replacement exists but keeps the rest of the session', () => {
    const result = sanitizeWithCapabilities(
      {
        session_id: 'session-repair-2',
        session_type: 'generated_ephemeral',
        location: 'home',
        session_goal: 'general_fitness',
        estimated_duration_minutes: 35,
        blocks: [
          {
            block_id: 'block-1',
            block_type: 'straight_sets',
            order_index: 0,
            exercise: {
              entry_id: 'entry-1',
              exercise_id: 'leg_press',
              prescription: {
                set_count: 3,
                target_reps: 12,
                intensity_method: 'load_kg',
              },
            },
            rest_seconds_after_exercise: 60,
          },
          {
            block_id: 'block-2',
            block_type: 'straight_sets',
            order_index: 1,
            exercise: {
              entry_id: 'entry-2',
              exercise_id: 'push_up',
              prescription: {
                set_count: 3,
                target_reps: 15,
                intensity_method: 'bodyweight',
              },
            },
            rest_seconds_after_exercise: 45,
          },
        ],
      },
      ['bodyweight', 'dumbbells']
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error('Expected sanitized session.');
    }

    expect(result.data.blocks).toHaveLength(1);
    expect(result.data.blocks[0]).toMatchObject({
      block_id: 'block-2',
    });
    expect(result.repairs).toContainEqual({
      type: 'block_removed',
      block_id: 'block-1',
      reason: 'no_compatible_replacement',
      affected_exercise_ids: ['leg_press'],
    });
  });

  it('rejects the session when no usable blocks remain after sanitization', () => {
    const result = sanitizeWithCapabilities(
      {
        session_id: 'session-repair-3',
        session_type: 'generated_ephemeral',
        location: 'home',
        session_goal: 'strength',
        estimated_duration_minutes: 20,
        blocks: [
          {
            block_id: 'block-1',
            block_type: 'straight_sets',
            order_index: 0,
            exercise: {
              entry_id: 'entry-1',
              exercise_id: 'leg_press',
              prescription: {
                set_count: 4,
                target_reps: 8,
                intensity_method: 'load_kg',
              },
            },
            rest_seconds_after_exercise: 90,
          },
        ],
      },
      ['bodyweight']
    );

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error('Expected rejected session.');
    }

    expect(result.errors).toContain('No usable blocks remain after sanitization.');
    expect(result.repairs).toContainEqual({
      type: 'block_removed',
      block_id: 'block-1',
      reason: 'no_compatible_replacement',
      affected_exercise_ids: ['leg_press'],
    });
  });

  it('repairs an incompatible exercise inside a superset without dropping the whole block', () => {
    const result = sanitizeWithCapabilities(
      {
        session_id: 'session-repair-4',
        session_type: 'generated_ephemeral',
        location: 'home',
        session_goal: 'hypertrophy',
        estimated_duration_minutes: 32,
        blocks: [
          {
            block_id: 'block-1',
            block_type: 'superset',
            order_index: 0,
            exercises: [
              {
                entry_id: 'entry-1',
                exercise_id: 'dumbbell_bench_press',
                prescription: {
                  set_count: 3,
                  target_reps: 10,
                  intensity_method: 'load_kg',
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
      },
      ['bodyweight', 'dumbbells', 'bands']
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error('Expected repaired superset session.');
    }

    expect(result.data.blocks[0]).toMatchObject({
      block_type: 'superset',
      exercises: [
        {
          exercise_id: 'dumbbell_floor_press',
        },
        {
          exercise_id: 'band_row',
        },
      ],
    });
    expect(result.repairs).toContainEqual({
      type: 'exercise_replaced',
      block_id: 'block-1',
      entry_id: 'entry-1',
      original_exercise_id: 'dumbbell_bench_press',
      replacement_exercise_id: 'dumbbell_floor_press',
      missing_capabilities: ['bench'],
    });
  });

  it('drops a composite block when one incompatible exercise has no valid replacement', () => {
    const result = sanitizeWithCapabilities(
      {
        session_id: 'session-repair-5',
        session_type: 'generated_ephemeral',
        location: 'home',
        session_goal: 'general_fitness',
        estimated_duration_minutes: 28,
        blocks: [
          {
            block_id: 'block-1',
            block_type: 'superset',
            order_index: 0,
            exercises: [
              {
                entry_id: 'entry-1',
                exercise_id: 'leg_press',
                prescription: {
                  set_count: 3,
                  target_reps: 12,
                  intensity_method: 'load_kg',
                },
              },
              {
                entry_id: 'entry-2',
                exercise_id: 'push_up',
                prescription: {
                  set_count: 3,
                  target_reps: 15,
                  intensity_method: 'bodyweight',
                },
              },
            ],
            rest_seconds_after_block: 75,
          },
          {
            block_id: 'block-2',
            block_type: 'emom',
            order_index: 1,
            exercises: [
              {
                entry_id: 'entry-3',
                exercise_id: 'push_up',
                prescription: {
                  target_reps: 12,
                  intensity_method: 'bodyweight',
                },
              },
            ],
            duration_seconds: 480,
            interval_seconds: 60,
          },
        ],
      },
      ['bodyweight']
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error('Expected sanitized session keeping only valid blocks.');
    }

    expect(result.data.blocks).toHaveLength(1);
    expect(result.data.blocks[0]).toMatchObject({
      block_id: 'block-2',
      block_type: 'emom',
    });
    expect(result.repairs).toContainEqual({
      type: 'block_removed',
      block_id: 'block-1',
      reason: 'no_compatible_replacement',
      affected_exercise_ids: ['leg_press', 'push_up'],
    });
  });

  it('replaces duplicate exercises inside a superset with a compatible alternative', () => {
    const result = sanitizeWithCapabilities(
      {
        session_id: 'session-repair-6',
        session_type: 'generated_ephemeral',
        location: 'home',
        session_goal: 'general_fitness',
        estimated_duration_minutes: 30,
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
                  target_reps: 10,
                  intensity_method: 'rir',
                  intensity_value: 2,
                },
              },
              {
                entry_id: 'entry-2',
                exercise_id: 'dumbbell_floor_press',
                prescription: {
                  set_count: 3,
                  target_reps: 10,
                  intensity_method: 'rir',
                  intensity_value: 2,
                },
              },
            ],
            rest_seconds_after_block: 75,
          },
        ],
      },
      ['bodyweight', 'dumbbells', 'bench']
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error('Expected sanitized session with duplicate repair.');
    }

    expect(result.data.blocks[0]).toMatchObject({
      block_type: 'superset',
      exercises: [
        {
          exercise_id: 'dumbbell_bench_press',
        },
        {
          exercise_id: 'push_up',
        },
      ],
    });
    expect(result.repairs).toContainEqual({
      type: 'exercise_replaced',
      block_id: 'block-1',
      entry_id: 'entry-1',
      original_exercise_id: 'dumbbell_floor_press',
      replacement_exercise_id: 'dumbbell_bench_press',
      missing_capabilities: [],
    });
    expect(result.repairs).toContainEqual({
      type: 'exercise_replaced',
      block_id: 'block-1',
      entry_id: 'entry-2',
      original_exercise_id: 'dumbbell_floor_press',
      replacement_exercise_id: 'push_up',
      missing_capabilities: [],
    });
  });
});
