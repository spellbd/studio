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
    title: 'Double Spacing After Period',
    description: 'Found 3 instances of double spaces after a period. Modern typography recommends a single space.',
  },
];

export const mockStructuralSuggestions: StructuralSuggestion[] = [
    {
      id: 'struct-1',
      title: 'Improve Sentence Clarity',
      description: 'The sentence "কী শোভা, কী ছায়া গো, কী স্নেহ, কী মায়া গো— কী আঁচল বিছায়েছ বটের মূলে..." is long and could be split for better readability.',
    },
     {
    id: 'struct-2',
    title: 'Inconsistent Heading Style',
    description: 'Some headings are using "Heading 1" while others use "Heading 2". Consider using a consistent style for all top-level headings.',
  },
];

export const mockOfflineSpellingErrors: SpellingError[] = [
];

export const mockOfflineFormattingSuggestions: FormattingSuggestion[] = [
    {
      id: 'off-fmt-1',
      title: 'Offline Formatting Suggestion',
      description: 'This is a sample formatting suggestion from the offline engine.',
    }
];

export const mockOfflineStructuralSuggestions: StructuralSuggestion[] = [
    {
      id: 'off-struct-1',
      title: 'Offline Structural Suggestion',
      description: 'This is a sample structural suggestion from the offline engine.',
    }
];
