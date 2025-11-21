'use server';

import { suggestCorrectionsWithGimeni } from '@/ai/flows/suggest-corrections-with-gimeni';
import { summarizeDocument } from '@/ai/flows/summarize-document';
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
      console.error('Gemini API call failed:', error);
      const errorMessage = error instanceof Error ? error.message : "একটি অজানা ত্রুটি ঘটেছে।";
      throw new Error(`সার্ভার থেকে পরামর্শ আনতে ব্যর্থ: ${errorMessage}`);
    }
  } else {
    // Offline mode
    return {
      overallFeedback: 'আপনি বর্তমানে অফলাইন মোডে আছেন। সংযোগ পেলে আরও উন্নত পরামর্শের জন্য অনলাইন মোড ব্যবহার করুন।',
      spellingErrors: mockSpellingErrors,
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
    return { success: true, message: 'ধন্যবাদ! আপনার মতামত সংরক্ষিত হয়েছে।' };
  } catch (error) {
    console.error('Failed to report correction:', error);
    return { success: false, message: 'মতামত সংরক্ষণ করতে ব্যর্থ হয়েছে।' };
  }
}
