'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest spelling, grammar, structural, and formatting corrections for Bangla text using the Gemini API.
 *
 * - suggestCorrectionsWithGimeni - A function that takes Bangla text as input and returns correction suggestions.
 * - SuggestCorrectionsWithGimeniInput - The input type for the suggestCorrectionsWithGimeni function.
 * - SuggestCorrectionsWithGimeniOutput - The return type for the suggestCorrectionsWithGimeni function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCorrectionsWithGimeniInputSchema = z.object({
  banglaText: z
    .string()
    .describe('The Bangla text to provide corrections for.'),
  apiKey: z.string().optional().describe('Optional Gemini API key.'),
});
export type SuggestCorrectionsWithGimeniInput = z.infer<typeof SuggestCorrectionsWithGimeniInputSchema>;

const SpellingErrorSchema = z.object({
    id: z.string(),
    originalWord: z.string(),
    context: z.string(),
    suggestions: z.array(z.string()),
});

const FormattingSuggestionSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
});

const StructuralSuggestionSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
});

const ToneSuggestionSchema = z.object({
    id: z.string(),
    originalWord: z.string(),
    context: z.string(),
    suggestedWord: z.string(),
    explanation: z.string().describe("Explanation for why the word is suggested (e.g., 'more formal', 'more confident')."),
});

const SuggestCorrectionsWithGimeniOutputSchema = z.object({
  spellingErrors: z.array(SpellingErrorSchema).describe("An array of spelling and grammar errors."),
  formattingSuggestions: z.array(FormattingSuggestionSchema).describe("An array of formatting suggestions."),
  structuralSuggestions: z.array(StructuralSuggestionSchema).describe("An array of structural suggestions."),
  toneSuggestions: z.array(ToneSuggestionSchema).describe("An array of tone and word choice suggestions."),
});
export type SuggestCorrectionsWithGimeniOutput = z.infer<typeof SuggestCorrectionsWithGimeniOutputSchema>;

export async function suggestCorrectionsWithGimeni(
  input: SuggestCorrectionsWithGimeniInput
): Promise<SuggestCorrectionsWithGimeniOutput> {
  return suggestCorrectionsWithGimeniFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCorrectionsWithGimeniPrompt',
  input: {schema: SuggestCorrectionsWithGimeniInputSchema},
  output: {schema: SuggestCorrectionsWithGimeniOutputSchema},
  prompt: `You are an expert in the Bangla language, specializing in spell checking, grammar, and document formatting. Your task is to analyze the provided Bangla text and identify areas for improvement.

Please analyze the text for the following four types of issues:

1.  **Spelling and Grammar Errors**: Identify any misspelled words or grammatical mistakes. For each error, you must provide the original word, the context in which it appears, a unique ID, and a list of correct suggestions.

2.  **Formatting Suggestions**: Look for inconsistencies in formatting, such as issues with spacing, alignment, or the use of punctuation. For each suggestion, provide a title and a descriptive explanation.

3.  **Structural Suggestions**: Analyze the overall structure of the document. Look for problems with headings, paragraph length, sentence clarity, and readability. Provide a title and a description for each suggestion.

4.  **Tone and Word Choice**: Examine the writing tone and suggest alternative words that would better fit the context or improve the overall tone (e.g., making it more formal, confident, or clear). For each suggestion, provide the original word, its context, the suggested replacement, and a brief explanation for the change.

Return your analysis in a JSON object with four keys: 'spellingErrors', 'formattingSuggestions', 'structuralSuggestions', and 'toneSuggestions'. Each key should contain an array of objects corresponding to the issues you found. If you find no issues of a particular type, return an empty array for that key.

Bangla Text:
{{{banglaText}}}
`,
});

const suggestCorrectionsWithGimeniFlow = ai.defineFlow(
  {
    name: 'suggestCorrectionsWithGimeniFlow',
    inputSchema: SuggestCorrectionsWithGimeniInputSchema,
    outputSchema: SuggestCorrectionsWithGimeniOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input, {
        ...(input.apiKey && {config: {apiKey: input.apiKey}}),
    });
    return output!;
  }
);
