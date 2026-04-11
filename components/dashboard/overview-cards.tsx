'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, Pencil, X, Check, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLang } from '@/lib/language-context';

interface OverviewCardsProps {
  income: number; expenses: number; savings: number; balance: number; loading?: boolean;
}

const INCOME_KEY  = 'override_income';
const EXPENSE_KEY = 'override_expense';

function useOverride(key: string) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== null) setValue(Number(stored));
  }, [key]);

  const set = (v: number) => {
    localStorage.setItem(key, String(v));
    setValue(v);
  };
  const clear = () => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return { value, set, clear, hasOverride: value !== null };
}

function EditPopover({
  label, current, onSave, onClear, hasOverride, onClose,
}: {
  label: string; current: number; onSave: (v: number) => void;
  onClear: () => void; hasOverride: boolean; onClose: () => void;
}) {
  const { t } = useLang();
  const [input, setInput] = useState(String(current));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(input);
    if (!isNaN(n) && n >= 0) { onSave(n); onClose(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 right-0 sm:right-auto sm:w-64 mt-2 z-50 rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider">{t('edit')} {label}</p>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">{t('etb')}</span>
          <input
            ref={inputRef}
            type="number"
            min="0"
            step="0.01"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-secondary border border-border rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/90 transition-all active:scale-95">
            <Check className="w-3.5 h-3.5" /> {t('saveChanges')}
          </button>
          {hasOverride && (
            <button type="button" onClick={() => { onClear(); onClose(); }}
              className="w-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
              title="Reset to actual">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {hasOverride && (
          <p className="text-[10px] text-muted-foreground text-center">
            {t('actualValue')}: {t('etb')} {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(current)}
          </p>
        )}
      </form>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/70">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-9 w-9 rounded-xl" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="skeleton h-8 w-28 rounded" />
        <div className="skeleton h-2 w-20 rounded-full" />
      </CardContent>
    </Card>
  );
}

export function OverviewCards({ income, expenses, savings, balance, loading = false }: OverviewCardsProps) {
  const { t } = useLang();
  const incomeOverride  = useOverride(INCOME_KEY);
  const expenseOverride = useOverride(EXPENSE_KEY);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  // Close popover on outside click
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditingIdx(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const cards = [
    {
      label: t('totalBalance'), amount: balance,
      icon: Wallet, iconBg: 'bg-accent/15', iconColor: 'text-accent',
      gradient: 'from-accent/10 via-transparent to-transparent',
      editable: false, override: null,
    },
    {
      label: t('monthlyIncome'), amount: income,
      icon: ArrowUpRight, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-500',
      gradient: 'from-emerald-500/10 via-transparent to-transparent',
      editable: true, override: incomeOverride,
    },
    {
      label: t('totalExpenses'), amount: expenses,
      icon: ArrowDownLeft, iconBg: 'bg-red-500/15', iconColor: 'text-red-500',
      gradient: 'from-red-500/10 via-transparent to-transparent',
      editable: true, override: expenseOverride,
    },
    {
      label: t('netSavings'), amount: savings,
      icon: TrendingUp, iconBg: 'bg-blue-500/15', iconColor: 'text-blue-500',
      gradient: 'from-blue-500/10 via-transparent to-transparent',
      editable: false, override: null,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon        = card.icon;
        const displayAmt  = card.override?.hasOverride ? card.override.value! : card.amount;
        const formatted   = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.abs(displayAmt));
        const isNegative  = displayAmt < 0;
        const isEditing   = editingIdx === i;

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="group relative"
          >
            <Card className="relative overflow-visible rounded-2xl border-border/70 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-70 rounded-2xl`} />
              <CardHeader className="relative pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest truncate">
                        {card.label}
                      </CardTitle>
                      {card.override?.hasOverride && (
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" title="Manually set" />
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-background/70 text-[10px] uppercase tracking-widest">
                      {t('thisMonth')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {card.editable && (
                      <button
                        onClick={() => setEditingIdx(isEditing ? null : i)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ${
                          isEditing
                            ? 'bg-accent text-accent-foreground'
                            : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        title={`Edit ${card.label}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                    <div className={`${card.iconBg} p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110`}>
                      <Icon className={`w-4 h-4 ${card.iconColor}`} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className={`text-2xl font-semibold tracking-tight ${isNegative ? 'text-red-500' : 'text-foreground'}`}>
                  {isNegative ? '-' : ''}{t('etb')} {formatted}
                </p>
                <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-white/40 to-transparent group-hover:w-16 transition-all duration-300" />
              </CardContent>
            </Card>

            {/* Edit popover */}
            <AnimatePresence>
              {isEditing && card.editable && card.override && (
                <EditPopover
                  label={card.label}
                  current={card.amount}
                  hasOverride={card.override.hasOverride}
                  onSave={card.override.set}
                  onClear={card.override.clear}
                  onClose={() => setEditingIdx(null)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
