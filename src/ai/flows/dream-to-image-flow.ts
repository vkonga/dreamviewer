
'use server';
/**
 * @fileOverview An AI agent to generate images from dream text.
 *
 * - generateImageFromDream - A function that handles the dream to image generation process.
 * - GenerateImageFromDreamInput - The input type for the generateImageFromDream function.
 * - GenerateImageFromDreamOutput - The return type for the generateImageFromDream function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromDreamInputSchema = z.object({
  dreamText: z
    .string()
    .min(10, 'Dream text must be at least 10 characters long.')
    .describe('The text content of the dream to be visualized.'),
});
export type GenerateImageFromDreamInput = z.infer<typeof GenerateImageFromDreamInputSchema>;

const GenerateImageFromDreamOutputSchema = z.object({
  imageDataUri: z
    .string()
    .url()
    .describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateImageFromDreamOutput = z.infer<typeof GenerateImageFromDreamOutputSchema>;

export async function generateImageFromDream(input: GenerateImageFromDreamInput): Promise<GenerateImageFromDreamOutput> {
  return dreamToImageFlow(input);
}

const dreamToImageFlow = ai.defineFlow(
  {
    name: 'dreamToImageFlow',
    inputSchema: GenerateImageFromDreamInputSchema,
    outputSchema: GenerateImageFromDreamOutputSchema,
  },
  async (input) => {
    // Use the specific Gemini model for image generation
    const {media, text} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation', // IMPORTANT: Correct model for image generation
      prompt: `Generate an artistic, visually evocative image based on the following dream description: ${input.dreamText}. Capture the main themes and mood. This is for a dream journal app.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both
      },
    });

    if (!media || !media.url) {
      console.error('dreamToImageFlow: AI model did not return image media.', text);
      throw new Error('AI image generation failed. The model might not have been able to produce an image for the given dream text or experienced an issue.');
    }
    
    return { imageDataUri: media.url };
  }
);
