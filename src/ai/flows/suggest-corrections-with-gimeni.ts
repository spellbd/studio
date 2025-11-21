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
    originalText: z.string().optional().describe("স্বয়ংক্রিয়ভাবে ঠিক করার জন্য মূল টেক্সট। যদি খালি থাকে, তাহলে কোনো স্বয়ংক্রিয় পদক্ষেপ সম্ভব নয়।"),
    replacementText: z.string().optional().describe("স্বয়ংক্রিয়ভাবে ঠিক করার জন্য प्रतिস্থাপিত টেক্সট।"),
});

const StructuralSuggestionSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    originalText: z.string().optional().describe("স্বয়ংক্রিয়ভাবে ঠিক করার জন্য মূল টেক্সট। যদি খালি থাকে, তাহলে কোনো স্বয়ংক্রিয় পদক্ষেপ সম্ভব নয়।"),
    replacementText: z.string().optional().describe("স্বয়ংক্রিয়ভাবে ঠিক করার জন্য প্রতিস্থাপিত টেক্সট।"),
});

const ToneSuggestionSchema = z.object({
    id: z.string(),
    originalWord: z.string(),
    context: z.string(),
    suggestedWord: z.string(),
    explanation: z.string().describe("Explanation for why the word is suggested (e.g., 'more formal', 'more confident')."),
});

const SuggestCorrectionsWithGimeniOutputSchema = z.object({
  spellingErrors: z.array(SpellingErrorSchema).describe("বানান এবং ব্যাকরণগত ভুলের একটি তালিকা।"),
  formattingSuggestions: z.array(FormattingSuggestionSchema).describe("ফরম্যাটিং সংক্রান্ত পরামর্শের একটি তালিকা।"),
  structuralSuggestions: z.array(StructuralSuggestionSchema).describe("কাঠামোগত পরামর্শের একটি তালিকা।"),
  toneSuggestions: z.array(ToneSuggestionSchema).describe("لحن এবং শব্দচয়ন সংক্রান্ত পরামর্শের একটি তালিকা।"),
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
  prompt: `আপনি বাংলা ভাষার একজন বিশেষজ্ঞ, যিনি বানান পরীক্ষা, ব্যাকরণ, এবং নথি форматиংয়ে निपुण। আপনার কাজ হলো প্রদত্ত বাংলা পাঠ্য বিশ্লেষণ করা এবং উন্নতির জন্য ক্ষেত্রগুলি চিহ্নিত করা।

অনুগ্রহ করে পাঠ্যটি নিম্নলিখিত বিষয়গুলির জন্য পুঙ্খানুপুঙ্খভাবে বিশ্লেষণ করুন:

১. **বানান এবং ব্যাকরণগত ভুল**: যেকোনো ভুল বানান বা ব্যাকরণগত غلطی চিহ্নিত করুন। প্রতিটি ভুলের জন্য, আপনাকে অবশ্যই মূল শব্দটি, যে প্রসঙ্গে এটি উপস্থিত হয়েছে, একটি স্বতন্ত্র আইডি এবং সঠিক পরামর্শগুলির একটি তালিকা সরবরাহ করতে হবে।

২. **ফরম্যাটিং ও বিরামচিহ্ন**: ফরম্যাটিংয়ে असंगति সন্ধান করুন, যেমন স্পেসিং, অ্যালাইনমেন্ট বা যতিচিহ্নের ব্যবহারে সমস্যা। অনুপস্থিত দাঁড়ি (।), কমা (,), সেমিকোলন (;) ইত্যাদির মতো বিরামচিহ্ন যোগ করার পরামর্শ দিন। প্রতিটি পরামর্শের জন্য একটি শিরোনাম, একটি বর্ণনামূলক ব্যাখ্যা দিন। যদি সম্ভব হয়, তাহলে একটি স্বয়ংক্রিয় সমাধানের জন্য মূল টেক্সট (originalText) এবং প্রতিস্থাপিত টেক্সট (replacementText) সরবরাহ করুন।

৩. **কাঠামোগত পরামর্শ এবং ভাষারীতি**:
   - **নথির ধরণ**: প্রথমে নথির ধরণ (যেমন: আবেদনপত্র, প্রতিবেদন, ইত্যাদি) সনাক্ত করুন।
   - **অনুপস্থিত অংশ**: সেই ধরণের নথির জন্য প্রয়োজনীয় কিন্তু অনুপস্থিত অংশগুলো (যেমন: বিষয়, তারিখ, স্বাক্ষর) যোগ করার জন্য পরামর্শ দিন।
   - **ভাষারীতি**: লেখাটিতে সাধু ও চলিত ভাষার মিশ্রণ ঘটেছে কিনা তা পরীক্ষা করুন। যদি মিশ্রণ পাওয়া যায়, তাহলে সামঞ্জস্যপূর্ণ ভাষারীতি (সাধারণত চলিত) ব্যবহারের জন্য পরামর্শ দিন।
   - **বাক্য গঠন**: শিরোনাম, অনুচ্ছেদের দৈর্ঘ্য এবং বাক্যের स्पष्टता উন্নত করার জন্য পরামর্শ দিন।

৪. **لحن এবং শব্দচয়ন**: লেখার لحن পরীক্ষা করুন এবং বিকল্প শব্দ பரிந்து করুন যা প্রসঙ্গের সাথে আরও ভালভাবে খাপ খায় বা समग्र لحنকে উন্নত করে (যেমন, এটিকে আরও औपचारिक, आत्मविश्वासী বা स्पष्ट করে তোলে)। প্রতিটি পরামর্শের জন্য, মূল শব্দটি, এর প্রসঙ্গ, প্রস্তাবিত প্রতিस्थापन এবং পরিবর্তনের জন্য একটি সংক্ষিপ্ত ব্যাখ্যা সরবরাহ করুন।

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
