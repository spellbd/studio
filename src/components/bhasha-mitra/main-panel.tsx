'use client';

import { useReducer, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSuggestionsAction, reportCorrectionAction } from '@/lib/actions';
import { mockDocumentText } from '@/lib/placeholder-data';
import type { AnalysisResults } from '@/lib/types';
import { SettingsPanel } from './settings-panel';
import { SuggestionCard } from './suggestion-card';
import { FormattingSuggestionCard } from './formatting-suggestion-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, FileText, Settings, LoaderCircle, ScanText, Type, Paintbrush } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Logo } from '../logo';
import { Separator } from '../ui/separator';

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
  const [text, setText] = useState(mockDocumentText);
  const { toast } = useToast();

  const handleCheckDocument = async () => {
    dispatch({ type: 'CHECK_START', isOnline: state.isOnline });
    try {
      const results = await getSuggestionsAction(text, state.isOnline);
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
    console.log(`Replacing "${original}" with "${replacement}"`);
    setText(currentText => currentText.replace(original, replacement));
    toast({
      title: 'Text Replaced',
      description: `"${original}" has been replaced with "${replacement}".`,
    });
    const errorToDismiss = state.results?.spellingErrors.find(e => e.originalWord === original);
    if(errorToDismiss) {
        handleIgnoreSpelling(errorToDismiss.id);
    }
  };

  const handleIgnoreSpelling = (id: string) => {
    dispatch({ type: 'DISMISS_SPELLING', payload: id });
  };
  
  const handleFixFormatting = (id: string) => {
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
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
      case 'success':
        if (!state.results || (state.results.spellingErrors.length === 0 && state.results.formattingSuggestions.length === 0)) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-4 mb-4">
                        <ThumbsUp className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold">All Clear!</h3>
                    <p className="text-muted-foreground mt-1 text-sm">We didn't find any suggestions.</p>
                </div>
            );
        }
        return (
          <div className="space-y-4">
            {state.results.spellingErrors.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground">
                  <Type className="mr-2 h-4 w-4" /> Spelling & Grammar ({state.results.spellingErrors.length})
                </h3>
                {state.results.spellingErrors.map(error => (
                  <SuggestionCard key={error.id} error={error} onReplace={handleReplace} onIgnore={handleIgnoreSpelling} onLearn={handleLearn} />
                ))}
              </div>
            )}
            {state.results.spellingErrors.length > 0 && state.results.formattingSuggestions.length > 0 && (
              <Separator />
            )}
            {state.results.formattingSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground">
                  <Paintbrush className="mr-2 h-4 w-4" /> Formatting ({state.results.formattingSuggestions.length})
                </h3>
                {state.results.formattingSuggestions.map(suggestion => (
                  <FormattingSuggestionCard key={suggestion.id} suggestion={suggestion} onFix={handleFixFormatting} />
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
                <h3 className="text-lg font-semibold">Ready to improve your writing?</h3>
                <p className="text-muted-foreground mt-1 max-w-sm text-sm">Click "Check Document" to get started.</p>
            </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
        <header className="flex items-center justify-between p-3 border-b bg-card">
            <div className="flex items-center gap-2">
                <Logo className="h-7 w-7" />
                <h1 className="text-lg font-semibold text-primary">
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
                placeholder="Paste your Bangla text here..."
                className="w-full h-32 resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <Button
                onClick={handleCheckDocument}
                disabled={state.status === 'loading'}
                className="w-full mt-3"
            >
                {state.status === 'loading' ? (
                    <LoaderCircle className="animate-spin" />
                ) : (
                    <ScanText />
                )}
                <span>{state.status === 'loading' ? 'Checking...' : 'Check Document'}</span>
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
      />
    </div>
  );
}
