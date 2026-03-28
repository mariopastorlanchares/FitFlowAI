import { onCallGenkit } from 'firebase-functions/https';
import { defineSecret } from 'firebase-functions/params';

import {
  WORKOUT_GENERATOR_MAX_INSTANCES,
  WORKOUT_GENERATOR_REGION,
} from './generator-config.js';
import { generateWorkoutSessionFlow } from './flows/generate-workout-session-flow.js';

const geminiApiKey = defineSecret('GEMINI_API_KEY');

export const generateWorkoutSession = onCallGenkit(
  {
    region: WORKOUT_GENERATOR_REGION,
    maxInstances: WORKOUT_GENERATOR_MAX_INSTANCES,
    timeoutSeconds: 60,
    secrets: [geminiApiKey],
  },
  generateWorkoutSessionFlow
);
