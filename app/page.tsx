'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, ArrowRight, Check, Star, ChevronLeft, ChevronRight,
} from 'lucide-react';
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
  { 
    name: 'Biniyam Aweke', 
    role: 'Senior Data Science Analyst & Freelancer', 
    company: 'ConDigital Technologys PLC',
    companyIcon: '/condigital.jpg',
    photo: '/bini.png',
    text: 'ስሙኒ ዋሌት transformed my financial planning. The AI insights help me make data-driven decisions about my freelance income.', 
    stars: 5 
  },
  { 
    name: 'Omar Murad', 
    role: 'Senior IT Specialist', 
    company: 'Ethio telecom',
    companyIcon: '/ethiotelecom.jpg',
    photo: '/omar.png',
    text: 'Finally a finance app that understands Ethiopian context. The real-time tracking and budget management are exceptional.', 
    stars: 5 
  },
  { 
    name: 'Mikiyas Mesfin', 
    role: 'Software Engineer & Event Organizer', 
    company: 'Harar Ministry of Innovation & Technology',
    companyIcon: '/harar.jpg',
    photo: '/lucho.png',
    text: 'The AI assistant is brilliant! It helps me manage both my salary and event budgets seamlessly. Highly recommended.', 
    stars: 5 
  },
];

const TESTIMONIALS_AM = [
  { 
    name: 'ቢንያም አወቀ', 
    role: 'ሲኒየር ዳታ ሳይንስ አናሊስት እና ፍሪላንሰር', 
    company: 'ኮንዲጂታል ቴክኖሎጂስ ፒኤልሲ',
    companyIcon: '/condigital.jpg',
    photo: '/bini.png',
    text: 'ስሙኒ ዋሌት የፋይናንስ እቅድ አወጣጤን ቀይሮታል። AI ምክሮች ስለ ፍሪላንስ ገቢዬ በመረጃ ላይ የተመሰረተ ውሳኔ እንድወስድ ይረዳኛል።', 
    stars: 5 
  },
  { 
    name: 'ኦማር ሙራድ', 
    role: 'ሲኒየር አይቲ ስፔሻሊስት', 
    company: 'ኢትዮ ቴሌኮም',
    companyIcon: '/ethiotelecom.jpg',
    photo: '/omar.png',
    text: 'በመጨረሻ ኢትዮጵያዊ አውድ የሚረዳ የፋይናንስ አፕ። የእውነተኛ ጊዜ ክትትል እና የበጀት አስተዳደር ልዩ ናቸው።', 
    stars: 5 
  },
  { 
    name: 'ሚኪያስ መስፍን', 
    role: 'ሶፍትዌር ኢንጂኒር እና የዝግጅት አዘጋጅ', 
    company: 'ሐረር የኢኖቬሽን እና ቴክኖሎጂ ሚኒስቴር',
    companyIcon: '/harar.jpg',
    photo: '/lucho.png',
    text: 'AI ረዳቱ አስደናቂ ነው! ደመወዝዬን እና የዝግጅት በጀቶችን በቀላሉ እንድያስተዳድር ይረዳኛል። በጣም እመክራለሁ።', 
    stars: 5 
  },
];

type Testimonial = typeof TESTIMONIALS_EN[0];

