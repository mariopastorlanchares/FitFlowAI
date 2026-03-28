import { googleAI } from '@genkit-ai/google-genai';
import { genkit } from 'genkit';

import { WORKOUT_GENERATOR_MODEL } from './generator-config.js';

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model(WORKOUT_GENERATOR_MODEL),
});
