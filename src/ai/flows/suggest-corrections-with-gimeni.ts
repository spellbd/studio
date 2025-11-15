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
  prompt: `You are a Bangla language and document formatting expert. Analyze the following text and provide suggestions to improve it.

Analyze the provided Bangla text for four types of issues:
1.  **Spelling and Grammar Errors**: Identify any misspelled words or grammatical mistakes. For each error, provide the original word, the context in which it appears, a unique ID, and a list of correct suggestions.
2.  **Formatting Suggestions**: Analyze the text for formatting inconsistencies like spacing, alignment, or use of punctuation. Provide a title and a description for each suggestion.
3.  **Structural Suggestions**: Analyze the document structure. Look for issues with headings, paragraph length, sentence clarity, and overall readability. Provide a title and a description for each suggestion.
4.  **Tone and Word Choice**: Analyze the writing tone. Suggest alternative words that would better fit the context or improve the tone (e.g., making it more formal, confident, or clear). For each suggestion, provide the original word, the context, the suggested word, and a brief explanation of why the change is recommended.

Return the response as a JSON object with four keys: 'spellingErrors', 'formattingSuggestions', 'structuralSuggestions', and 'toneSuggestions'. Each key should contain an array of objects corresponding to the issues found. If no issues of a certain type are found, return an empty array for that key.

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
