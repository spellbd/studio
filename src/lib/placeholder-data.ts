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
    originalWord: 'চট্রগ্রামে',
    context: '...তিনি সম্প্রতি চট্রগ্রামে বদলি হয়েছেন।',
    suggestions: ['চট্টগ্রামে'],
  },
  {
    id: 'err-3',
    originalWord: 'সম্বব',
    context: '...পড়াশুনা চালিয়ে যাওয়া সম্বব নয়।',
    suggestions: ['সম্ভব'],
  },
  {
    id: 'err-4',
    originalWord: 'ছারপত্র',
    context: '...আমাকে ছারপত্র দিয়ে বাধিত করবেন।',
    suggestions: ['ছাড়পত্র'],
  },
];

export const mockFormattingSuggestions: FormattingSuggestion[] = [
    {
      id: 'fmt-1',
      title: 'অতিরিক্ত ফাঁকা লাইন',
      description: '"নয়।" এবং "অতএব" এর মধ্যে একটি অতিরিক্ত ফাঁকা লাইন রয়েছে যা সরানো যেতে পারে।',
      originalText: 'নয়।\n\nঅতএব',
      replacementText: 'নয়।\nঅতএব',
    },
];

export const mockStructuralSuggestions: StructuralSuggestion[] = [
    {
      id: 'struct-1',
      title: 'অনুপস্থিত "বিষয়"',
      description: 'আবেদনপত্রটিতে একটি "বিষয়" উল্লেখ করা প্রয়োজন, যা প্রাপককে চিঠির উদ্দেশ্য সম্পর্কে দ্রুত ধারণা দেবে।',
      originalText: 'ঢাকা\n\nমহোদয়',
      replacementText: 'ঢাকা\n\nবিষয়: ছাড়পত্রের জন্য আবেদন।\n\nমহোদয়',
    },
    {
      id: 'struct-2',
      title: 'বাক্য গঠন',
      description: '"অতএব, আপনার কাছে আমার আকুল আবেদন, আমাকে ছারপত্র দিয়ে বাধিত করবেন।" বাক্যটি আরও আনুষ্ঠানিক এবং সহজভাবে লেখা যেতে পারে।',
      originalText: 'অতএব, আপনার কাছে আমার আকুল আবেদন, আমাকে ছারপত্র দিয়ে বাধিত করবেন।',
      replacementText: 'অতএব, মহোদয়ের নিকট আবেদন, আমাকে ছাড়পত্র প্রদান করে বাধিত করবেন।',
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
