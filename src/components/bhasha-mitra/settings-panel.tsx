'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Globe, WifiOff, KeyRound, Sun, Moon, Eye, EyeOff } from 'lucide-react';
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
}

export function SettingsPanel({
  isOpen,
  onOpenChange,
  isOnline,
  onOnlineChange,
  apiKey,
  onApiKeyChange,
}: SettingsPanelProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSaveApiKey = () => {
    onApiKeyChange(localApiKey);
  };
  
  const handleRemoveApiKey = () => {
    setLocalApiKey('');
    onApiKeyChange(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">Settings</SheetTitle>
          <SheetDescription>
            Manage your Bhasha Mitra preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8 space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes.
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
              <Label htmlFor="online-mode" className="text-base">Online Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use GenAI for advanced suggestions.
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
              <Label htmlFor="api-key" className="text-base flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Gemini API Key
              </Label>
              <p className="text-sm text-muted-foreground">
                Your key is stored locally and securely.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            <div className="flex gap-2">
                <Button onClick={handleSaveApiKey} className="w-full">Save Key</Button>
                {apiKey && <Button onClick={handleRemoveApiKey} variant="destructive" className="w-full">Remove Key</Button>}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
