// 'use server'

/**
 * @fileOverview Dream interpretation AI agent.
 *
 * - interpretDream - A function that handles the dream interpretation process.
 * - InterpretDreamInput - The input type for the interpretDream function.
 * - InterpretDreamOutput - The return type for the interpretDream function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretDreamInputSchema = z.object({
  dreamText: z
    .string()
    .describe('The text content of the dream journal entry to be interpreted.'),
});
export type InterpretDreamInput = z.infer<typeof InterpretDreamInputSchema>;

const InterpretDreamOutputSchema = z.object({
  overallMeaning: z
    .string()
    .describe('A summary of the potential meaning of the dream.'),
  symbols: z.array(
    z.object({
      symbol: z.string().describe('A key symbol identified in the dream.'),
      meaning: z.string().describe('The traditional or potential meaning of the symbol.'),
    })
  ).describe('A list of key symbols identified in the dream and their meanings.'),
  emotionalTone: z
    .string()
    .describe('The dominant emotions detected in the dream text.'),
});
export type InterpretDreamOutput = z.infer<typeof InterpretDreamOutputSchema>;

export async function interpretDream(input: InterpretDreamInput): Promise<InterpretDreamOutput> {
  return interpretDreamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretDreamPrompt',
  input: {schema: InterpretDreamInputSchema},
  output: {schema: InterpretDreamOutputSchema},
  prompt: `You are a dream interpreter. Analyze the following dream for its symbols, emotional tone, and potential meaning. Break down the analysis into overall meaning, key symbols and their meanings, and the emotional tone.

Dream: {{{dreamText}}}`,
});

const interpretDreamFlow = ai.defineFlow(
  {
    name: 'interpretDreamFlow',
    inputSchema: InterpretDreamInputSchema,
    outputSchema: InterpretDreamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      console.error('interpretDreamFlow: AI prompt did not return a valid output.');
      throw new Error('AI analysis failed to produce a result. The model might not have been able to interpret the dream in the expected format.');
    }
    return output;
  }
);
