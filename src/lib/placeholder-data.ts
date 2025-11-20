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
    title: 'পিরিয়ডের পরে ডাবল স্পেস',
    description: 'একটি পিরিয়ডের পরে ডাবল স্পেসের ৩টি উদাহরণ পাওয়া গেছে। আধুনিক টাইপোগ্রাফিতে একটি একক স্পেস ব্যবহারের পরামর্শ দেওয়া হয়।',
  },
];

export const mockStructuralSuggestions: StructuralSuggestion[] = [
    {
      id: 'struct-1',
      title: 'বাক্যের স্বচ্ছতা উন্নত করুন',
      description: '"কী শোভা, কী ছায়া গো, কী স্নেহ, কী মায়া গো— কী আঁচল বিছায়েছ বটের মূলে..." বাক্যটি দীর্ঘ এবং এটি আরও ভালো পাঠযোগ্যতার জন্য বিভক্ত করা যেতে পারে।',
    },
     {
    id: 'struct-2',
    title: 'অসামঞ্জস্যপূর্ণ শিরোনাম শৈলী',
    description: 'কিছু শিরোনাম "শিরোনাম ১" ব্যবহার করছে এবং অন্যগুলো "শিরোনাম ২" ব্যবহার করছে। সমস্ত শীর্ষ-স্তরের শিরোনামের জন্য একটি সামঞ্জস্যপূর্ণ শৈলী ব্যবহার করার কথা বিবেচনা করুন।',
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
