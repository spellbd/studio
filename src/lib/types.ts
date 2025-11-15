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

export type AnalysisResults = {
  spellingErrors: SpellingError[];
  formattingSuggestions: FormattingSuggestion[];
};
