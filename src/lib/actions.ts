'use server';

import { suggestCorrectionsWithGimeni } from '@/ai/flows/suggest-corrections-with-gimeni';
import { improveOfflineNgramModel } from '@/ai/flows/improve-offline-ngram-model';
import {
  mockSpellingErrors,
  mockFormattingSuggestions,
  mockOfflineSpellingErrors,
  mockOfflineFormattingSuggestions,
} from '@/lib/placeholder-data';
import type { AnalysisResults } from '@/lib/types';

// A mock function to parse the ambiguous Gemini output.
// In a real scenario, the prompt and output schema would be refined for structured JSON output.
function parseGeminiResponse(rawText: string, suggestions: string[]): AnalysisResults['spellingErrors'] {
    // This is a highly simplified and brittle parser based on assumptions.
    // It's a placeholder for what should be a better AI output structure.
    // For this demo, we'll just return the mock data if suggestions are found.
    if (suggestions.length > 0) {
        return mockSpellingErrors;
    }
    return [];
}


export async function getSuggestionsAction(
  text: string,
  isOnline: boolean
): Promise<AnalysisResults> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (isOnline) {
    try {
      // The current AI flow is not ideal for our UI.
      // It returns `correctedText` and `suggestions: string[]`.
      // We will call it, but for a better UI experience, we'll use our mock data structure.
      // A real implementation would require the AI flow to return a structured list of errors.
      const result = await suggestCorrectionsWithGimeni({ banglaText: text });
      
      const spellingErrors = parseGeminiResponse(result.correctedText, result.suggestions);
      
      // Formatting suggestions would likely come from a different model or complex logic.
      // For now, we return mock data for it.
      return {
        spellingErrors: spellingErrors.length > 0 ? spellingErrors : [],
        formattingSuggestions: mockFormattingSuggestions,
      };

    } catch (error) {
      console.error('Gemini API call failed, falling back to offline mode.', error);
      // Fallback to offline mode on API error
      return {
        spellingErrors: mockOfflineSpellingErrors,
        formattingSuggestions: mockOfflineFormattingSuggestions,
      };
    }
  } else {
    // Offline mode
    return {
      spellingErrors: mockOfflineSpellingErrors,
      formattingSuggestions: mockOfflineFormattingSuggestions,
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
    return { success: true, message: 'Thank you! The learning model has been updated.' };
  } catch (error) {
    console.error('Failed to report correction:', error);
    return { success: false, message: 'Failed to update the learning model.' };
  }
}
