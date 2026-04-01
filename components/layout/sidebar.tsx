'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, BarChart3, Zap, Target, MessageSquare, Home } from 'lucide-react';

const NAVIGATION_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  { href: '/budget', label: 'Budget & Goals', icon: Target },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out ${
          isOpen ? 'w-64' : 'w-0'
        } lg:w-64 z-40 overflow-hidden lg:overflow-visible`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-8 pt-2">
            <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
              <Zap className="w-6 h-6 text-sidebar-primary" />
              FinFlow
            </h1>
            <p className="text-xs text-sidebar-accent-foreground mt-1">Personal Finance AI</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-sidebar-border">
            <div className="px-4 py-3 rounded-lg bg-sidebar-accent bg-opacity-50">
              <p className="text-xs text-sidebar-accent-foreground mb-2">Account</p>
              <p className="text-sm font-medium text-sidebar-foreground">Abebe Kebede</p>
              <p className="text-xs text-sidebar-accent-foreground">abebe@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
