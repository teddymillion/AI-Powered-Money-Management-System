'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, TrendingUp, Shield, Zap, BarChart3, Target,
  MessageSquare, ArrowRight, Check, Star, ChevronDown,
  Globe, Lock, Brain, PieChart, Bell, Users, LogOut, LayoutDashboard,
} from 'lucide-react';
import { FinanceIllustration } from '@/components/finance-illustration';
import { useAuth } from '@/lib/auth-context';

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

const FEATURES = [
  { icon: Brain,       title: 'AI-Powered Insights',     desc: 'Llama 3.3 analyses your spending patterns and delivers personalised financial recommendations in real time.' },
  { icon: BarChart3,   title: 'Advanced Analytics',       desc: 'Interactive charts and trend analysis across weekly, monthly, and yearly timeframes.' },
  { icon: Target,      title: 'Smart Budget Goals',       desc: 'Set savings goals, track progress, and get AI nudges when you\'re off track.' },
  { icon: Bell,        title: 'Smart Notifications',      desc: 'Get alerted for unusual spending, goal milestones, and monthly summaries.' },
  { icon: MessageSquare, title: 'AI Chat Assistant',      desc: 'Ask anything about your finances and get instant, context-aware answers.' },
  { icon: Shield,      title: 'Bank-Grade Security',      desc: 'JWT authentication, OTP verification, and encrypted data storage.' },
  { icon: PieChart,    title: 'Spending Breakdown',       desc: 'Visual category breakdowns so you always know where your money goes.' },
  { icon: Globe,       title: 'ETB Native Support',       desc: 'Built for Ethiopia — all amounts in Ethiopian Birr with local context.' },
];

const STATS = [
  { value: '50K+', label: 'Transactions Tracked' },
  { value: '99.9%', label: 'Uptime Guaranteed' },
  { value: '3s',   label: 'Avg AI Response' },
  { value: 'Free', label: 'To Get Started' },
];

const TESTIMONIALS = [
  { name: 'Abebe Kebede',   role: 'Software Engineer, Addis Ababa', text: 'ስሙኒ ዋሌት changed how I manage my salary. The AI insights are incredibly accurate.', stars: 5 },
  { name: 'Tigist Haile',   role: 'Freelance Designer',             text: 'Finally a finance app that understands Ethiopian context. The budget tracking is perfect.', stars: 5 },
  { name: 'Dawit Tesfaye',  role: 'Business Owner',                 text: 'The AI assistant answered questions I\'d been asking my accountant for years. Brilliant.', stars: 5 },
];

