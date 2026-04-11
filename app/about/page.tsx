'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { useLang } from '@/lib/language-context';
import { LanguageToggle } from '@/components/language-toggle';

export default function AboutPage() {
  const { t, lang } = useLang();

  const features = lang === 'am' ? [
    { title: 'AI ምክሮች', desc: 'Llama 3.3 ግብይቶችዎን ይተነትናል እና ግላዊ ምክሮችን በቅጽበት ያቀርባል።' },
    { title: 'ETB ተወላጅ', desc: 'እያንዳንዱ አሁን በኢትዮጵያ ብር ነው። ምንም ልወጣ የለም፣ ምንም መመሳታት የለም — ለአካባቢያዊ አውድ የተገነባ።' },
    { title: 'የበጀት ግቦች', desc: 'የቁጠባ ዒላማዎችን ያስቀምጡ፣ እድገትን ይከታተሉ እና ከመንገድ ሲወጡ ማስታወሻዎችን ያግኙ።' },
    { title: 'የባንክ ደረጃ ደህንነት', desc: 'JWT ማረጋገጫ፣ OTP ማረጋገጫ እና AES-256 የተመሰጠረ ማከማቻ ውሂብዎን ይጠብቃል።' },
  ] : [
    { title: 'AI Insights', desc: 'Llama 3.3 analyses your transactions and delivers personalised recommendations in real time.' },
    { title: 'ETB Native', desc: 'Every figure is in Ethiopian Birr. No conversions, no confusion — built for local context.' },
    { title: 'Budget Goals', desc: 'Set savings targets, track progress, and get nudged when you drift off course.' },
    { title: 'Bank-Grade Security', desc: 'JWT auth, OTP verification, and AES-256 encrypted storage protect your data.' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Header ── */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="flex items-center gap-2">
              <Image src="/favicon.png" alt="ስሙኒ ዋሌት" width={24} height={24} className="rounded-md" />
              <span className="text-sm font-semibold text-foreground">ስሙኒ ዋሌት</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">

        {/* ── Hero ── */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">{t('aboutPageTitle')}</p>
          <h1 className="text-4xl font-bold text-foreground">{t('aboutHeroTitle')}</h1>
          <p className="text-muted-foreground leading-relaxed text-base max-w-xl">
            {t('aboutHeroDesc')}
          </p>
        </div>

        {/* ── Mission ── */}
        <div className="p-8 rounded-2xl border border-border bg-card space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{t('ourMission')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('ourMissionText')}
          </p>
        </div>

        {/* ── What we built ── */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">{t('whatWeBuilt')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ title, desc }) => (
              <div key={title} className="p-5 rounded-xl border border-border bg-card/50 space-y-1.5">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Developer Card ── */}
        <div className="relative rounded-3xl border border-border bg-card overflow-hidden">
          {/* Background glow blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-accent/5 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-10">

            {/* Photo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              {/* Glow ring + circle */}
              <div className="relative group cursor-default">
                {/* Outer animated glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-emerald-400 to-accent/40 blur-xl opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500" />
                {/* Spinning gradient border */}
                <div className="relative w-44 h-44 rounded-full p-[3px] bg-gradient-to-br from-accent via-emerald-300 to-accent/50 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_40px_rgba(52,211,153,0.25)] group-hover:shadow-[0_0_70px_rgba(52,211,153,0.55)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-card">
                    <Image
                      src="/teddy.jpg"
                      alt="Tewodros Million"
                      width={176}
                      height={176}
                      unoptimized
                      className="w-full h-full object-cover object-top rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                {/* Online badge */}
                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-card shadow-lg shadow-emerald-500/50" />
              </div>

              {/* Tags below photo */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-semibold uppercase tracking-wider">
                  Software Engineer
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
                  Future Founder
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5 text-center sm:text-left">
              {/* Name + alias */}
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Tewodros Million</h2>
                  <span className="px-2.5 py-0.5 rounded-lg bg-secondary border border-border text-muted-foreground text-xs font-bold tracking-widest">BoB</span>
                </div>
                <p className="text-accent font-semibold text-sm">@teddymillion</p>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                A passionate software engineer from Ethiopia with <span className="text-foreground font-medium">2+ years of experience</span> building full-stack products. Creator of ስሙኒ ዋሌት — on a mission to make financial intelligence accessible to every Ethiopian through the power of AI.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                {[
                  { value: '2+', label: 'Years Experience' },
                  { value: '10+', label: 'Projects Built' },
                  { value: '1', label: 'Vision: ስሙኒ' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center sm:text-left">
                    <p className="text-xl font-black text-accent">{value}</p>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
                <a
                  href="https://github.com/teddymillion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <a
                  href="mailto:tedrosmilion19@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all"
                >
                  <Mail className="w-4 h-4 text-accent" />
                  Gmail
                </a>
                <a
                  href="https://t.me/Lataxv7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary/50 text-sm text-muted-foreground hover:text-foreground hover:border-[#2AABEE]/40 hover:bg-[#2AABEE]/5 transition-all"
                >
                  <svg className="w-4 h-4 text-[#2AABEE]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
                  </svg>
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service →
          </Link>
        </div>

      </div>
    </div>
  );
}
