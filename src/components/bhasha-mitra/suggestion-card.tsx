'use client';

import type { SpellingError } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Check, X } from 'lucide-react';

interface SuggestionCardProps {
  error: SpellingError;
  onReplace: (original: string, replacement: string) => void;
  onIgnore: (id: string) => void;
  onLearn: (original: string, learned: string) => void;
}

export function SuggestionCard({ error, onReplace, onIgnore, onLearn }: SuggestionCardProps) {
  const contextParts = error.context.split(error.originalWord);
  
  return (
    <Card className="transition-all duration-300 ease-in-out">
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span className="text-destructive font-semibold">
            "{error.originalWord}"
          </span>
          <Button variant="ghost" size="sm" onClick={() => onIgnore(error.id)} className="h-7 px-2">
            <X className="h-4 w-4 mr-1" /> Ignore
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-2">
        <p className="text-xs text-muted-foreground italic mb-2">
          ...{contextParts[0]}<strong className="text-foreground not-italic font-semibold">{error.originalWord}</strong>{contextParts[1]}...
        </p>
        <div className="flex flex-wrap gap-2">
          {error.suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => onReplace(error.originalWord, suggestion)}
            >
              <Check className="h-3 w-3 mr-1" />
              {suggestion}
            </Badge>
          ))}
          {error.suggestions.length === 0 && (
            <p className="text-xs text-muted-foreground">No suggestions found.</p>
          )}
        </div>
      </CardContent>
       <CardFooter className="p-3 pt-0 flex justify-end">
         <Button variant="link" size="sm" onClick={() => onLearn(error.originalWord, error.originalWord)} className="text-xs">
           <Lightbulb className="h-3 w-3 mr-1" /> Add to Dictionary
         </Button>
      </CardFooter>
    </Card>
  );
}
