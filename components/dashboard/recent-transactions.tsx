'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

interface Transaction {
  id: string; category: string; amount: number; description: string;
  date: Date; categoryIcon: string; type?: 'income' | 'expense';
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3 w-32 rounded" />
        <div className="skeleton h-2.5 w-20 rounded" />
      </div>
      <div className="skeleton h-4 w-16 rounded" />
    </div>
  );
}

export function RecentTransactions({
  transactions, loading = false, error = null,
}: { transactions: Transaction[]; loading?: boolean; error?: string | null }) {
  const router = useRouter();
  const [sort, setSort] = useState<'date_desc'|'date_asc'|'amount_desc'|'amount_asc'>('date_desc');

  const formatDate = (d: Date) => {
    const today = new Date(); const yest = new Date(today); yest.setDate(yest.getDate()-1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yest.toDateString())  return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const sorted = useMemo(() => {
    const sorters: Record<string, (a: Transaction, b: Transaction) => number> = {
      date_desc:   (a,b) => b.date.getTime()-a.date.getTime(),
      date_asc:    (a,b) => a.date.getTime()-b.date.getTime(),
      amount_desc: (a,b) => b.amount-a.amount,
      amount_asc:  (a,b) => a.amount-b.amount,
    };
    return [...transactions].sort(sorters[sort]);
  }, [transactions, sort]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-hover">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Latest activity</p>
        </div>
        <button
          onClick={() => router.push('/analytics')}
          className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as typeof sort)}
        className="w-full mb-4 px-3 py-2 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <option value="date_desc">Newest first</option>
        <option value="date_asc">Oldest first</option>
        <option value="amount_desc">Highest amount</option>
        <option value="amount_asc">Lowest amount</option>
      </select>

      {loading ? (
        <div className="divide-y divide-border">
          {[0,1,2,3,4].map(i => <SkeletonRow key={i} />)}
        </div>
      ) : error ? (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">{error}</div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
            <Wallet className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No transactions yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first transaction above</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sorted.slice(0, 7).map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 py-3 group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base ${
                tx.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
              }`}>
                {tx.categoryIcon || (tx.type === 'income'
                  ? <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  : <ArrowDownLeft className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                  {tx.description || tx.category}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {tx.category} · {formatDate(tx.date)}
                </p>
              </div>
              <p className={`text-xs font-bold flex-shrink-0 ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                {tx.type === 'income' ? '+' : '-'}ETB {tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
