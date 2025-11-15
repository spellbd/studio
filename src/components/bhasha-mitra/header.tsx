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
    <header className="flex items-center justify-between p-2 border-b bg-card">
      <div className="flex items-center gap-2">
        <Logo className="h-7 w-7" />
        <h1 className="text-base font-semibold text-primary">
          ভাষা মিত্র
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowSettings}
          aria-label="Settings"
          className="h-8 w-8 p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          onClick={onCheckDocument}
          disabled={isChecking}
          size="sm"
          className="h-8"
        >
          {isChecking ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ScanText />
          )}
          <span>{isChecking ? 'Checking' : 'Check'}</span>
        </Button>
      </div>
    </header>
  );
}
