'use client';

import { useLang } from '@/lib/language-context';
import { Globe, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent via-emerald-400 to-accent rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse" />
      
      {/* Main button */}
      <button
        onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-accent/90 to-emerald-500/90 backdrop-blur-sm border border-accent/20 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
        title={lang === 'en' ? 'Switch to Amharic' : 'Switch to English'}
      >
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Icon with rotation animation */}
        <motion.div
          animate={{ rotate: lang === 'en' ? 0 : 180 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative z-10"
        >
          <Languages className="w-4 h-4 text-white drop-shadow-lg" />
        </motion.div>
        
        {/* Language text with slide animation */}
        <div className="relative z-10 w-8 h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={lang}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg tracking-wider"
            >
              {lang === 'en' ? 'አማ' : 'EN'}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Sparkle effect on hover */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-emerald-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" style={{ animationDelay: '150ms' }} />
      </button>

      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-card border border-border shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        <p className="text-xs font-medium text-foreground">
          {lang === 'en' ? 'Switch to አማርኛ' : 'Switch to English'}
        </p>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-l border-t border-border rotate-45" />
      </div>
    </div>
  );
}
