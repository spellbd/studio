'use client';

import type { FormattingSuggestion } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, X, Paintbrush } from 'lucide-react';

interface FormattingSuggestionCardProps {
  suggestion: FormattingSuggestion;
  onFix: (suggestion: FormattingSuggestion) => void;
  onDismiss: (id: string) => void;
}

export function FormattingSuggestionCard({ suggestion, onFix, onDismiss }: FormattingSuggestionCardProps) {
  const canAutoFix = suggestion.originalText && suggestion.replacementText;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-muted-foreground">
          <Paintbrush className="h-4 w-4 text-blue-500" />
          <span>{suggestion.title}</span>
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => onDismiss(suggestion.id)} className="h-7 w-7 -mr-2 -mt-1 shrink-0">
            <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-2">
        <p className="text-sm text-foreground">{suggestion.description}</p>
         {canAutoFix && (
            <div className="mt-2 text-xs border-t pt-2">
                <p className="text-destructive">মুছে ফেলুন:</p>
                <p className="line-through text-muted-foreground">{suggestion.originalText.replace(/\n/g, '↵ ')}</p>
                <p className="text-green-600 mt-1">যোগ করুন:</p>
                <p className="text-muted-foreground">{suggestion.replacementText.replace(/\n/g, '↵ ')}</p>
            </div>
        )}
      </CardContent>
      {canAutoFix && (
        <CardFooter className="p-3 pt-0 flex justify-end">
            <Button size="sm" onClick={() => onFix(suggestion)} className="h-8">
            <Wand2 className="mr-2 h-4 w-4" />
            ঠিক করুন
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
