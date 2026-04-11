'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronDown, Check, TrendingUp } from 'lucide-react';
import { useLang } from '@/lib/language-context';
import { FinanceIllustration } from './finance-illustration';

export function LandingHero() {
  const { t } = useLang();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-[-100px] w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-[-100px] w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {t('poweredByLlama')}
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              <span className="gradient-text">ስሙኒ ዋሌት</span>
              <br />
              <span className="text-foreground">{t('smartestWay')}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {t('smartestWayDesc')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
              {t('startForFree')} <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-all">
              {t('seeFeatures')} <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {[t('noCreditCard'), t('freeForever'), t('setupIn2Min')].map(text => (
              <div key={text} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-accent" /> {text}
              </div>
            ))}
          </div>
        </div>

        {/* Right — illustration */}
        <div className="relative animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent via-accent/80 to-emerald-700 p-8 shadow-2xl shadow-accent/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
            <FinanceIllustration />
          </div>
          
          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl animate-float">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">{t('aiActive')}</span>
            </div>
            <p className="text-lg font-bold text-accent mt-0.5">+ETB 13,300</p>
            <p className="text-[10px] text-muted-foreground">{t('savedThisMonth')}</p>
          </div>
          
          <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
            <p className="text-[10px] text-muted-foreground mb-1">{t('savingsRate')}</p>
            <p className="text-lg font-bold text-foreground">54.3%</p>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
              <TrendingUp className="w-3 h-3" /> +12% {t('vsLastMonth')}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-xs">{t('scrollToExplore')}</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  );
}
