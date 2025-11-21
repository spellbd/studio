'use server';

/**
 * @fileOverview This file defines a Genkit flow to summarize a given text document in Bangla.
 *
 * - summarizeDocument - A function that takes text as input and returns a concise summary.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  textToSummarize: z
    .string()
    .describe('The text document to be summarized.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;


const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe("The generated summary of the document."),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;


export async function summarizeDocument(
  input: SummarizeDocumentInput
): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `You are an expert in text summarization. Your task is to analyze the provided Bangla text and generate a concise and comprehensive summary. The summary should capture the main points and key information of the document. Please provide the output in fluent Bangla.

Bangla Text:
{{{textToSummarize}}}
`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
