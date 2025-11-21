'use client';

import type { ToneSuggestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles } from 'lucide-react';

interface ToneSuggestionCardProps {
  suggestion: ToneSuggestion;
  onReplace: (original: string, replacement: string) => void;
  onDismiss: (id: string) => void;
}

export function ToneSuggestionCard({ suggestion, onReplace, onDismiss }: ToneSuggestionCardProps) {
  const contextParts = suggestion.context.split(suggestion.originalWord);
  
  return (
    <Card className="transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
        <CardTitle className="text-base font-medium flex items-center">
            <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
            ভাষারীতি ও শব্দচয়ন
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onDismiss(suggestion.id)} className="h-7 px-2 -mr-2 -mt-1">
          <X className="h-4 w-4 mr-1" /> উপেক্ষা করুন
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-2">
        <p className="text-sm text-muted-foreground italic mb-3">
          ...{contextParts[0]}<strong className="text-foreground not-italic font-semibold bg-purple-500/10 px-1 rounded">{suggestion.originalWord}</strong>{contextParts[1]}...
        </p>
        <p className="text-sm text-muted-foreground mb-3">{suggestion.explanation}</p>
        
        <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground text-base py-1 px-3"
              onClick={() => onReplace(suggestion.originalWord, suggestion.suggestedWord)}
            >
              <Check className="h-4 w-4 mr-2" />
              {suggestion.suggestedWord}
            </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
