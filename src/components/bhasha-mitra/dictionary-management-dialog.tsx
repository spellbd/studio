'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';

interface DictionaryManagementDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  dictionary: string[];
  onDictionaryUpdate: (newDictionary: string[]) => void;
}

export function DictionaryManagementDialog({
  isOpen,
  onOpenChange,
  dictionary,
  onDictionaryUpdate,
}: DictionaryManagementDialogProps) {

  const handleRemoveWord = (wordToRemove: string) => {
    const newDictionary = dictionary.filter((word) => word !== wordToRemove);
    onDictionaryUpdate(newDictionary);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>অভিধান পরিচালনা করুন</DialogTitle>
          <DialogDescription>
            এখানে আপনার ব্যক্তিগত অভিধানে থাকা শব্দগুলো দেখানো হচ্ছে। আপনি যেকোনো শব্দ মুছে ফেলতে পারেন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
              {dictionary.length > 0 ? (
                dictionary.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <span className="text-sm font-medium">{word}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveWord(word)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-10">
                  আপনার অভিধান খালি।
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>বন্ধ করুন</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
