import { Card } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet } from 'lucide-react';

interface OverviewCardsProps {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}

export function OverviewCards({
  income,
  expenses,
  savings,
  balance,
}: OverviewCardsProps) {
  const cards = [
    {
      label: 'Balance',
      amount: balance,
      icon: Wallet,
      color: 'from-accent to-accent/60',
      textColor: 'text-accent-foreground',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Income',
      amount: income,
      icon: ArrowUpRight,
      color: 'from-green-600 to-green-500',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Expenses',
      amount: expenses,
      icon: ArrowDownLeft,
      color: 'from-red-600 to-red-500',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Savings',
      amount: savings,
      icon: TrendingUp,
      color: 'from-cyan-600 to-cyan-500',
      textColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className="relative overflow-hidden border-border/30 bg-card hover:border-border/50 transition-all duration-300"
          >
            {/* Gradient background effect */}
            <div
              className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 bg-gradient-to-br ${card.color}`}
            />

            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </span>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${card.textColor}`} />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">
                  <CurrencyDisplay amount={card.amount} />
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
