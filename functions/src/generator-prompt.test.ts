import assert from 'node:assert/strict';
import test from 'node:test';

import type { GenerateWorkoutSessionInput } from '../../src/shared/types/generator-contract.js';
import { WORKOUT_GENERATOR_MODEL } from './generator-config.js';
import { buildWorkoutGenerationPrompt } from './generator-prompt.js';
import { extractJsonObject } from './json.js';
import { coerceDraftToGeneratedWorkoutSession } from './model-output-schema.js';

const SAMPLE_INPUT: GenerateWorkoutSessionInput = {
  request_id: 'req-1',
  location: 'home',
  experience_level: 'intermediate',
  available_capabilities: ['bodyweight', 'dumbbells', 'bench'],
  preferred_block_types: ['straight_sets', 'superset'],
  duration_minutes: 40,
  session_goal: 'hypertrophy',
  equipment_profile: {
    home_equipment: {
      dumbbells: { isPair: true },
      bench: {},
    },
  },
};

test('uses flash-lite as the default budget model', () => {
  assert.equal(WORKOUT_GENERATOR_MODEL, 'gemini-2.5-flash-lite');
});

test('builds a prompt constrained by canonical ids and available capabilities', () => {
  const prompt = buildWorkoutGenerationPrompt(SAMPLE_INPUT);

  assert.match(prompt, /back_squat/);
  assert.match(prompt, /available_capabilities: bodyweight, dumbbells, bench/i);
  assert.match(prompt, /Return only a JSON object/i);
});

test('extractJsonObject tolerates fenced JSON responses', () => {
  const rawResponse = '```json\n{"session_id":"1","blocks":[]}\n```';

  assert.equal(extractJsonObject(rawResponse), '{"session_id":"1","blocks":[]}');
});

test('coerces a flat straight_sets draft into the shared workout contract', () => {
  const session = coerceDraftToGeneratedWorkoutSession({
    session_id: 'generated-1',
    session_type: 'generated_ephemeral',
    location: 'home',
    session_goal: 'general_fitness',
    estimated_duration_minutes: 40,
    blocks: [
      {
        block_id: 'block-1',
        block_type: 'straight_sets',
        order_index: 0,
        exercises: [
          {
            entry_id: 'entry-1',
            exercise_id: 'push_up',
            prescription: {
              set_count: 3,
              target_reps: 12,
              intensity_method: 'bodyweight',
            },
          },
        ],
      },
    ],
  });

  assert.equal(session.blocks[0]?.block_type, 'straight_sets');
  assert.equal(session.blocks[0]?.exercise.exercise_id, 'push_up');
});
