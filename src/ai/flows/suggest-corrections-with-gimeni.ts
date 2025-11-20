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
  prompt: `আপনি বাংলা ভাষার একজন विशेषज्ञ, যিনি বানান পরীক্ষা, व्याकरण এবং নথি форматиংয়ে निपुण। আপনার কাজ হলো প্রদত্ত বাংলা পাঠ্য বিশ্লেষণ করা এবং উন্নতির জন্য ক্ষেত্রগুলি চিহ্নিত করা।

অনুগ্রহ করে পাঠ্যটি নিম্নলিখিত চারটি ধরণের সমস্যার জন্য বিশ্লেষণ করুন:

১. **বানান এবং ব্যাকরণগত ভুল**: যেকোনো ভুল বানান বা ব্যাকরণগত غلطی চিহ্নিত করুন। প্রতিটি ভুলের জন্য, আপনাকে অবশ্যই মূল শব্দটি, যে প্রসঙ্গে এটি উপস্থিত হয়েছে, একটি স্বতন্ত্র আইডি এবং সঠিক পরামর্শগুলির একটি তালিকা সরবরাহ করতে হবে।

২. **ফরম্যাটিং संबंधी পরামর্শ**: ফরম্যাটিংয়ে असंगति সন্ধান করুন, যেমন ஸ்பேসিং, অ্যালাইনমেন্ট বা যতিচিহ্নের ব্যবহারে সমস্যা। প্রতিটি পরামর্শের জন্য একটি শিরোনাম এবং একটি वर्णনামূলক ব্যাখ্যা দিন।

৩. **কাঠামোগত পরামর্শ**: নথির समग्र কাঠামো বিশ্লেষণ করুন। শিরোনাম, অনুচ্ছেদের দৈর্ঘ্য, বাক্যের स्पष्टता এবং পাঠযোগ্যতায় সমস্যা সন্ধান করুন। প্রতিটি পরামর্শের জন্য একটি শিরোনাম এবং विवरण সরবরাহ করুন।

۴. **لحن এবং শব্দচयन**: লেখার لحن পরীক্ষা করুন এবং বিকল্প শব্দ பரிந்து করুন যা প্রসঙ্গের সাথে আরও ভালভাবে খাপ খায় বা समग्र لحنকে উন্নত করে (যেমন, এটিকে আরও औपचारिक, आत्मविश्वासী বা स्पष्ट করে তোলে)। প্রতিটি পরামর্শের জন্য, মূল শব্দটি, এর প্রসঙ্গ, প্রস্তাবিত प्रतिस्थापन এবং পরিবর্তনের জন্য একটি সংক্ষিপ্ত ব্যাখ্যা সরবরাহ করুন।

আপনার বিশ্লেষণটি একটি JSON অবজেক্টে চারটি কী দিয়ে ফেরত দিন: 'spellingErrors', 'formattingSuggestions', 'structuralSuggestions', এবং 'toneSuggestions'। প্রতিটি কী-তে আপনার পাওয়া সমস্যাগুলির সাথে সম্পর্কিত অবজেক্টগুলির একটি অ্যারে থাকা উচিত। যদি আপনি কোনো विशेष ধরণের কোনো সমস্যা খুঁজে না পান, তবে সেই কী-এর জন্য একটি খালি অ্যারে ফেরত দিন।

বাংলা পাঠ্য:
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
