'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ScanText, Settings, LoaderCircle } from 'lucide-react';

interface HeaderProps {
  onCheckDocument: () => void;
  onShowSettings: () => void;
  isChecking: boolean;
}

export function Header({ onCheckDocument, onShowSettings, isChecking }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <Logo className="h-8 w-8" />
        <h1 className="text-xl font-headline font-bold text-primary">
          ভাষা মিত্র
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowSettings}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          onClick={onCheckDocument}
          disabled={isChecking}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isChecking ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ScanText />
          )}
          <span>{isChecking ? 'Checking...' : 'Check Document'}</span>
        </Button>
      </div>
    </header>
  );
}
