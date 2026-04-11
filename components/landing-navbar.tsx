'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, LayoutDashboard, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { LanguageToggle } from './language-toggle';

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLoading } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/favicon.png" alt="ስሙኒ ዋሌት" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-bold text-foreground">ስሙኒ ዋሌት</span>
        </div>

        {/* Nav links desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">{t('features')}</a>
          <a href="#how" className="hover:text-foreground transition-colors">{t('howItWorks')}</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">{t('reviews')}</a>
        </div>

        {/* Right side */}
        {!isLoading && (
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <button onClick={() => setMobileNavOpen(o => !o)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileNavOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
            
            {user ? (
              <div className="relative hidden sm:block" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border hover:bg-secondary transition-all"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:4000${user.avatar}`}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-[11px] font-bold text-accent-foreground">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-foreground leading-none">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t('loggedIn')}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-xl py-1 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-accent" /> {t('dashboard')}
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[9px] font-bold text-accent">
                        {user.name[0].toUpperCase()}
                      </div>
                      {t('profile')}
                    </Link>
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> {t('signOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('signIn')}</Link>
                <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-all shadow-md shadow-accent/20">
                  {t('getStarted')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3 space-y-1 animate-fade-in">
          <a href="#features" onClick={() => setMobileNavOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">{t('features')}</a>
          <a href="#how" onClick={() => setMobileNavOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">{t('howItWorks')}</a>
          <a href="#testimonials" onClick={() => setMobileNavOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">{t('reviews')}</a>
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileNavOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-all">{t('dashboard')}</Link>
                <button onClick={() => { logout(); setMobileNavOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all">{t('signOut')}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileNavOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">{t('signIn')}</Link>
                <Link href="/login" onClick={() => setMobileNavOpen(false)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold">{t('getStarted')} <ArrowRight className="w-3.5 h-3.5" /></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
