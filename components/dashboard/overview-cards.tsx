'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLang } from '@/lib/language-context';

interface OverviewCardsProps {
  income: number; expenses: number; savings: number; balance: number; loading?: boolean;
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

  const cards = [
    { label: t('totalBalance'),  amount: balance,  icon: Wallet,        iconBg: 'bg-accent/15',       iconColor: 'text-accent',       gradient: 'from-accent/10 via-transparent to-transparent' },
    { label: t('monthlyIncome'), amount: income,   icon: ArrowUpRight,  iconBg: 'bg-emerald-500/15',  iconColor: 'text-emerald-500',  gradient: 'from-emerald-500/10 via-transparent to-transparent' },
    { label: t('totalExpenses'), amount: expenses, icon: ArrowDownLeft, iconBg: 'bg-red-500/15',      iconColor: 'text-red-500',      gradient: 'from-red-500/10 via-transparent to-transparent' },
    { label: t('netSavings'),    amount: savings,  icon: TrendingUp,    iconBg: 'bg-blue-500/15',     iconColor: 'text-blue-500',     gradient: 'from-blue-500/10 via-transparent to-transparent' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon      = card.icon;
        const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.abs(card.amount));
        const isNegative = card.amount < 0;
        return (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }} className="group">
            <Card className="relative overflow-hidden rounded-2xl border-border/70 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-70`} />
              <CardHeader className="relative pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{card.label}</CardTitle>
                    <Badge variant="secondary" className="bg-background/70 text-[10px] uppercase tracking-widest">{t('thisMonth')}</Badge>
                  </div>
                  <div className={`${card.iconBg} p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
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
          </motion.div>
        );
      })}
    </div>
  );
}
