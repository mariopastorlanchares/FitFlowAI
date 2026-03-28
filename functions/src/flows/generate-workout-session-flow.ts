import { logger } from 'firebase-functions';
import { z } from 'genkit';

import {
  sanitizeGeneratedWorkoutSession,
  validateGenerateWorkoutSessionInput,
} from '../../../src/shared/lib/generator-contract.js';
import type { GeneratedWorkoutSession } from '../../../src/shared/types/generator-contract.js';
import { ai } from '../genkit.js';
import {
  WORKOUT_GENERATOR_MAX_OUTPUT_TOKENS,
  WORKOUT_GENERATOR_MODEL,
  WORKOUT_GENERATOR_TEMPERATURE,
} from '../generator-config.js';
import { buildWorkoutGenerationPrompt } from '../generator-prompt.js';
import {
  coerceDraftToGeneratedWorkoutSession,
  GeneratedWorkoutSessionDraftSchema,
} from '../model-output-schema.js';

export const generateWorkoutSessionFlow = ai.defineFlow(
  {
    name: 'generateWorkoutSession',
    inputSchema: z.unknown(),
    outputSchema: z.unknown(),
  },
  async (rawInput): Promise<GeneratedWorkoutSession> => {
    const inputValidation = validateGenerateWorkoutSessionInput(rawInput);

    if (!inputValidation.success) {
      throw new Error(`Invalid generator input: ${inputValidation.errors.join(' ')}`);
    }

    const input = inputValidation.data;
    const prompt = buildWorkoutGenerationPrompt(input);
    const response = await ai.generate({
      model: `googleai/${WORKOUT_GENERATOR_MODEL}`,
      prompt,
      output: {
        schema: GeneratedWorkoutSessionDraftSchema,
      },
      config: {
        temperature: WORKOUT_GENERATOR_TEMPERATURE,
        maxOutputTokens: WORKOUT_GENERATOR_MAX_OUTPUT_TOKENS,
      },
    });

    if (!response.output) {
      throw new Error('Model returned no structured output.');
    }

    const generatedSession = coerceDraftToGeneratedWorkoutSession(response.output);
    const sanitization = sanitizeGeneratedWorkoutSession(
      generatedSession,
      input.available_capabilities
    );

    if (!sanitization.success) {
      throw new Error(`Generated session rejected: ${sanitization.errors.join(' ')}`);
    }

    logger.info('Generated workout session', {
      requestId: input.request_id,
      model: WORKOUT_GENERATOR_MODEL,
      blockCount: sanitization.data.blocks.length,
      repairCount: sanitization.repairs.length,
    });

    return sanitization.data;
  }
);
