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
    <header className="flex items-center justify-between p-3 border-b bg-card">
      <div className="flex items-center gap-2">
        <Logo className="h-7 w-7" />
        <h1 className="text-lg font-semibold text-primary">
          ভাষা মিত্র
        </h1>
      </div>
      <div className="flex items-center gap-1">
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
          size="sm"
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
