'use client';

import type { FormattingSuggestion } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface FormattingSuggestionCardProps {
  suggestion: FormattingSuggestion;
  onFix: (id: string) => void;
}

export function FormattingSuggestionCard({ suggestion, onFix }: FormattingSuggestionCardProps) {
  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base font-medium">{suggestion.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-2">
        <p className="text-xs text-muted-foreground">{suggestion.description}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-end">
        <Button size="sm" onClick={() => onFix(suggestion.id)} className="h-7">
          <Wand2 className="mr-2" />
          Apply Fix
        </Button>
      </CardFooter>
    </Card>
  );
}
