import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { EmptyState } from '@/components/common/empty-state';
import { ArrowRight, Wallet } from 'lucide-react';

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
    <Card className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border/60 hover:shadow-lg transition-all duration-500">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Recent Transactions
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Your latest activity
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-accent hover:bg-accent/10 gap-2 group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No transactions yet"
            description="Start tracking your spending by adding your first transaction"
          />
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 6).map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/70 transition-all duration-300 hover:pl-4 group cursor-pointer"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Icon */}
                <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {transaction.categoryIcon}
                </div>

                {/* Description and date */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    <CurrencyDisplay amount={transaction.amount} showSymbol={false} />
                  </p>
                  <p className="text-xs text-muted-foreground">ETB</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
