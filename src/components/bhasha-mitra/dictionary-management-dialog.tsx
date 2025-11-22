'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { removeWord } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

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
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleRemoveWord = async (wordToRemove: string) => {
    try {
        await removeWord(wordToRemove);
        const newDictionary = dictionary.filter((word) => word !== wordToRemove);
        onDictionaryUpdate(newDictionary);
        toast({
            title: 'শব্দটি মুছে ফেলা হয়েছে',
            description: `"${wordToRemove}" শব্দটি আপনার ব্যক্তিগত অভিধান থেকে মুছে ফেলা হয়েছে।`,
        });
    } catch (error) {
        console.error("Failed to remove word from DB", error);
        toast({
            variant: 'destructive',
            title: 'ত্রুটি',
            description: 'অভিধান থেকে শব্দটি মুছে ফেলা যায়নি।',
        });
    }
  };

  const filteredDictionary = dictionary.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>অভিধান পরিচালনা করুন</DialogTitle>
          <DialogDescription>
            এখানে আপনার ব্যক্তিগত অভিধানে থাকা শব্দগুলো দেখানো হচ্ছে। আপনি যেকোনো শব্দ অনুসন্ধান বা মুছে ফেলতে পারেন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Input
            placeholder="অভিধানে অনুসন্ধান করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="h-60 w-full rounded-md border">
            <div className="p-4">
              {filteredDictionary.length > 0 ? (
                filteredDictionary.map((word, index) => (
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
                  {dictionary.length === 0 ? 'আপনার অভিধান খালি।' : 'কোনো শব্দ পাওয়া যায়নি।'}
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
