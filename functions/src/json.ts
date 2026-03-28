import { validateGeneratedWorkoutSession } from '../../src/shared/lib/generator-contract.js';
import type { GeneratedWorkoutSession } from '../../src/shared/types/generator-contract.js';

export function extractJsonObject(rawText: string) {
  const withoutCodeFence = rawText
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const firstBraceIndex = withoutCodeFence.indexOf('{');
  const lastBraceIndex = withoutCodeFence.lastIndexOf('}');

  if (firstBraceIndex === -1 || lastBraceIndex === -1 || lastBraceIndex < firstBraceIndex) {
    throw new Error('Model response does not contain a JSON object.');
  }

  return withoutCodeFence.slice(firstBraceIndex, lastBraceIndex + 1);
}

export function parseGeneratedWorkoutSessionResponse(rawText: string): GeneratedWorkoutSession {
  const parsedJson = JSON.parse(extractJsonObject(rawText)) as unknown;
  const validation = validateGeneratedWorkoutSession(parsedJson);

  if (!validation.success) {
    throw new Error(`Generated session failed validation: ${validation.errors.join(' ')}`);
  }

  return validation.data;
}
