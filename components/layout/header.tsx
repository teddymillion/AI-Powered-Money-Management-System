'use client';

import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddTransactionModal } from '@/components/transaction/add-transaction-modal';

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Left - Search (hidden on mobile without sidebar space) */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Add Transaction Button */}
          <AddTransactionModal />
          {/* Notification Bell */}
          <div className="hidden sm:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-secondary"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-sm font-semibold text-accent-foreground">AK</span>
          </div>
        </div>
      </div>
    </header>
  );
}
