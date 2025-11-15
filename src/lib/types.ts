export interface SpellingError {
  id: string;
  originalWord: string;
  context: string; // The sentence or phrase with the error
  suggestions: string[];
}

export interface FormattingSuggestion {
  id: string;
  title: string;
  description: string;
}

export interface StructuralSuggestion {
  id: string;
  title: string;
  description: string;
}

export interface ToneSuggestion {
    id: string;
    originalWord: string;
    context: string;
    suggestedWord: string;
    explanation: string;
}

export type AnalysisResults = {
  spellingErrors: SpellingError[];
  formattingSuggestions: FormattingSuggestion[];
  structuralSuggestions: StructuralSuggestion[];
  toneSuggestions: ToneSuggestion[];
};
