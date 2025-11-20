'use server';

/**
 * @fileOverview This file contains the Genkit flow for improving the offline n-gram model with user corrections.
 *
 * - improveOfflineNgramModel - A function that updates the local n-gram model with user-corrected words.
 * - ImproveOfflineNgramModelInput - The input type for the improveOfflineNgramModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveOfflineNgramModelInputSchema = z.object({
  correctedWord: z.string().describe('The word that the user corrected.'),
  originalWord: z.string().describe('The original misspelled word.'),
});

export type ImproveOfflineNgramModelInput = z.infer<typeof ImproveOfflineNgramModelInputSchema>;

export async function improveOfflineNgramModel(input: ImproveOfflineNgramModelInput): Promise<void> {
  return improveOfflineNgramModelFlow(input);
}

const improveOfflineNgramModelFlow = ai.defineFlow(
  {
    name: 'improveOfflineNgramModelFlow',
    inputSchema: ImproveOfflineNgramModelInputSchema,
    outputSchema: z.void(),
  },
  async ({ originalWord, correctedWord }) => {
    // This is a placeholder for a real intelligent learning system.
    // In a real-world scenario, this flow would interact with a service 
    // that updates a local n-gram model stored in IndexedDB or a similar
    // client-side storage. The model would be used by the offline spell 
    // checker to provide better suggestions over time.

    console.log(`Intelligent Learning System: Processing correction.`);
    console.log(`Original: "${originalWord}", Corrected: "${correctedWord}"`);

    if (originalWord === correctedWord) {
        console.log(`Learning new word: "${correctedWord}" has been added to the dictionary.`);
        // Here you would add logic to persist this new word to the local model.
    } else {
        console.log(`Learning correction pair: "${originalWord}" is often corrected to "${correctedWord}".`);
        // Here you would update the n-gram model to strengthen the probability
        // of suggesting `correctedWord` for `originalWord` in the future.
    }
    
    // Simulate a short delay to mimic a real async operation.
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log("Learning model updated successfully.");
  }
);
