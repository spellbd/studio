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
      <CardHeader className="flex flex-row items-start justify-between p-3 pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span className="text-destructive font-semibold">
            "{error.originalWord}"
          </span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onIgnore(error.id)} className="h-7 px-2 -mr-2 -mt-1">
          <X className="h-4 w-4 mr-1" /> উপেক্ষা করুন
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-2">
        <p className="text-sm text-muted-foreground italic mb-3">
          ...{contextParts[0]}<strong className="text-foreground not-italic font-semibold bg-destructive/10 px-1 rounded">{error.originalWord}</strong>{contextParts[1]}...
        </p>
        <div className="flex flex-wrap gap-2">
          {error.suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground text-base py-1 px-3"
              onClick={() => onReplace(error.originalWord, suggestion)}
            >
              <Check className="h-4 w-4 mr-2" />
              {suggestion}
            </Badge>
          ))}
          {error.suggestions.length === 0 && (
            <p className="text-sm text-muted-foreground">কোনো পরামর্শ পাওয়া যায়নি।</p>
          )}
        </div>
      </CardContent>
       <CardFooter className="p-3 pt-2 flex justify-end">
         <Button variant="link" size="sm" onClick={() => onLearn(error.originalWord, error.originalWord)} className="text-sm">
           <Lightbulb className="h-4 w-4 mr-1" /> অভিধানে যোগ করুন
         </Button>
      </CardFooter>
    </Card>
  );
}
