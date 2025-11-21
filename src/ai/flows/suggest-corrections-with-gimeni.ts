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
    replacementText: z.string().optional().describe("স্বয়ংক্রিয়ভাবে ঠিক করার জন্য প্রতিস্থাপিত টেক্সট।"),
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
  overallFeedback: z.string().describe("লেখাটির উপর দুই-তিন লাইনের একটি সার্বিক মূল্যায়ন বা ফিডব্যাক।"),
  spellingErrors: z.array(SpellingErrorSchema).describe("বানান এবং ব্যাকরণগত ভুলের একটি তালিকা।"),
  formattingSuggestions: z.array(FormattingSuggestionSchema).describe("ফরম্যাটিং সংক্রান্ত পরামর্শের একটি তালিকা।"),
  structuralSuggestions: z.array(StructuralSuggestionSchema).describe("কাঠামোগত পরামর্শের একটি তালিকা।"),
  toneSuggestions: z.array(ToneSuggestionSchema).describe("ভাষারীতি ও শব্দচয়ন সংক্রান্ত পরামর্শের একটি তালিকা।"),
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
  prompt: `আপনি বাংলা ভাষার একজন বিশেষজ্ঞ, যিনি বানান পরীক্ষা, ব্যাকরণ, এবং নথি ফরম্যাটিংয়ে নিপুণ। আপনার কাজ হলো প্রদত্ত বাংলা পাঠ্য বিশ্লেষণ করা এবং উন্নতির জন্য ক্ষেত্রগুলি চিহ্নিত করা।

অনুগ্রহ করে পাঠ্যটি নিম্নলিখিত বিষয়গুলির জন্য পুঙ্খানুপুঙ্খভাবে বিশ্লেষণ করুন এবং আপনার বিশ্লেষণ একটি JSON অবজেক্টে ফেরত দিন:

১. **সার্বিক মূল্যায়ন (Overall Feedback)**: প্রথমে, পুরো লেখাটি পড়ার পর এর গঠন, স্পষ্টতা এবং মূল ভাবের উপর ভিত্তি করে দুই-তিন লাইনের একটি সার্বিক মূল্যায়ন বা ফিডব্যাক দিন। (JSON output key: "overallFeedback")

২. **বানান এবং ব্যাকরণগত ভুল (Spelling and Grammar)**: যেকোনো ভুল বানান বা ব্যাকরণগত ভুল চিহ্নিত করুন। প্রতিটি ভুলের জন্য, আপনাকে অবশ্যই মূল শব্দটি, যে প্রসঙ্গে এটি উপস্থিত হয়েছে, একটি স্বতন্ত্র আইডি এবং সঠিক পরামর্শগুলির একটি তালিকা সরবরাহ করতে হবে। (JSON output key: "spellingErrors")

৩. **ফরম্যাটিং ও বিরামচিহ্ন (Formatting and Punctuation)**: ফরম্যাটিংয়ে অসামঞ্জস্য সন্ধান করুন, যেমন স্পেসিং, অ্যালাইনমেন্ট বা যতিচিহ্নের ব্যবহারে সমস্যা। অনুপস্থিত দাঁড়ি (।), কমা (,), সেমিকোলন (;) ইত্যাদির মতো বিরামচিহ্ন যোগ করার পরামর্শ দিন। প্রতিটি পরামর্শের জন্য একটি শিরোনাম, একটি বর্ণনামূলক ব্যাখ্যা দিন। যদি সম্ভব হয়, তাহলে একটি স্বয়ংক্রিয় সমাধানের জন্য মূল টেক্সট (originalText) এবং প্রতিস্থাপিত টেক্সট (replacementText) সরবরাহ করুন। (JSON output key: "formattingSuggestions")

৪. **কাঠামোগত পরামর্শ এবং ভাষারীতি (Structure and Style)**:
   - **নথির ধরণ (Document Type)**: প্রথমে নথির ধরণ (जैसे: আবেদনপত্র, প্রতিবেদন, ইমেইল, প্রবন্ধ ইত্যাদি) সনাক্ত করুন।
   - **অনুপস্থিত অংশ (Missing Sections)**: সেই ধরণের নথির জন্য প্রয়োজনীয় কিন্তু অনুপস্থিত অংশগুলো (যেমন: বিষয়, তারিখ, স্বাক্ষর) যোগ করার জন্য পরামর্শ দিন।
   - **ভাষারীতি (Language Consistency)**: লেখাটিতে সাধু ও চলিত ভাষার মিশ্রণ ঘটেছে কিনা তা পরীক্ষা করুন। যদি মিশ্রণ পাওয়া যায়, তাহলে সামঞ্জস্যপূর্ণ ভাষারীতি (সাধারণত চলিত) ব্যবহারের জন্য পরামর্শ দিন।
   - **বাক্য গঠন (Sentence Structure)**: শিরোনাম, অনুচ্ছেদের দৈর্ঘ্য এবং বাক্যের স্পষ্টতা উন্নত করার জন্য পরামর্শ দিন। (JSON output key: "structuralSuggestions")

৫. **ভাষারীতি ও শব্দচয়ন (Tone and Diction)**: লেখার ভাব বা টোন পরীক্ষা করুন এবং বিকল্প শব্দ பரிந்து করুন যা প্রসঙ্গের সাথে আরও ভালভাবে খাপ খায় বা সামগ্রিক ভাবকে উন্নত করে (যেমন, এটিকে আরও আনুষ্ঠানিক, বিশ্বাসযোগ্য বা স্পষ্ট করে তোলে)। প্রতিটি পরামর্শের জন্য, মূল শব্দটি, এর প্রসঙ্গ, প্রস্তাবিত প্রতিস্থাপন এবং পরিবর্তনের জন্য একটি সংক্ষিপ্ত ব্যাখ্যা সরবরাহ করুন। (JSON output key: "toneSuggestions")

আপনার বিশ্লেষণটি একটি JSON অবজেক্টে পাঁচটি কী ('overallFeedback', 'spellingErrors', 'formattingSuggestions', 'structuralSuggestions', এবং 'toneSuggestions') দিয়ে ফেরত দিন। যদি আপনি কোনো বিশেষ ধরণের কোনো সমস্যা খুঁজে না পান, তবে সেই কী-এর জন্য একটি খালি অ্যারে ([], for lists) বা খালি স্ট্রিং ("" for feedback) ফেরত দিন।

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
    const {output} = await prompt(input);
    return output!;
  }
);
