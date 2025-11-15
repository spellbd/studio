'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Globe, WifiOff } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isOnline: boolean;
  onOnlineChange: (isOnline: boolean) => void;
}

export function SettingsPanel({
  isOpen,
  onOpenChange,
  isOnline,
  onOnlineChange,
}: SettingsPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-headline">Settings</SheetTitle>
          <SheetDescription>
            Manage your Bhasha Mitra preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8">
          <div className="flex items-center justify-between rounded-lg border p-4">
             <div className="space-y-0.5">
               <Label htmlFor="online-mode" className="text-base">Online Mode</Label>
               <p className="text-sm text-muted-foreground">
                 Use GenAI for advanced suggestions. Falls back to offline mode if unavailable.
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
