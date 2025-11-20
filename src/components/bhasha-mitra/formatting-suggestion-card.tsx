'use client';

import type { FormattingSuggestion } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface FormattingSuggestionCardProps {
  suggestion: FormattingSuggestion;
  onFix: (suggestion: FormattingSuggestion) => void;
  onDismiss: (id: string) => void;
}

export function FormattingSuggestionCard({ suggestion, onFix, onDismiss }: FormattingSuggestionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
        <CardTitle className="text-base font-medium">{suggestion.title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onDismiss(suggestion.id)} className="h-7 px-2 -mr-2 -mt-1">
            উপেক্ষা করুন
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-2">
        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
         {suggestion.originalText && suggestion.replacementText && (
            <div className="mt-2 text-xs">
                <p className="line-through text-destructive">{suggestion.originalText}</p>
                <p className="text-green-600">{suggestion.replacementText}</p>
            </div>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-end">
        <Button size="sm" onClick={() => onFix(suggestion)} className="h-8">
          <Wand2 className="mr-2 h-4 w-4" />
          ঠিক করুন
        </Button>
      </CardFooter>
    </Card>
  );
}
