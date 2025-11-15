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
      <CardHeader>
        <CardTitle className="text-base font-headline">{suggestion.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button size="sm" onClick={() => onFix(suggestion.id)} className="bg-primary text-primary-foreground">
          <Wand2 className="mr-2" />
          Apply Fix
        </Button>
      </CardFooter>
    </Card>
  );
}
