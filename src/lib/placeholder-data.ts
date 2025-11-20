import type { SpellingError, FormattingSuggestion, StructuralSuggestion } from '@/lib/types';

export const mockDocumentText =
  "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রানে বাজায় বাঁশি। ও মা, ফাগুনে তোর আমের বনে ঘ্রাণে পাগল করে, মরি হায়, হায় রে— ও মা, অঘ্রানে তোর ভরা ক্ষেতে আমি কী দেখেছি মধুর হাসি।। কী শোভা, কী ছায়া গো, কী স্নেহ, কী মায়া গো— কী আঁচল বিছায়েছ বটের মূলে, নদীর কূলে কূলে। মা, তোর মুখের বাণী আমার কানে লাগে সুধার মতো, মরি হায়, হায় রে— মা, তোর বদনখানি মলিন হলে, ও মা, আমি নয়ন জলে ভাসি।।";

export const mockSpellingErrors: SpellingError[] = [
  {
    id: 'err-1',
    originalWord: 'প্রানে',
    context: '...আমার প্রানে বাজায় বাঁশি।',
    suggestions: ['প্রাণে'],
  },
  {
    id: 'err-2',
    originalWord: 'নয়ন',
    context: '...আমি নয়ন জলে ভাসি।।',
    suggestions: ['নয়নে', 'চোখের'],
  },
];

export const mockFormattingSuggestions: FormattingSuggestion[] = [
  {
    id: 'fmt-2',
    title: 'অতিরিক্ত স্পেস',
    description: 'বাক্যের শেষে একটির বেশি স্পেস ব্যবহার করা হয়েছে। আধুনিক টাইপোগ্রাফিতে একটি স্পেস ব্যবহার করা হয়।',
    originalText: 'ভালোবাসি।  চিরদিন',
    replacementText: 'ভালোবাসি। চিরদিন',
  },
];

export const mockStructuralSuggestions: StructuralSuggestion[] = [
    {
      id: 'struct-1',
      title: 'বাক্যটি আরও স্পষ্ট করুন',
      description: 'এই বাক্যটি বেশ দীর্ঘ এবং জটিল। এটিকে দুটি ছোট বাক্যে ভাগ করলে পাঠযোগ্যতা বাড়বে।',
      originalText: 'কী শোভা, কী ছায়া গো, কী স্নেহ, কী মায়া গো— কী আঁচল বিছায়েছ বটের মূলে, নদীর কূলে কূলে।',
      replacementText: 'কী অসাধারণ শোভা ও ছায়া! কী গভীর স্নেহ ও মায়া! বটের মূলে ও নদীর কূলে কূলে যেন আঁচল বিছিয়ে রেখেছ।',
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
