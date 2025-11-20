'use server';

import { suggestCorrectionsWithGimeni } from '@/ai/flows/suggest-corrections-with-gimeni';
import { improveOfflineNgramModel } from '@/ai/flows/improve-offline-ngram-model';
import {
  mockFormattingSuggestions,
  mockStructuralSuggestions,
} from '@/lib/placeholder-data';
import type { AnalysisResults } from '@/lib/types';


export async function getSuggestionsAction(
  text: string,
  isOnline: boolean,
  apiKey: string | null,
): Promise<AnalysisResults> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (isOnline) {
    if (!apiKey) {
      throw new Error("Gemini API কী প্রদান করা হয়নি।");
    }
    try {
      const results = await suggestCorrectionsWithGimeni({ banglaText: text, apiKey });
      return results;

    } catch (error) {
      console.error('Gemini API call failed, falling back to offline mode.', error);
      // Fallback to offline mode on API error
      return {
        spellingErrors: [],
        formattingSuggestions: mockFormattingSuggestions,
        structuralSuggestions: mockStructuralSuggestions,
        toneSuggestions: [],
      };
    }
  } else {
    // Offline mode
    return {
      spellingErrors: [],
      formattingSuggestions: mockFormattingSuggestions,
      structuralSuggestions: mockStructuralSuggestions,
      toneSuggestions: [],
    };
  }
}

export async function reportCorrectionAction(
  originalWord: string,
  correctedWord: string
): Promise<{ success: boolean; message: string }> {
  try {
    await improveOfflineNgramModel({ originalWord, correctedWord });
    console.log(`Reported correction: ${originalWord} -> ${correctedWord}`);
    return { success: true, message: 'ধন্যবাদ! লার্নিং মডেলটি আপডেট করা হয়েছে।' };
  } catch (error) {
    console.error('Failed to report correction:', error);
    return { success: false, message: 'লার্নিং মডেল আপডেট করতে ব্যর্থ হয়েছে।' };
  }
}
