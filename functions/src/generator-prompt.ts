import { EXERCISE_CATALOG } from '../../src/shared/types/exercise-catalog.js';
import {
  INTENSITY_METHODS,
  GenerateWorkoutSessionInput,
  WORKOUT_BLOCK_TYPES,
} from '../../src/shared/types/generator-contract.js';

function formatExerciseCatalog() {
  return (
    Object.entries(EXERCISE_CATALOG) as Array<
      [keyof typeof EXERCISE_CATALOG, (typeof EXERCISE_CATALOG)[keyof typeof EXERCISE_CATALOG]]
    >
  )
    .map(
      ([exerciseId, definition]) =>
        `${exerciseId}|pattern=${definition.movementPattern}|required=${definition.requiredCapabilities.join('+')}`
    )
    .join('\n');
}

export function buildWorkoutGenerationPrompt(input: GenerateWorkoutSessionInput) {
  const supportedBlockTypes = input.preferred_block_types.filter((blockType) =>
    WORKOUT_BLOCK_TYPES.includes(blockType)
  );

  return [
    'Generate exactly one workout session as strict JSON.',
    'Return only a JSON object. Do not use Markdown, code fences, or commentary.',
    'Hard constraints:',
    `- session_type must be "generated_ephemeral".`,
    `- location must be "${input.location}".`,
    `- session_goal must be "${input.session_goal}".`,
    `- estimated_duration_minutes must stay close to ${input.duration_minutes}.`,
    `- Use only preferred block types: ${supportedBlockTypes.join(', ')}.`,
    `- Use only supported intensity_method values: ${INTENSITY_METHODS.join(', ')}.`,
    `- Use only these available_capabilities: ${input.available_capabilities.join(', ')}.`,
    '- Use only canonical exercise_id values from the exercise catalog below.',
    '- Never use an exercise if its required capabilities are not a subset of available_capabilities.',
    '- Keep coach_notes and summary short when present.',
    'Block rules:',
    '- Every block must use an exercises array, even straight_sets.',
    '- straight_sets: exercises must contain exactly one item.',
    '- superset: exercises must contain exactly two items and include rest_seconds_after_block.',
    '- triset: exercises must contain exactly three items and include rest_seconds_after_block.',
    '- circuit: exercises must contain one or more items and include rounds or duration_seconds.',
    '- emom: exercises must contain one or more items and include duration_seconds. interval_seconds is always 60.',
    'Output contract keys:',
    '- session_id, session_type, location, session_goal, estimated_duration_minutes, summary?, session_notes?, blocks.',
    '- Each block needs block_id, block_type, order_index, exercises.',
    '- Each exercise entry needs entry_id, exercise_id, prescription.',
    '- Prescription must always include intensity_method and may include set_count, target_reps, intensity_value, tempo.',
    `Request payload: ${JSON.stringify(input)}`,
    `Exercise catalog:\n${formatExerciseCatalog()}`,
  ].join('\n');
}
