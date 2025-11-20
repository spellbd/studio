import type { SpellingError, FormattingSuggestion, StructuralSuggestion } from '@/lib/types';

export const mockDocumentText =
  "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রানে বাজায় বাঁশি। ও মা, ফাগুনে তোর আমের বনে ঘ্রাণে পাগল করে, মরি হায়, হায় রে— ও মা, অঘ্রানে তোর ভরা ক্ষেতে আমি কী দেখেছি মধুর হাসি।। কী শোভا, কী ছায়া গো, কী স্নেহ, কী মায়া গো— কী আঁচল বিছায়েছ বটের মূলে, নদীর কূলে কূলে। মা, তোর মুখের বাণী আমার কানে লাগে সুধার মতো, মরি হায়, হায় রে— মা, তোর বদনখানি মলিন হলে, ও মা, আমি নয়ন জলে ভাসি।।";

export const mockSpellingErrors: SpellingError[] = [
  {
    id: 'err-1',
    originalWord: 'চাকুরিজিবি',
    context: '...আমার বাবা একজন সরকারি চাকুরিজিবি।',
    suggestions: ['চাকরিজীবী'],
  },
  {
    id: 'err-2',
    originalWord: 'সম্বব',
    context: '...পড়াশুনা চালিয়ে যাওয়া সম্বব নয়।',
    suggestions: ['সম্ভব'],
  },
  {
    id: 'err-3',
    originalWord: 'ছারপত্র',
    context: '...আমাকে ছারপত্র দিয়ে বাধিত করবেন।',
    suggestions: ['ছাড়পত্র'],
  },
];

export const mockFormattingSuggestions: FormattingSuggestion[] = [
    {
      id: 'fmt-1',
      title: 'ডাবল স্পেস',
      description: 'অনুচ্ছেদের শেষে দুটি স্পেস ব্যবহার করা হয়েছে। একটি স্পেস ব্যবহার করা উচিত।',
      originalText: 'নয়।\n\nঅতএব',
      replacementText: 'নয়।\nঅতএব',
    },
];

export const mockStructuralSuggestions: StructuralSuggestion[] = [
    {
      id: 'struct-1',
      title: 'অপ্রচলিত শব্দ',
      description: '"চাকুরিজিবি" শব্দটি এখন আর তেমন ব্যবহৃত হয় না। এর পরিবর্তে "চাকরিজীবী" ব্যবহার করা যেতে পারে।',
      originalText: 'চাকুরিজিবি',
      replacementText: 'চাকরিজীবী',
    },
];

export const mockOfflineSpellingErrors: SpellingError[] = [
];

export const mockOfflineFormattingSuggestions: FormattingSuggestion[] = [
    {
      id: 'off-fmt-1',
      title: 'অফলাইন ফরম্যাটিং সাজেশন',
      description: 'এটি অফলাইন ইঞ্জিন থেকে একটি নমুনা ফরম্যাটিং সাজেশন।',
    }
];

export const mockOfflineStructuralSuggestions: StructuralSuggestion[] = [
    {
      id: 'off-struct-1',
      title: 'অফলাইন স্ট্রাকচারাল সাজেশন',
      description: 'এটি অফলাইন ইঞ্জিন থেকে একটি নমুনা স্ট্রাকচারাল সাজেশন।',
    }
];
