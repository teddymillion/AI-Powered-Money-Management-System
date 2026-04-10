'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Bell, Search } from 'lucide-react';
import { AddTransactionModal } from '@/components/transaction/add-transaction-modal';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="h-16 sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="h-full px-4 lg:px-8 flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Add Transaction */}
          <AddTransactionModal />

          {/* Theme */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            {isDark
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          {/* Bell */}
          <button
            title="Notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 text-xs font-bold text-accent-foreground">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
