'use server';

import { suggestCorrectionsWithGimeni } from '@/ai/flows/suggest-corrections-with-gimeni';
import { improveOfflineNgramModel } from '@/ai/flows/improve-offline-ngram-model';
import {
  mockSpellingErrors,
  mockFormattingSuggestions,
  mockStructuralSuggestions,
} from '@/lib/placeholder-data';
import type { AnalysisResults } from '@/lib/types';


export async function getSuggestionsAction(
  text: string,
  isOnline: boolean,
  apiKey: string | null,
  dictionary: string[] = [], // Receive the dictionary
): Promise<AnalysisResults> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (isOnline) {
    if (!apiKey) {
      throw new Error("Gemini API কী প্রদান করা হয়নি। অনুগ্রহ করে সেটিংসে যোগ করুন।");
    }
    try {
      const results = await suggestCorrectionsWithGimeni({ banglaText: text, apiKey: apiKey });
      return results;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('invalid'))) {
        throw new Error('আপনার প্রদান করা Gemini API কী সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
      throw error; // Re-throw the original error for better debugging
    }
  } else {
    // Offline mode: Filter mock errors against the user's dictionary
    const filteredSpellingErrors = mockSpellingErrors.filter(
        (error) => !dictionary.includes(error.originalWord)
    );

    return {
      spellingErrors: filteredSpellingErrors,
      formattingSuggestions: mockFormattingSuggestions,
      structuralSuggestions: mockStructuralSuggestions,
      toneSuggestions: [], // Tone suggestions are online-only
    };
  }
}

export async function reportCorrectionAction(
  originalWord: string,
  correctedWord: string
): Promise<{ success: boolean; message: string }> {
  try {
    // In a real scenario, this would likely interact with the client-side DB
    // via a server component or a dedicated API route.
    // For this implementation, we assume the client-side DB is updated directly.
    await improveOfflineNgramModel({ originalWord, correctedWord });
    console.log(`Reported correction: ${originalWord} -> ${correctedWord}`);
    return { success: true, message: 'ধন্যবাদ! আপনার মতামত সংরক্ষিত হয়েছে।' };
  } catch (error) {
    console.error('Failed to report correction:', error);
    return { success: false, message: 'মতামত সংরক্ষণ করতে ব্যর্থ হয়েছে।' };
  }
}