function NeuralCardBg({ idx }: { idx: number }) {
  const id = `nc-${idx}`;
  // 5-layer neural network: y positions 12%, 28%, 50%, 72%, 88%
  const layers = [
    [8, 25, 42, 58, 75, 92],
    [5, 20, 35, 50, 65, 80, 95],
    [10, 28, 46, 54, 72, 90],
    [5, 20, 35, 50, 65, 80, 95],
    [8, 25, 42, 58, 75, 92],
  ];
  const ys = [12, 28, 50, 72, 88];
  const lines: { x1: number; y1: number; x2: number; y2: number; em: boolean }[] = [];
  // connect each node to 2 nearest in next layer
  for (let l = 0; l < layers.length - 1; l++) {
    for (const x1 of layers[l]) {
      const sorted = [...layers[l + 1]].sort((a, b) => Math.abs(a - x1) - Math.abs(b - x1));
      sorted.slice(0, 2).forEach(x2 => lines.push({ x1, y1: ys[l], x2, y2: ys[l + 1], em: Math.abs(x1 - x2) < 15 }));
    }
  }
  return (
    <div className="absolute inset-0 opacity-[0.12] pointer-events-none overflow-hidden rounded-[2rem]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`lg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
          <filter id={`glow-${id}`}>
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {lines.map((ln, i) => (
          <line key={i} x1={`${ln.x1}%`} y1={`${ln.y1}%`} x2={`${ln.x2}%`} y2={`${ln.y2}%`}
            stroke={`url(#lg-${id})`} strokeWidth={ln.em ? '0.6' : '0.35'} opacity={ln.em ? '0.9' : '0.5'} />
        ))}
        {layers.map((xs, l) => xs.map((x, ni) => (
          <circle key={`${l}-${ni}`} cx={`${x}%`} cy={`${ys[l]}%`} r={l === 2 ? '1.4' : '1'}
            fill={l % 2 === 0 ? '#34d399' : '#6ee7b7'} opacity="0.9" filter={`url(#glow-${id})`}>
            <animate attributeName="r" values={`${l === 2 ? '1.4' : '1'};${l === 2 ? '2' : '1.6'};${l === 2 ? '1.4' : '1'}`}
              dur={`${2 + (ni % 3) * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur={`${1.5 + (l % 3) * 0.5}s`} repeatCount="indefinite" />
          </circle>
        )))}
      </svg>
    </div>
  );
}

const CARD_W = 420;
const SPEED = 0.04; // px/ms — gentle drift
const NUDGE_MS = 500;
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef    = useRef<number>(0);
  const lastRef   = useRef<number>(0);
  const hoveredRef = useRef(false);
  // nudge state lives inside a ref so the single RAF loop can read it
  const nudgeRef  = useRef<{ from: number; to: number; ts: number } | null>(null);

  const halfWidth = testimonials.length * CARD_W;
  const wrap = (v: number) => ((v % halfWidth) + halfWidth) % halfWidth;

  const nudge = (dir: 'left' | 'right') => {
    const from = offsetRef.current;
    const to   = from + (dir === 'right' ? CARD_W : -CARD_W);
    nudgeRef.current = { from, to, ts: performance.now() };
  };

  useEffect(() => {
    const tick = (now: number) => {
      const dt = lastRef.current ? now - lastRef.current : 0;
      lastRef.current = now;

      if (nudgeRef.current) {
        const { from, to, ts } = nudgeRef.current;
        const p = Math.min((now - ts) / NUDGE_MS, 1);
        offsetRef.current = wrap(from + (to - from) * easeInOut(p));
        if (p >= 1) nudgeRef.current = null;
      } else if (!hoveredRef.current) {
        offsetRef.current = wrap(offsetRef.current + SPEED * dt);
      }

      if (trackRef.current)
        trackRef.current.style.transform = `translateX(${-offsetRef.current}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [halfWidth]);

  return (
    <div className="relative">
      <button
        onClick={() => nudge('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-30 w-12 h-12 rounded-full bg-card/90 border border-accent/30 backdrop-blur-md flex items-center justify-center shadow-xl hover:bg-accent/20 hover:border-accent/60 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5 text-accent" />
      </button>
      <button
        onClick={() => nudge('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-30 w-12 h-12 rounded-full bg-card/90 border border-accent/30 backdrop-blur-md flex items-center justify-center shadow-xl hover:bg-accent/20 hover:border-accent/60 hover:scale-110 active:scale-95 transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5 text-accent" />
      </button>

      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-10 will-change-transform"
          style={{ transform: 'translateX(0px)' }}
          onMouseEnter={() => { hoveredRef.current = true; }}
          onMouseLeave={() => { hoveredRef.current = false; }}
        >
          {[...testimonials, ...testimonials].map(({ name, role, company, companyIcon, photo, text, stars }, idx) => (
            <div
              key={`${name}-${idx}`}
              className="group relative flex-shrink-0 w-[380px]"
              style={{ zIndex: 1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.zIndex = '50'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.zIndex = '1'; }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-emerald-500/20 to-accent/20 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />
              <div className="relative h-full p-8 lg:p-10 rounded-[2rem] border-2 border-border/50 bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-xl shadow-xl hover:border-accent/40 transition-all duration-700 hover:shadow-2xl hover:shadow-accent/20">
                <NeuralCardBg idx={idx} />
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1.5 mb-7">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.4)] transition-all duration-300 group-hover:scale-110" />
                    ))}
                  </div>
                  <p className="text-foreground/90 leading-[1.75] mb-10 text-[15px] min-h-[130px]">
                    <span className="text-accent/50 text-xl font-serif mr-1">"</span>
                    {text}
                    <span className="text-accent/50 text-xl font-serif ml-1">"</span>
                  </p>
                  <div className="relative h-px mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent/30" />
                  </div>
                  <div className="flex items-start gap-5">
                    {/* Photo — zooms OUT of box on hover */}
                    <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
                      <div className="absolute inset-0 rounded-2xl ring-2 ring-accent/25 group-hover:ring-accent/60 transition-all duration-500 shadow-lg overflow-hidden" />
                      <Image
                        src={photo}
                        alt={name}
                        width={80}
                        height={80}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer transition-all duration-500 ease-out"
                        style={{ transformOrigin: 'bottom left', zIndex: 100, position: 'absolute' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(2.5)'; (e.currentTarget as HTMLImageElement).style.zIndex = '200'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLImageElement).style.zIndex = '100'; }}
                      />
                      <div className="absolute inset-0 -z-10 rounded-2xl bg-accent/30 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-base font-bold text-foreground mb-1.5 tracking-tight">{name}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">{role}</p>
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-accent/20 shadow-sm group-hover:ring-accent/40 transition-all duration-300">
                          <Image src={companyIcon} alt={company} width={36} height={36} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-bold text-accent truncate tracking-wide">{company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

      <LandingNavbar />
      <LandingHero />

      <section className="w-full bg-[#020d0a]">
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

        <div className="relative overflow-hidden">
          <NeuralBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020d0a] via-[#041a10] to-[#020d0a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(52,211,153,0.07),transparent)]" />

          <div className="relative z-10 px-6 py-14 flex flex-col items-center text-center gap-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/80 text-[11px] font-semibold uppercase tracking-[0.2em]">{t('bannerOfficial')}</span>
            </div>

            <div className="space-y-3 max-w-2xl">
              <p className="text-white/40 text-base sm:text-lg font-light tracking-wide">{t('bannerTagline')}</p>
              <p className="text-white text-4xl sm:text-6xl font-black tracking-tight leading-none drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">{t('bannerTitle')}</p>
              <p className="text-emerald-400 text-xl sm:text-3xl font-bold tracking-wide">{t('bannerSubtitle')}</p>
            </div>

            <div className="flex items-center gap-3 w-52">
              <div className="flex-1 h-px bg-emerald-500/20" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex-1 h-px bg-emerald-500/20" />
            </div>

            <Link href="/login" className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(52,211,153,0.35)] hover:shadow-[0_0_45px_rgba(52,211,153,0.5)] hover:-translate-y-0.5">
              {t('bannerCTA')} <ArrowRight className="w-4 h-4" />
            </Link>

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

      <LandingFeatures />

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

      <section id="testimonials" className="py-32 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/10 to-emerald-500/10 border border-accent/30 backdrop-blur-md shadow-lg shadow-accent/5">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-xs font-bold text-accent uppercase tracking-[0.15em]">{t('testimonials')}</span>
              <Star className="w-4 h-4 text-accent fill-accent" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tight">{t('lovedByUsers')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t('realPeople')}</p>
          </div>
          
          {/* Infinite scrolling carousel */}
          <div className="px-6 sm:px-8">
            <TestimonialsCarousel testimonials={TESTIMONIALS} />
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-emerald-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 blur-3xl rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-5xl font-bold text-foreground">
            {t('startManaging')} <span className="gradient-text">{t('intelligently')}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{t('joinThousands')}</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-all shadow-2xl shadow-accent/30 hover:-translate-y-1">
            {t('getStartedFree')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
