'use client';

import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet } from 'lucide-react';

interface OverviewCardsProps {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-9 w-9 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-28 rounded" />
      <div className="skeleton h-1.5 w-12 rounded-full" />
    </div>
  );
}

export function OverviewCards({ income, expenses, savings, balance, loading = false }: OverviewCardsProps) {
  const cards = [
    {
      label: 'Total Balance',
      amount: balance,
      icon: Wallet,
      iconBg: 'bg-accent/15',
      iconColor: 'text-accent',
      trend: null,
      gradient: 'from-accent/10 via-transparent to-transparent',
    },
    {
      label: 'Monthly Income',
      amount: income,
      icon: ArrowUpRight,
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-500',
      trend: '+income',
      gradient: 'from-emerald-500/10 via-transparent to-transparent',
    },
    {
      label: 'Total Expenses',
      amount: expenses,
      icon: ArrowDownLeft,
      iconBg: 'bg-red-500/15',
      iconColor: 'text-red-500',
      trend: '-expenses',
      gradient: 'from-red-500/10 via-transparent to-transparent',
    },
    {
      label: 'Net Savings',
      amount: savings,
      icon: TrendingUp,
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-500',
      trend: savings >= 0 ? '+savings' : '-savings',
      gradient: 'from-blue-500/10 via-transparent to-transparent',
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.abs(card.amount));
        const isNegative = card.amount < 0;

        return (
          <div
            key={card.label}
            className="group relative rounded-2xl border border-border bg-card overflow-hidden card-hover cursor-default"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Gradient tint */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60`} />

            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </p>
                <div className={`${card.iconBg} p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>

              <div className="space-y-1">
                <p className={`text-2xl font-bold tracking-tight ${isNegative ? 'text-red-500' : 'text-foreground'}`}>
                  {isNegative ? '-' : ''}ETB {formatted}
                </p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${
                card.iconColor.replace('text-', 'from-').replace('-500', '-500')
              } to-transparent`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