function CountUp({ target, suffix = '' }: { target: string; suffix?: string }) {
  return <span>{target}{suffix}</span>;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', stored !== 'light');
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/favicon.png" alt="ስሙኒ ዋሌት" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-foreground">ስሙኒ ዋሌት</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>

          {/* Right side — auth-aware */}
          {!isLoading && (
            <div className="flex items-center gap-3">
              {user ? (
                /* ── Logged-in state ── */
                <div className="relative" ref={menuRef}>
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
                      <p className="text-[10px] text-muted-foreground mt-0.5">Logged in</p>
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
                        <LayoutDashboard className="w-4 h-4 text-accent" /> Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[9px] font-bold text-accent">
                          {user.name[0].toUpperCase()}
                        </div>
                        Profile
                      </Link>
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Guest state ── */
                <>
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                    Sign In
                  </Link>
                  <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-all shadow-md shadow-accent/20">
                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
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
              Powered by Llama 3.3 AI · Free to use
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                <span className="gradient-text">ስሙኒ ዋሌት</span>
                <br />
                <span className="text-foreground">AI Money</span>
                <br />
                <span className="text-foreground">Management</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                The smartest way to track your income, expenses, and savings — with real-time AI insights that actually understand your financial life.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all shadow-xl shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5">
                Start for Free <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-all">
                See Features <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {['No credit card required', 'Free forever plan', 'Setup in 2 minutes'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-accent" /> {t}
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
                <span className="text-xs font-semibold text-foreground">AI Active</span>
              </div>
              <p className="text-lg font-bold text-accent mt-0.5">+ETB 13,300</p>
              <p className="text-[10px] text-muted-foreground">Saved this month</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
              <p className="text-[10px] text-muted-foreground mb-1">Savings Rate</p>
              <p className="text-lg font-bold text-foreground">54.3%</p>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                <TrendingUp className="w-3 h-3" /> +12% vs last month
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

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
              <span className="text-emerald-400/80 text-[11px] font-semibold uppercase tracking-[0.2em]">ስሙኒ ዋሌት · Official</span>
            </div>

            {/* Tagline */}
            <div className="space-y-3 max-w-2xl">
              <p className="text-white/40 text-base sm:text-lg font-light tracking-wide">
                ባዶነት ወጪን ካለማወቅ ይጀምራል፤
              </p>
              <p className="text-white text-4xl sm:text-6xl font-black tracking-tight leading-none drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                ስሙኒ ዋሌት
              </p>
              <p className="text-emerald-400 text-xl sm:text-3xl font-bold tracking-wide">
                ዘመናዊው የወጪዎ መሪ!
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
              ይጀምሩ — ነፃ ነው <ArrowRight className="w-4 h-4" />
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
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Everything you need
            </div>
            <h2 className="text-4xl font-bold text-foreground">Built for modern finance</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Every feature designed to give you complete control and clarity over your financial life.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-200">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Up and running in minutes</h2>
            <p className="text-muted-foreground">Three simple steps to financial clarity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create your account', desc: 'Register with email, verify with OTP, and you\'re in. No credit card needed.' },
              { step: '02', title: 'Add your transactions', desc: 'Log income and expenses by category. Import or add manually in seconds.' },
              { step: '03', title: 'Get AI insights', desc: 'Our AI analyses your data and delivers personalised recommendations instantly.' },
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
            <h2 className="text-4xl font-bold text-foreground">Loved by users</h2>
            <p className="text-muted-foreground">Real people, real results.</p>
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
            Start managing your money <span className="gradient-text">intelligently</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of Ethiopians who trust ስሙኒ ዋሌት to manage their finances.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-all shadow-2xl shadow-accent/30 hover:-translate-y-1">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative border-t border-border overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-32 bg-accent/5 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/favicon.png" alt="ስሙኒ ዋሌት" width={40} height={40} className="rounded-xl" />
                <div>
                  <p className="text-lg font-bold text-foreground">ስሙኒ ዋሌት</p>
                  <p className="text-xs text-muted-foreground">AI-Powered Money Management</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                The most intelligent personal finance platform built for Ethiopia. Track, analyse, and grow your wealth with the power of AI.
              </p>
              <div className="flex gap-3">
                {['PCI-DSS', 'SOC2', 'AES-256'].map(badge => (
                  <span key={badge} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border px-2.5 py-1 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product</p>
              <div className="space-y-2.5">
                {['Dashboard', 'AI Assistant', 'Analytics', 'Budget Goals', 'Notifications'].map(item => (
                  <Link key={item} href="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company</p>
              <div className="space-y-2.5">
                <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <a href="mailto:tedrosmilion19@gmail.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                <a href="https://t.me/Lataxv72" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Social / contact links */}
            <div className="flex flex-wrap items-center gap-5">
              {/* Telegram */}
              <a
                href="https://t.me/Lataxv7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <svg className="w-4 h-4 text-[#2AABEE] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
                </svg>
                @Lataxv7
              </a>

              {/* Phone */}
              <a
                href="tel:+251947134309"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <svg className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                +251 947 134 309
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/teddymillion"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                teddymillion
              </a>
            </div>

            {/* Copyright + status */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} ስሙኒ ዋሌት. Built with ❤️ in Ethiopia by Teddy.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
