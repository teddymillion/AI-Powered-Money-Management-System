import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { ArrowRight } from 'lucide-react';

interface Transaction {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  categoryIcon: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="border-border/30 bg-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Transactions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-accent hover:bg-accent/10"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="space-y-3">
          {transactions.slice(0, 6).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {/* Icon */}
              <div className="text-2xl flex-shrink-0">
                {transaction.categoryIcon}
              </div>

              {/* Description and date */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.category} • {formatDate(transaction.date)}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">
                  <CurrencyDisplay amount={transaction.amount} showSymbol={false} />
                </p>
                <p className="text-xs text-muted-foreground">ETB</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
