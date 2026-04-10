'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Sparkles, Target, BarChart3,
  LogOut, Menu, X, ChevronRight, UserCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard, badge: null },
  { href: '/assistant',  label: 'AI Assistant', icon: Sparkles,        badge: 'AI' },
  { href: '/budget',     label: 'Budget',       icon: Target,          badge: null },
  { href: '/analytics',  label: 'Analytics',    icon: BarChart3,       badge: null },
  { href: '/profile',    label: 'Profile',      icon: UserCircle,      badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => { logout(); router.push('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/90 dark:bg-white/10 flex items-center justify-center border border-sidebar-border shadow-sm shadow-black/10 overflow-hidden">
            <img
              src="/favicon.png"
              alt="ስሙኒ ዋሌት"
              className="w-8 h-8"
            />
          </div>
          <div>
            <p className="text-base font-bold text-sidebar-foreground tracking-tight">ስሙኒ ዋሌት</p>
            <p className="text-[10px] text-sidebar-accent-foreground font-medium uppercase tracking-widest">AI Finance</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-accent-foreground">
          Menu
        </p>
        {NAV.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-accent-foreground/20 text-accent-foreground' : 'bg-accent/15 text-accent'
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-sidebar-accent-foreground truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-accent-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-card border border-border shadow-sm"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden animate-fade-in">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
