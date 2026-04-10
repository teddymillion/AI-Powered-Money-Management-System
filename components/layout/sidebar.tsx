'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Sparkles, Target, BarChart3,
  LogOut, Menu, ChevronRight, UserCircle, Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSidebar } from '@/lib/sidebar-context';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const NAV = [
  { href: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard, badge: null },
  { href: '/assistant', label: 'AI Assistant', icon: Sparkles,        badge: 'AI' },
  { href: '/budget',    label: 'Budget',       icon: Target,          badge: null },
  { href: '/analytics', label: 'Analytics',    icon: BarChart3,       badge: null },
  { href: '/profile',   label: 'Profile',      icon: UserCircle,      badge: null },
];

export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuth();
  const { collapsed, setCollapsed } = useSidebar();

  // Mobile: drawer open/closed
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials  = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const avatarSrc = user?.avatar ? `${API_BASE}${user.avatar}` : null;

  const handleLogout = () => { logout(); router.push('/login'); };

  // ── Shared nav items ──────────────────────────────────────
  const NavItems = ({ mini }: { mini: boolean }) => (
    <>
      {NAV.map((item) => {
        const Icon     = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            title={mini ? item.label : undefined}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            } ${mini ? 'justify-center' : ''}`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`} />
            {!mini && <span className="flex-1 truncate">{item.label}</span>}
            {!mini && item.badge && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                isActive ? 'bg-accent-foreground/20 text-accent-foreground' : 'bg-accent/15 text-accent'
              }`}>
                {item.badge}
              </span>
            )}
            {!mini && isActive && <ChevronRight className="w-3 h-3 opacity-60 flex-shrink-0" />}
          </Link>
        );
      })}
    </>
  );

  // ── Desktop sidebar ───────────────────────────────────────
  const DesktopSidebar = () => (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex-col z-40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo + burger */}
      <div className={`flex items-center border-b border-sidebar-border h-16 flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
        {/* Logo — links to landing page */}
        <Link
          href="/"
          title="Go to home"
          className={`flex items-center gap-3 flex-1 min-w-0 group ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-accent/40 ring-2 ring-accent/30 group-hover:ring-accent/60 transition-all">
            <img src="/favicon.png" alt="ስሙኒ ዋሌት" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-base font-black text-sidebar-foreground leading-tight tracking-tight truncate">ስሙኒ ዋሌት</p>
              <p className="text-[9px] text-accent font-bold uppercase tracking-widest">AI Finance</p>
            </div>
          )}
        </Link>

        {/* Burger toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all flex-shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-4 space-y-0.5 overflow-y-auto scrollbar-thin ${collapsed ? 'px-2' : 'px-3'}`}>
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-accent-foreground">
            Menu
          </p>
        )}
        <NavItems mini={collapsed} />
      </nav>

      {/* User card */}
      <div className={`border-t border-sidebar-border py-3 space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
        {collapsed ? (
          /* Mini: just avatar */
          <Link
            href="/profile"
            title={user?.name || 'Profile'}
            className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-accent to-accent/60 hover:ring-2 hover:ring-accent/50 transition-all"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-accent-foreground">{initials}</span>
            )}
          </Link>
        ) : (
          /* Expanded: full user card */
          <>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80 transition-all group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent-foreground ring-1 ring-border">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-accent transition-colors">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-sidebar-accent-foreground truncate">{user?.email || ''}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-accent-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        )}
      </div>
    </aside>
  );

  // ── Mobile drawer ─────────────────────────────────────────
  const MobileSidebar = () => (
    <aside className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-accent/40 ring-2 ring-accent/30">
            <img src="/favicon.png" alt="ስሙኒ ዋሌት" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-base font-black text-sidebar-foreground leading-tight tracking-tight">ስሙኒ ዋሌት</p>
            <p className="text-[9px] text-accent font-bold uppercase tracking-widest">AI Finance</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-accent-foreground">Menu</p>
        <NavItems mini={false} />
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
        <Link
          href="/profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent-foreground ring-1 ring-border">
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate group-hover:text-accent transition-colors">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-sidebar-accent-foreground truncate">{user?.email || ''}</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-accent-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(o => !o)}
        className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-card border border-border shadow-sm"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-screen w-64 z-50 lg:hidden animate-fade-in">
            <MobileSidebar />
          </div>
        </>
      )}
    </>
  );
}
