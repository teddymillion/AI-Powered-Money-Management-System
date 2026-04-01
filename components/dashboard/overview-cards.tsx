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
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.label}
            className="relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border/60 hover:shadow-lg transition-all duration-500 group cursor-default"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Gradient background effect with enhanced opacity on hover */}
            <div
              className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 bg-gradient-to-br ${card.color} transition-opacity duration-500`}
            />
            
            {/* Secondary gradient for depth */}
            <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full opacity-5 bg-gradient-to-br from-accent/50 to-accent/10" />

            <div className="relative p-6 space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </span>
                <div
                  className={`${card.bgColor} p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-4 h-4 ${card.textColor}`} />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground tracking-tight">
                  <CurrencyDisplay amount={card.amount} />
                </p>
                <div className="h-0.5 w-8 bg-gradient-to-r from-accent to-accent/30 rounded-full group-hover:w-12 transition-all duration-500" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
