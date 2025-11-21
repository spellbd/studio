'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Globe, WifiOff, KeyRound, Sun, Moon, Eye, EyeOff, BookCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isOnline: boolean;
  onOnlineChange: (isOnline: boolean) => void;
  apiKey: string | null;
  onApiKeyChange: (apiKey: string | null) => void;
  onManageDictionary: () => void;
}

export function SettingsPanel({
  isOpen,
  onOpenChange,
  isOnline,
  onOnlineChange,
  apiKey,
  onApiKeyChange,
  onManageDictionary,
}: SettingsPanelProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">সেটিংস</SheetTitle>
          <SheetDescription>
            আপনার ভাষা মিত্র পছন্দগুলি পরিচালনা করুন।
          </SheetDescription>
        </SheetHeader>
        <div className="py-8 space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">ডার্ক মোড</Label>
              <p className="text-sm text-muted-foreground">
                লাইট এবং ডার্ক থিমের মধ্যে পরিবর্তন করুন।
              </p>
            </div>
            <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="text-primary" /> : <Sun className="text-primary" />}
                <Switch
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="online-mode" className="text-base">অনলাইন মোড</Label>
              <p className="text-sm text-muted-foreground">
                উন্নত পরামর্শের জন্য GenAI ব্যবহার করুন।
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? <Globe className="text-green-500" /> : <WifiOff className="text-muted-foreground" />}
              <Switch
                  id="online-mode"
                  checked={isOnline}
                  onCheckedChange={onOnlineChange}
              />
            </div>
          </div>
          
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                    <BookCheck className="h-5 w-5 text-primary" />
                    ব্যক্তিগত অভিধান
                </Label>
                <p className="text-sm text-muted-foreground">
                    আপনার ব্যক্তিগত অভিধানে শব্দ যোগ করুন বা মুছে ফেলুন।
                </p>
            </div>
            <Button onClick={onManageDictionary} className="w-full">অভিধান পরিচালনা করুন</Button>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="api-key" className="text-base flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Gemini API কী
              </Label>
              <p className="text-sm text-muted-foreground">
                আপনার কী স্থানীয়ভাবে এবং নিরাপদে সংরক্ষিত থাকে।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey || ''}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="আপনার API কী লিখুন"
              />
              <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            <div className="flex gap-2">
                {apiKey && <Button onClick={() => onApiKeyChange(null)} variant="destructive" className="w-full">কী মুছে ফেলুন</Button>}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
