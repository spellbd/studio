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
  async input => {
    // Here, we would call the service that updates the n-gram model.
    // In this example, we're just logging the input.
    console.log(`Updating n-gram model with correction: ${input.originalWord} -> ${input.correctedWord}`);
    // TODO: Integrate with the actual offline learning system (IndexedDB and n-gram model).
    // This would likely involve:
    // 1. Fetching the current n-gram model from IndexedDB.
    // 2. Updating the model with the new word pair.
    // 3. Storing the updated model back into IndexedDB.
  }
);
