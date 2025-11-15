'use client';

import { useReducer, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSuggestionsAction, reportCorrectionAction } from '@/lib/actions';
import { mockDocumentText } from '@/lib/placeholder-data';
import type { AnalysisResults } from '@/lib/types';
import { Header } from './header';
import { SettingsPanel } from './settings-panel';
import { SuggestionCard } from './suggestion-card';
import { FormattingSuggestionCard } from './formatting-suggestion-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ThumbsUp } from 'lucide-react';

type State = {
  status: 'idle' | 'loading' | 'success' | 'error';
  results: AnalysisResults | null;
  error: string | null;
  isOnline: boolean;
};

type Action =
  | { type: 'CHECK_START'; isOnline: boolean }
  | { type: 'CHECK_SUCCESS'; payload: AnalysisResults }
  | { type: 'CHECK_ERROR'; payload: string }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'DISMISS_SPELLING'; payload: string }
  | { type: 'DISMISS_FORMATTING'; payload: string };

const initialState: State = {
  status: 'idle',
  results: null,
  error: null,
  isOnline: true,
};

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
    default:
      return state;
  }
}

export function MainPanel() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  const handleCheckDocument = async () => {
    dispatch({ type: 'CHECK_START', isOnline: state.isOnline });
    try {
      // In a real Word Add-in, you'd get the text from the document using Office.js
      // For this demo, we use mock text.
      const results = await getSuggestionsAction(mockDocumentText, state.isOnline);
      dispatch({ type: 'CHECK_SUCCESS', payload: results });
       if (results.spellingErrors.length === 0 && results.formattingSuggestions.length === 0) {
        toast({
          title: 'All Clear!',
          description: 'No suggestions found in your document.',
        });
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'An unknown error occurred.';
      dispatch({ type: 'CHECK_ERROR', payload: error });
      toast({
        variant: 'destructive',
        title: 'Error Checking Document',
        description: error,
      });
    }
  };

  const handleOnlineChange = (isOnline: boolean) => {
    dispatch({ type: 'SET_ONLINE', payload: isOnline });
    toast({
      title: `Mode changed to ${isOnline ? 'Online' : 'Offline'}`,
      description: isOnline
        ? 'Using advanced AI for suggestions.'
        : 'Using local model for basic suggestions.',
    });
  };

  const handleReplace = (original: string, replacement: string) => {
    // In a real Word Add-in, you'd find and replace the text.
    console.log(`Replacing "${original}" with "${replacement}"`);
    toast({
      title: 'Text Replaced',
      description: `"${original}" has been replaced with "${replacement}".`,
    });
    // Dismiss the card after action
    const errorToDismiss = state.results?.spellingErrors.find(e => e.originalWord === original);
    if(errorToDismiss) {
        handleIgnoreSpelling(errorToDismiss.id);
    }
  };

  const handleIgnoreSpelling = (id: string) => {
    dispatch({ type: 'DISMISS_SPELLING', payload: id });
  };
  
  const handleFixFormatting = (id: string) => {
    // In a real add-in, apply formatting changes
    console.log(`Applying fix for formatting issue ${id}`);
    toast({
      title: 'Formatting Applied',
      description: 'The suggested formatting change has been applied.',
    });
    dispatch({ type: 'DISMISS_FORMATTING', payload: id });
  };
  
  const handleLearn = async (originalWord: string, correctedWord: string) => {
    const { success, message } = await reportCorrectionAction(originalWord, correctedWord);
    toast({
      title: success ? 'Model Updated' : 'Update Failed',
      description: message,
      variant: success ? 'default' : 'destructive',
    });
    if (success) {
        const errorToDismiss = state.results?.spellingErrors.find(e => e.originalWord === originalWord);
        if (errorToDismiss) {
            handleIgnoreSpelling(errorToDismiss.id);
        }
    }
  };
  
  const renderContent = () => {
    switch (state.status) {
      case 'loading':
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
      case 'success':
        if (!state.results || (state.results.spellingErrors.length === 0 && state.results.formattingSuggestions.length === 0)) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-4 mb-4">
                        <ThumbsUp className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-headline font-semibold">All Clear!</h3>
                    <p className="text-muted-foreground mt-2">We didn't find any suggestions for your document. Great job!</p>
                </div>
            );
        }
        return (
          <Tabs defaultValue="spelling" className="w-full p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="spelling" disabled={state.results.spellingErrors.length === 0}>
                Spelling & Grammar
                {state.results.spellingErrors.length > 0 && <Badge variant="secondary" className="ml-2">{state.results.spellingErrors.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="formatting" disabled={state.results.formattingSuggestions.length === 0}>
                Formatting
                {state.results.formattingSuggestions.length > 0 && <Badge variant="secondary" className="ml-2">{state.results.formattingSuggestions.length}</Badge>}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="spelling" className="mt-4 space-y-4">
              {state.results.spellingErrors.map(error => (
                <SuggestionCard key={error.id} error={error} onReplace={handleReplace} onIgnore={handleIgnoreSpelling} onLearn={handleLearn} />
              ))}
            </TabsContent>
            <TabsContent value="formatting" className="mt-4 space-y-4">
              {state.results.formattingSuggestions.map(suggestion => (
                <FormattingSuggestionCard key={suggestion.id} suggestion={suggestion} onFix={handleFixFormatting} />
              ))}
            </TabsContent>
          </Tabs>
        );
      case 'error':
        return <div className="p-4 text-destructive text-center">{state.error}</div>;
      case 'idle':
      default:
        const idleImage = PlaceHolderImages.find(i => i.id === 'feature-illustration-1');
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                {idleImage && <Image src={idleImage.imageUrl} alt={idleImage.description} width={200} height={200} data-ai-hint="document check illustration" className="rounded-lg mb-4" />}
                <h3 className="text-xl font-headline font-semibold mt-4">Ready to improve your writing?</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">Click "Check Document" to get started with spelling, grammar, and formatting suggestions.</p>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        onCheckDocument={handleCheckDocument}
        onShowSettings={() => setSettingsOpen(true)}
        isChecking={state.status === 'loading'}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
      <SettingsPanel
        isOpen={isSettingsOpen}
        onOpenChange={setSettingsOpen}
        isOnline={state.isOnline}
        onOnlineChange={handleOnlineChange}
      />
    </div>
  );
}
