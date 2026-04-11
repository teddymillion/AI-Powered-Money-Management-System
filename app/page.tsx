'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, TrendingUp, ArrowRight, Check, Star, ChevronDown,
} from 'lucide-react';
import { FinanceIllustration } from '@/components/finance-illustration';
import { LandingNavbar } from '@/components/landing-navbar';
import { LandingHero } from '@/components/landing-hero';
import { LandingFeatures } from '@/components/landing-features';
import { LandingFooter } from '@/components/landing-footer';
import { useLang } from '@/lib/language-context';

function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 60;
    const CONNECT_DIST = 130;
    type Node = { x: number; y: number; vx: number; vy: number; pulse: number };
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        n.pulse += 0.03;
        const r = 2.5 + Math.sin(n.pulse) * 1;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        glow.addColorStop(0, 'rgba(52,211,153,0.9)');
        glow.addColorStop(1, 'rgba(52,211,153,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52,211,153,0.95)';
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

const STATS_EN = [
  { value: '50K+', label: 'Transactions Tracked' },
  { value: '99.9%', label: 'Uptime Guaranteed' },
  { value: '3s', label: 'Avg AI Response' },
  { value: 'Free', label: 'To Get Started' },
];

const STATS_AM = [
  { value: '50K+', label: 'የተከታተሉ ግብይቶች' },
  { value: '99.9%', label: 'የተዋለ አገልግሎት' },
  { value: '3s', label: 'አማካይ AI ምላሽ' },
  { value: 'ነፃ', label: 'ለመጀምር' },
];

const TESTIMONIALS_EN = [
  { name: 'Abebe Kebede', role: 'Software Engineer, Addis Ababa', text: 'ስሙኒ ዋሌት changed how I manage my salary. The AI insights are incredibly accurate.', stars: 5 },
  { name: 'Tigist Haile', role: 'Freelance Designer', text: 'Finally a finance app that understands Ethiopian context. The budget tracking is perfect.', stars: 5 },
  { name: 'Dawit Tesfaye', role: 'Business Owner', text: 'The AI assistant answered questions I\'d been asking my accountant for years. Brilliant.', stars: 5 },
];

const TESTIMONIALS_AM = [
  { name: 'አበበ ከበደ', role: 'ሶፍትዌር ኢንጂኒር፣ አዲስ አበባ', text: 'ስሙኒ ዋሌት ደመወዘይን የማስተዳደር መንገዴ ቀይሮታል። AI ምክሮች በጣም ትክክል ናቸው።', stars: 5 },
  { name: 'ጥግስት ሃይለ', role: 'ነፃ ዲዛይነር', text: 'በመጨረሻ ኢትዮጵያዊ አውድ የሚረዳ የፋይናንስ አፕ። የበጀት ክትተሉ ፍጹም ነው።', stars: 5 },
  { name: 'ዳዊት ተስፋየ', role: 'የብዝኔስ ባለቤት', text: 'AI ረዳቱ ለዓማቶች ከአካውንተኛኬ የመጠየቅሁትን ጥያቄዎች መለሰል። አስደናቂ!', stars: 5 },
];

export default function LandingPage() {
  const { t, lang } = useLang();
  const STATS = lang === 'am' ? STATS_AM : STATS_EN;
  const TESTIMONIALS = lang === 'am' ? TESTIMONIALS_AM : TESTIMONIALS_EN;

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', stored !== 'light');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navbar ── */}
      <LandingNavbar />

      {/* ── Hero ── */}
      <LandingHero />

      {/* ── Advertisement Banner ── */}
      <section className="w-full bg-[#020d0a]">

        {/* Image — full width, full quality, no crop */}
        <div className="w-full">
          <Image
            src="/simuni wallet.png"
            alt="ስሙኒ ዋሌት"
            width={1151}
            height={488}
            priority
            unoptimized
            className="w-full h-auto block"
          />
        </div>

        {/* Neural network text panel */}
        <div className="relative overflow-hidden">
          {/* Animated neural canvas */}
          <NeuralBackground />

          {/* Deep gradient base so canvas blends with image above */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020d0a] via-[#041a10] to-[#020d0a]" />

          {/* Radial accent glow behind text */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(52,211,153,0.07),transparent)]" />

          {/* Content */}
          <div className="relative z-10 px-6 py-14 flex flex-col items-center text-center gap-6">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/80 text-[11px] font-semibold uppercase tracking-[0.2em]">{t('bannerOfficial')}</span>
            </div>

            {/* Tagline */}
            <div className="space-y-3 max-w-2xl">
              <p className="text-white/40 text-base sm:text-lg font-light tracking-wide">
                {t('bannerTagline')}
              </p>
              <p className="text-white text-4xl sm:text-6xl font-black tracking-tight leading-none drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                {t('bannerTitle')}
              </p>
              <p className="text-emerald-400 text-xl sm:text-3xl font-bold tracking-wide">
                {t('bannerSubtitle')}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 w-52">
              <div className="flex-1 h-px bg-emerald-500/20" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex-1 h-px bg-emerald-500/20" />
            </div>

            {/* CTA */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(52,211,153,0.35)] hover:shadow-[0_0_45px_rgba(52,211,153,0.5)] hover:-translate-y-0.5"
            >
              {t('bannerCTA')} <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-1">
              {['AI-Powered', 'ETB Native', 'Bank-Grade Security', 'Free to Start'].map(tag => (
                <div key={tag} className="flex items-center gap-1.5 text-white/30 text-[11px] font-semibold uppercase tracking-widest">
                  <Check className="w-3 h-3 text-emerald-500" /> {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-bold gradient-text">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <LandingFeatures />

      {/* ── How it works ── */}
      <section id="how" className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">{t('upAndRunning')}</h2>
            <p className="text-muted-foreground">{t('threeSteps')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: t('step1'), desc: t('step1Desc') },
              { step: '02', title: t('step2'), desc: t('step2Desc') },
              { step: '03', title: t('step3'), desc: t('step3Desc') },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative p-8 rounded-2xl border border-border bg-card text-center">
                <div className="text-6xl font-black gradient-text opacity-20 mb-4">{step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">{t('lovedByUsers')}</h2>
            <p className="text-muted-foreground">{t('realPeople')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, stars }) => (
              <div key={name} className="p-6 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-xs font-bold text-accent-foreground">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-emerald-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 blur-3xl rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-5xl font-bold text-foreground">
            {t('startManaging')} <span className="gradient-text">{t('intelligently')}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('joinThousands')}
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-all shadow-2xl shadow-accent/30 hover:-translate-y-1">
            {t('getStartedFree')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <LandingFooter />
    </div>
  );
}
