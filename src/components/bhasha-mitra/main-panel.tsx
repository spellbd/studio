'use client';

import { useReducer, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSuggestionsAction, reportCorrectionAction } from '@/lib/actions';
import type { AnalysisResults, FormattingSuggestion, StructuralSuggestion } from '@/lib/types';
import { SettingsPanel } from './settings-panel';
import { SuggestionCard } from './suggestion-card';
import { FormattingSuggestionCard } from './formatting-suggestion-card';
import { StructuralSuggestionCard } from './structural-suggestion-card';
import { ToneSuggestionCard } from './tone-suggestion-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, FileText, Settings, LoaderCircle, ScanText, Type, Paintbrush, Puzzle, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Logo } from '../logo';
import { DictionaryManagementDialog } from './dictionary-management-dialog';

// Define the Office global object to avoid TypeScript errors.
// This is provided by the Office Add-in environment at runtime.
declare const Office: any;
declare const Word: any;

type State = {
  status: 'idle' | 'loading' | 'success' | 'error';
  results: AnalysisResults | null;
  error: string | null;
  isOnline: boolean;
  geminiApiKey: string | null;
  dictionary: string[];
};

type Action =
  | { type: 'CHECK_START'; isOnline: boolean }
  | { type: 'CHECK_SUCCESS'; payload: AnalysisResults }
  | { type: 'CHECK_ERROR'; payload: string }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_API_KEY'; payload: string | null }
  | { type: 'DISMISS_SPELLING'; payload: string }
  | { type: 'DISMISS_FORMATTING'; payload: string }
  | { type: 'DISMISS_STRUCTURAL'; payload: string }
  | { type: 'DISMISS_TONE'; payload: string }
  | { type: 'SET_DICTIONARY'; payload: string[] };
  
const initialState: State = {
  status: 'idle',
  results: null,
  error: null,
  isOnline: true,
  geminiApiKey: null,
  dictionary: [],
};

const fallbackText = `প্রধান শিক্ষক
ক স্কুল এন্ড কলেজ
ঢাকা

মহোদয়
আমি আপনার স্কুলের একজন ছাত্র। আমার নাম করিম। আমি দশম শ্রেনিতে পড়ি। আমার বাবা একজন সরকারি চাকুরিজিবি। তিনি সম্প্রতি চট্রগ্রামে বদলি হয়েছেন। তাই আমার পক্ষে ঢাকায় থেকে পড়াশুনা চালিয়ে যাওয়া সম্বব নয়।

অতএব, আপনার কাছে আমার আকুল আবেদন, আমাকে ছারপত্র দিয়ে বাধিত করবেন।

আপনার একান্ত অনুগত ছাত্র
করিম
দশম শ্রেনি`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CHECK_START':
      return { ...state, status: 'loading', error: null, isOnline: action.isOnline };
    case 'CHECK_SUCCESS':
      return { ...state, status: 'success', results: action.payload };
    case 'CHECK_ERROR':
      return { ...state, status: 'error', error: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_API_KEY':
        return { ...state, geminiApiKey: action.payload };
    case 'DISMISS_SPELLING':
      if (!state.results) return state;
      return {
        ...state,
        results: {
          ...state.results,
          spellingErrors: state.results.spellingErrors.filter(e => e.id !== action.payload),
        },
      };
    case 'DISMISS_FORMATTING':
      if (!state.results) return state;
      return {
        ...state,
        results: {
          ...state.results,
          formattingSuggestions: state.results.formattingSuggestions.filter(s => s.id !== action.payload),
        },
      };
    case 'DISMISS_STRUCTURAL':
        if (!state.results) return state;
        return {
            ...state,
            results: {
            ...state.results,
            structuralSuggestions: state.results.structuralSuggestions.filter(s => s.id !== action.payload),
            },
        };
    case 'DISMISS_TONE':
      if (!state.results) return state;
      return {
        ...state,
        results: {
          ...state.results,
          toneSuggestions: state.results.toneSuggestions.filter(s => s.id !== action.payload),
        },
      };
    case 'SET_DICTIONARY':
      return { ...state, dictionary: action.payload };
    default:
      return state;
  }
}

