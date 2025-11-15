'use client';

import { useReducer, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSuggestionsAction, reportCorrectionAction } from '@/lib/actions';
import type { AnalysisResults } from '@/lib/types';
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
  | { type: 'DISMISS_TONE'; payload: string };
  
const initialState: State = {
  status: 'idle',
  results: null,
  error: null,
  isOnline: true,
  geminiApiKey: null,
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
    default:
      return state;
  }
}

export function MainPanel() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [text, setText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) {
      dispatch({ type: 'SET_API_KEY', payload: savedKey });
    }

    // Initialize Office.js and get the document text
    if (typeof Office !== 'undefined' && typeof Word !== 'undefined') {
        Office.onReady((info: any) => {
            if (info.host === Office.HostType.Word) {
                getDocumentText();
            }
        });
    } else {
        console.warn("Office.js is not loaded. Running in web mode with mock data.");
        setText("আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।"); // Fallback for web
    }
  }, []);

  const getDocumentText = async () => {
    if (typeof Word === 'undefined') {
        console.error('Word object is not available.');
        toast({
            variant: 'destructive',
            title: 'Office.js Error',
            description: 'Could not connect to the Word document.',
          });
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
        title: 'Error',
        description: 'Could not read text from the document.',
      });
    }
  };


  const handleCheckDocument = async () => {
    await getDocumentText(); // Refresh text before checking

    if (!text.trim()) {
        toast({
            variant: 'destructive',
            title: 'Empty Document',
            description: 'There is no text in the document to check.',
        });
        return;
    }

    if (state.isOnline && !state.geminiApiKey) {
        toast({
            variant: 'destructive',
            title: 'API Key Required',
            description: 'Please add your Gemini API key in the settings.',
        });
        setSettingsOpen(true);
        return;
    }

    dispatch({ type: 'CHECK_START', isOnline: state.isOnline });
    try {
      const results = await getSuggestionsAction(text, state.isOnline, state.geminiApiKey);
      dispatch({ type: 'CHECK_SUCCESS', payload: results });
       if (results.spellingErrors.length === 0 && results.formattingSuggestions.length === 0 && results.structuralSuggestions.length === 0 && results.toneSuggestions.length === 0) {
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

  const handleApiKeyChange = (apiKey: string | null) => {
    dispatch({ type: 'SET_API_KEY', payload: apiKey });
    if (apiKey) {
      localStorage.setItem('geminiApiKey', apiKey);
      toast({ title: 'API Key Saved', description: 'Your Gemini API key has been securely stored.' });
    } else {
      localStorage.removeItem('geminiApiKey');
      toast({ title: 'API Key Removed', variant: 'destructive' });
    }
  };


  const handleReplace = async (original: string, replacement: string) => {
    if (typeof Word === 'undefined') {
        console.error('Word object is not available for replacement.');
        toast({
          variant: 'destructive',
          title: 'Office.js Error',
          description: 'Could not connect to the Word document to perform replacement.',
        });
        return;
    }
    try {
      await Word.run(async (context: any) => {
        const searchResults = context.document.body.search(original, { matchCase: false });
        context.load(searchResults, 'items');
        await context.sync();
        
        if (searchResults.items.length > 0) {
          // Replace all occurrences, but we'll just handle the first for now for simplicity
          searchResults.items.forEach(item => item.insertText(replacement, 'Replace'));
          await context.sync();
        }
      });
      
      toast({
        title: 'Text Replaced',
        description: `"${original}" has been replaced with "${replacement}".`,
      });
      await getDocumentText(); // Refresh the text area after replacement
      
      // Try to dismiss any card related to this replacement
      const spellingError = state.results?.spellingErrors.find(e => e.originalWord === original);
      if(spellingError) {
          handleIgnoreSpelling(spellingError.id);
      }
      const toneSuggestion = state.results?.toneSuggestions.find(s => s.originalWord === original);
      if(toneSuggestion) {
          handleIgnoreTone(toneSuggestion.id);
      }

    } catch (error) {
      console.error('Error replacing text:', error);
      toast({
        variant: 'destructive',
        title: 'Replacement Failed',
        description: 'Could not replace the text in the document.',
      });
    }
  };

  const handleIgnoreSpelling = (id: string) => dispatch({ type: 'DISMISS_SPELLING', payload: id });
  const handleIgnoreFormatting = (id: string) => dispatch({ type: 'DISMISS_FORMATTING', payload: id });
  const handleIgnoreStructural = (id: string) => dispatch({ type: 'DISMISS_STRUCTURAL', payload: id });
  const handleIgnoreTone = (id: string) => dispatch({ type: 'DISMISS_TONE', payload: id });
  
  const handleFixFormatting = (id: string) => {
    console.log(`Applying fix for formatting issue ${id}`);
    toast({
      title: 'Formatting Applied',
      description: 'The suggested formatting change has been applied. (Not implemented)',
    });
    handleIgnoreFormatting(id);
  };

  const handleFixStructural = (id: string) => {
    console.log(`Applying fix for structural issue ${id}`);
    toast({
      title: 'Structural Change Applied',
      description: 'The suggested structural change has been applied. (Not implemented)',
    });
    handleIgnoreStructural(id);
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
        if (!state.results || (state.results.spellingErrors.length === 0 && state.results.formattingSuggestions.length === 0 && state.results.structuralSuggestions.length === 0 && state.results.toneSuggestions.length === 0)) {
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
          <div className="space-y-6">
            {state.results.spellingErrors.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Type className="mr-2 h-4 w-4" /> Spelling & Grammar ({state.results.spellingErrors.length})
                </h3>
                {state.results.spellingErrors.map(error => (
                  <SuggestionCard key={error.id} error={error} onReplace={handleReplace} onIgnore={handleIgnoreSpelling} onLearn={handleLearn} />
                ))}
              </div>
            )}

            {state.results.toneSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Sparkles className="mr-2 h-4 w-4" /> Tone & Word Choice ({state.results.toneSuggestions.length})
                </h3>
                {state.results.toneSuggestions.map(suggestion => (
                  <ToneSuggestionCard key={suggestion.id} suggestion={suggestion} onReplace={handleReplace} onDismiss={handleIgnoreTone} />
                ))}
              </div>
            )}
            
            {state.results.structuralSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Puzzle className="mr-2 h-4 w-4" /> Structural ({state.results.structuralSuggestions.length})
                </h3>
                {state.results.structuralSuggestions.map(suggestion => (
                  <StructuralSuggestionCard key={suggestion.id} suggestion={suggestion} onFix={handleFixStructural} onDismiss={handleIgnoreStructural} />
                ))}
              </div>
            )}

            {state.results.formattingSuggestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="flex items-center text-sm font-semibold text-muted-foreground px-1">
                  <Paintbrush className="mr-2 h-4 w-4" /> Formatting ({state.results.formattingSuggestions.length})
                </h3>
                {state.results.formattingSuggestions.map(suggestion => (
                  <FormattingSuggestionCard key={suggestion.id} suggestion={suggestion} onFix={handleFixFormatting} onDismiss={handleIgnoreFormatting} />
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
                <h3 className="text-lg font-semibold font-headline">Ready to improve your writing?</h3>
                <p className="text-muted-foreground mt-1 max-w-sm text-sm">Click "Check Document" to get started.</p>
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
                placeholder="The content of your Word document will appear here..."
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
        apiKey={state.geminiApiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  );
}
