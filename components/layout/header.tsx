'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Search } from 'lucide-react';
import { AddTransactionModal } from '@/components/transaction/add-transaction-modal';
import { NotificationPanel } from '@/components/notifications/notification-panel';
import { useAuth } from '@/lib/auth-context';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function Header() {
  const { user } = useAuth();
  const router   = useRouter();
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

  const initials  = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const avatarSrc = user?.avatar ? `${API_BASE}${user.avatar}` : null;

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
          <AddTransactionModal />

          {/* Theme toggle */}
          <button onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <NotificationPanel />

          {/* Avatar → profile */}
          <button
            onClick={() => router.push('/profile')}
            title="View profile"
            className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center hover:shadow-lg hover:shadow-accent/20 hover:scale-105 transition-all duration-200 text-xs font-bold text-accent-foreground flex-shrink-0"
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              : initials
            }
          </button>
        </div>
      </div>
    </header>
  );
}