export function MainPanel() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isDictionaryOpen, setDictionaryOpen] = useState(false);
  const [text, setText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) {
      dispatch({ type: 'SET_API_KEY', payload: savedKey });
    }

    const savedDictionary = localStorage.getItem('localDictionary');
    if (savedDictionary) {
      dispatch({ type: 'SET_DICTIONARY', payload: JSON.parse(savedDictionary) });
    }

    const initializeOffice = () => {
        if (typeof Office !== 'undefined' && typeof Word !== 'undefined') {
            Office.onReady((info: any) => {
                if (info.host === Office.HostType.Word) {
                    getDocumentText();
                }
            });
        } else {
            console.warn("Office.js is not loaded. Running in web mode with mock data.");
            setText(fallbackText);
        }
    };
    
    initializeOffice();
  }, []);

  const getDocumentText = async () => {
    if (typeof Word === 'undefined' || typeof Office === 'undefined') {
        setText(fallbackText);
        return;
    }
    try {
      await Word.run(async (context: any) => {
        const body = context.document.body;
        context.load(body, 'text');
        await context.sync();
        setText(body.text);
      });
    } catch (error) {
      console.error('Error getting document text:', error);
      toast({
        variant: 'destructive',
        title: 'ত্রুটি',
        description: 'ডকুমেন্ট থেকে টেক্সট পড়া যায়নি।',
      });
    }
  };


  const handleCheckDocument = async () => {
    const currentText = text;

    if (!currentText.trim()) {
        toast({
            variant: 'destructive',
            title: 'খালি ডকুমেন্ট',
            description: 'পরীক্ষা করার জন্য ডকুমেন্টে কোনো লেখা নেই।',
        });
        return;
    }

    if (state.isOnline && !state.geminiApiKey) {
        toast({
            variant: 'destructive',
            title: 'API কী প্রয়োজন',
            description: 'অনুগ্রহ করে সেটিংসে আপনার Gemini API কী যোগ করুন।',
        });
        setSettingsOpen(true);
        return;
    }

    dispatch({ type: 'CHECK_START', isOnline: state.isOnline });
    try {
      const results = await getSuggestionsAction(currentText, state.isOnline, state.geminiApiKey);
      dispatch({ type: 'CHECK_SUCCESS', payload: results });
       if (results.spellingErrors.length === 0 && results.formattingSuggestions.length === 0 && results.structuralSuggestions.length === 0 && results.toneSuggestions.length === 0) {
        toast({
          title: 'সবকিছু ঠিক আছে!',
          description: 'আপনার ডকুমেন্টে কোনো পরামর্শ পাওয়া যায়নি।',
        });
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'একটি অজানা ত্রুটি ঘটেছে।';
      dispatch({ type: 'CHECK_ERROR', payload: error });
      toast({
        variant: 'destructive',
        title: 'ডকুমেন্ট পরীক্ষা করার সময় ত্রুটি',
        description: error,
      });
    }
  };

  const handleOnlineChange = (isOnline: boolean) => {
    dispatch({ type: 'SET_ONLINE', payload: isOnline });
    toast({
      title: `মোড পরিবর্তন করে ${isOnline ? 'অনলাইন' : 'অফলাইন'} করা হয়েছে`,
      description: isOnline
        ? 'উন্নত AI পরামর্শের জন্য ব্যবহৃত হচ্ছে।'
        : 'সাধারণ পরামর্শের জন্য স্থানীয় মডেল ব্যবহৃত হচ্ছে।',
    });
  };

  const handleApiKeyChange = (apiKey: string | null) => {
    dispatch({ type: 'SET_API_KEY', payload: apiKey });
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
      toast({ title: 'API কী সংরক্ষিত হয়েছে', description: 'আপনার Gemini API কী સુરક્ષિતভাবে সংরক্ষণ করা হয়েছে।' });
    } else {
      localStorage.removeItem('geminiApiKey');
      toast({ title: 'API কী মুছে ফেলা হয়েছে', variant: 'destructive' });
    }
  };


  const handleReplace = async (original: string, replacement: string) => {
    if (typeof Word === 'undefined' || typeof Office === 'undefined') {
        console.warn('Word object is not available for replacement. Simulating replacement.');
        const newText = text.replace(new RegExp(original.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacement);
        setText(newText);
        toast({
          title: 'লেখা প্রতিস্থাপিত (সিমুলেটেড)',
          description: `"${original}" শব্দটি "${replacement}" দিয়ে প্রতিস্থাপিত হয়েছে।`,
        });

        // Dismiss related cards
        const spellingError = state.results?.spellingErrors.find(e => e.originalWord === original);
        if(spellingError) handleIgnoreSpelling(spellingError.id);
        
        const toneSuggestion = state.results?.toneSuggestions.find(s => s.originalWord === original);
        if(toneSuggestion) handleIgnoreTone(toneSuggestion.id);
        
        const structuralSuggestion = state.results?.structuralSuggestions.find(s => s.originalText === original);
        if(structuralSuggestion) handleIgnoreStructural(structuralSuggestion.id);

        const formattingSuggestion = state.results?.formattingSuggestions.find(s => s.originalText === original);
        if(formattingSuggestion) handleIgnoreFormatting(formattingSuggestion.id);

        return;
    }
    try {
      await Word.run(async (context: any) => {
        const searchResults = context.document.body.search(original, { matchCase: false });
        context.load(searchResults, 'items');
        await context.sync();
        
        if (searchResults.items.length > 0) {
          searchResults.items.forEach(item => item.insertText(replacement, 'Replace'));
          await context.sync();
        } else {
            toast({
                variant: 'destructive',
                title: 'শব্দটি পাওয়া যায়নি',
                description: `ডকুমেন্টে "${original}" শব্দটি খুঁজে পাওয়া যায়নি।`,
            });
            return;
        }
      });
      
      toast({
        title: 'লেখা প্রতিস্থাপিত',
        description: `"${original}" শব্দটি "${replacement}" দিয়ে প্রতিস্থাপিত হয়েছে।`,
      });
      
      await getDocumentText(); // Refresh the text area after replacement
      
      // Dismiss the corresponding cards after successful replacement
       const spellingError = state.results?.spellingErrors.find(e => e.originalWord === original && e.suggestions.includes(replacement));
       if (spellingError) handleIgnoreSpelling(spellingError.id);

       const toneSuggestion = state.results?.toneSuggestions.find(s => s.originalWord === original && s.suggestedWord === replacement);
       if (toneSuggestion) handleIgnoreTone(toneSuggestion.id);

       const structuralSuggestion = state.results?.structuralSuggestions.find(s => s.originalText === original);
       if(structuralSuggestion) handleIgnoreStructural(structuralSuggestion.id);

       const formattingSuggestion = state.results?.formattingSuggestions.find(s => s.originalText === original);
       if(formattingSuggestion) handleIgnoreFormatting(formattingSuggestion.id);

    } catch (error) {
      console.error('Error replacing text:', error);
      toast({
        variant: 'destructive',
        title: 'প্রতিস্থাপন ব্যর্থ হয়েছে',
        description: 'ডকুমেন্টে লেখাটি প্রতিস্থাপন করা যায়নি।',
      });
    }
  };

  const handleIgnoreSpelling = (id: string) => dispatch({ type: 'DISMISS_SPELLING', payload: id });
  const handleIgnoreFormatting = (id: string) => dispatch({ type: 'DISMISS_FORMATTING', payload: id });
  const handleIgnoreStructural = (id: string) => dispatch({ type: 'DISMISS_STRUCTURAL', payload: id });
  const handleIgnoreTone = (id: string) => dispatch({ type: 'DISMISS_TONE', payload: id });
  
  const handleFixSuggestion = (suggestion: StructuralSuggestion | FormattingSuggestion) => {
    if (suggestion.originalText && suggestion.replacementText) {
      handleReplace(suggestion.originalText, suggestion.replacementText);
    } else {
      toast({
        title: 'ম্যানুয়াল পরিবর্তন প্রয়োজন',
        description: 'এই পরামর্শটি ডকুমেন্টে নিজে প্রয়োগ করুন। AI স্বয়ংক্রিয়ভাবে পরিবর্তন করার জন্য কোনো নির্দিষ্ট নির্দেশনা দেয়নি।',
      });
    }

    if ('description' in suggestion && state.results?.structuralSuggestions.some(s => s.id === suggestion.id)) {
        handleIgnoreStructural(suggestion.id);
    } else {
        handleIgnoreFormatting(suggestion.id);
    }
  };
  
  const handleLearn = async (word: string) => {
    const newDictionary = [...new Set([...state.dictionary, word])];
    localStorage.setItem('localDictionary', JSON.stringify(newDictionary));
    dispatch({ type: 'SET_DICTIONARY', payload: newDictionary });

    const { success, message } = await reportCorrectionAction(word, word);
    toast({
      title: success ? 'শব্দটি অভিধানে যোগ করা হয়েছে' : 'আপডেট ব্যর্থ হয়েছে',
      description: message,
      variant: success ? 'default' : 'destructive',
    });

    if (success) {
        const errorToDismiss = state.results?.spellingErrors.find(e => e.originalWord === word);
        if (errorToDismiss) {
            handleIgnoreSpelling(errorToDismiss.id);
        }
    }
  };

  const handleDictionaryUpdate = (newDictionary: string[]) => {
    localStorage.setItem('localDictionary', JSON.stringify(newDictionary));
    dispatch({ type: 'SET_DICTIONARY', payload: newDictionary });
    toast({
        title: 'অভিধান আপডেট হয়েছে',
        description: 'আপনার অভিধান সফলভাবে আপডেট করা হয়েছে।',
    });
  };

  const renderContent = () => {
    switch (state.status) {
      case 'loading':
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
      case 'success':
        const filteredSpellingErrors = state.results?.spellingErrors.filter(
            (error) => !state.dictionary.includes(error.originalWord)
        ) ?? [];

        if (!state.results || (filteredSpellingErrors.length === 0 && state.results.formattingSuggestions.length === 0 && state.results.structuralSuggestions.length === 0 && state.results.toneSuggestions.length === 0)) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-4 mb-4">
                        <ThumbsUp className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold">সবকিছু ঠিক আছে!</h3>
                    <p className="text-muted-foreground mt-1 text-sm">আমরা কোনো পরামর্শ খুঁজে পাইনি।</p>
                </div>
            );
        }
        return (
          <div className="space-y-6">
            {filteredSpellingErrors.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Type className="mr-2 h-4 w-4" /> বানান এবং ব্যাকরণ ({filteredSpellingErrors.length})
                </h3>
                {filteredSpellingErrors.map(error => (
                  <SuggestionCard key={error.id} error={error} onReplace={handleReplace} onIgnore={handleIgnoreSpelling} onLearn={handleLearn} />
                ))}
              </div>
            )}

            {state.results.toneSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Sparkles className="mr-2 h-4 w-4" /> لحن এবং শব্দচয়ন ({state.results.toneSuggestions.length})
                </h3>
                {state.results.toneSuggestions.map(suggestion => (
                  <ToneSuggestionCard key={suggestion.id} suggestion={suggestion} onReplace={handleReplace} onDismiss={handleIgnoreTone} />
                ))}
              </div>
            )}
            
            {state.results.structuralSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Puzzle className="mr-2 h-4 w-4" /> কাঠামোগত ({state.results.structuralSuggestions.length})
                </h3>
                {state.results.structuralSuggestions.map(suggestion => (
                  <StructuralSuggestionCard key={suggestion.id} suggestion={suggestion} onFix={() => handleFixSuggestion(suggestion)} onDismiss={handleIgnoreStructural} />
                ))}
              </div>
            )}

            {state.results.formattingSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Paintbrush className="mr-2 h-4 w-4" /> ফরম্যাটিং ({state.results.formattingSuggestions.length})
                </h3>
                {state.results.formattingSuggestions.map(suggestion => (
                  <FormattingSuggestionCard key={suggestion.id} suggestion={suggestion} onFix={() => handleFixSuggestion(suggestion)} onDismiss={handleIgnoreFormatting} />
                ))}
              </div>
            )}
          </div>
        );
      case 'error':
        return <div className="p-4 text-destructive text-center">{state.error}</div>;
      case 'idle':
      default:
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold font-headline">আপনার লেখার মান উন্নত করতে প্রস্তুত?</h3>
                <p className="text-muted-foreground mt-1 max-w-sm text-sm">শুরু করতে "ডকুমেন্ট পরীক্ষা করুন" বোতামে ক্লিক করুন।</p>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="flex items-center justify-between p-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <Logo className="h-8 w-8" />
                <h1 className="text-xl font-bold text-primary font-headline">
                ভাষা মিত্র
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                aria-label="Settings"
                >
                <Settings className="h-5 w-5" />
                </Button>
            </div>
        </header>

        <div className="p-4 border-b">
            <Textarea 
                placeholder="আপনার Word ডকুমেন্টের বিষয়বস্তু এখানে প্রদর্শিত হবে..."
                className="w-full h-32 resize-none text-base bg-muted/40"
                value={text}
                readOnly // Make the textarea read-only as it reflects the doc content
            />
            <Button
                onClick={handleCheckDocument}
                disabled={state.status === 'loading'}
                className="w-full mt-3 font-semibold"
                size="lg"
            >
                {state.status === 'loading' ? (
                    <LoaderCircle className="animate-spin" />
                ) : (
                    <ScanText />
                )}
                <span>{state.status === 'loading' ? 'পরীক্ষা চলছে...' : 'ডকুমেন্ট পরীক্ষা করুন'}</span>
            </Button>
        </div>
      
      <main className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onOpenChange={setSettingsOpen}
        isOnline={state.isOnline}
        onOnlineChange={handleOnlineChange}
        apiKey={state.geminiApiKey}
        onApiKeyChange={handleApiKeyChange}
        onManageDictionary={() => {
            setSettingsOpen(false);
            setDictionaryOpen(true);
        }}
      />
      <DictionaryManagementDialog
        isOpen={isDictionaryOpen}
        onOpenChange={setDictionaryOpen}
        dictionary={state.dictionary}
        onDictionaryUpdate={handleDictionaryUpdate}
      />
    </div>
  );
}
