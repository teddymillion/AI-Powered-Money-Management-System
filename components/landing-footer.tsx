'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';

const PRODUCT_LINKS = [
  { key: 'dashboard',     href: '/dashboard'  },
  { key: 'aiAssistant',   href: '/assistant'  },
  { key: 'analytics',     href: '/analytics'  },
  { key: 'budget',        href: '/budget'     },
  { key: 'notifications', href: '/dashboard'  },
];

export function LandingFooter() {
  const { t } = useLang();
  const { user } = useAuth();

  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-32 bg-accent/5 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">
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
              {t('footerDesc')}
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
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('product')}</p>
            <div className="space-y-2.5">
              {PRODUCT_LINKS.map(({ key, href }) => (
                <Link
                  key={key}
                  href={user ? href : '/login'}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(key as any)}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('company')}</p>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('about')}</Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('terms')}</Link>
              <a href="mailto:tedrosmilion19@gmail.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('contact')}</a>
              <a href="https://t.me/Lataxv7" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t('support')}</a>
            </div>
          </div>
        </div>

        {/* Contact row */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Social / contact links */}
          <div className="flex flex-wrap items-center gap-5">
            <a href="https://t.me/Lataxv7" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <svg className="w-4 h-4 text-[#2AABEE] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
              </svg>
              @Lataxv7
            </a>

            <a href="tel:+251947134309" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <svg className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              +251 947 134 309
            </a>

            <a href="https://github.com/teddymillion" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              teddymillion
            </a>
          </div>

          {/* Copyright + status */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ስሙኒ ዋሌት. {t('builtWithLove')}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('allSystemsOp')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
