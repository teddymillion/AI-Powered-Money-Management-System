'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, TrendingUp, Shield, Zap, BarChart3, Target,
  MessageSquare, ArrowRight, Check, Star, ChevronDown,
  Globe, Lock, Brain, PieChart, Bell, Users,
} from 'lucide-react';
import { FinanceIllustration } from '@/components/finance-illustration';

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

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', stored !== 'light');
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
              <Zap className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">ስሙኒ ዋሌት</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-all shadow-md shadow-accent/20">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
                  <Zap className="w-5 h-5 text-accent-foreground" />
                </div>
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
                {['About', 'Privacy Policy', 'Terms of Service', 'Contact', 'Support'].map(item => (
                  <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2025 ስሙኒ ዋሌት. Built with ❤️ in Ethiopia. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
