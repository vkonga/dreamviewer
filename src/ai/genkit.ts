
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Explicitly check for the API key at initialization time.
const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey || googleApiKey.trim() === '') {
  // This error will be thrown when the module is loaded if the API key is missing.
  // This will crash the server on startup, but the log will be very clear.
  console.error(
    'CRITICAL ERROR: GOOGLE_API_KEY environment variable is not set. ' +
    'The AI features of this application cannot be initialized. ' +
    'Please set this variable in your hosting environment (e.g., Google Cloud Secret Manager).'
  );
  // We throw an error to halt startup, which is desired for missing critical config.
  // This makes it obvious in logs that a configuration step was missed.
  throw new Error('CRITICAL ERROR: GOOGLE_API_KEY environment variable is not set.');
}


export const ai = genkit({
  plugins: [
    // Pass the key explicitly to the plugin to ensure it's configured correctly.
    googleAI({apiKey: googleApiKey})
  ],
  model: 'googleai/gemini-2.0-flash',
});
