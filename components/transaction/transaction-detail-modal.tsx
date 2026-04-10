'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownLeft, Calendar, Tag, FileText, Hash } from 'lucide-react';

interface Transaction {
  id: string;
  category: string;
  categoryId?: string;
  amount: number;
  description: string;
  date: Date;
  categoryIcon: string;
  type?: 'income' | 'expense';
}

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  if (!transaction) return null;

  const isIncome = transaction.type === 'income';
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(transaction.amount);

  return (
    <Dialog open={!!transaction} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-sm border-border bg-card rounded-2xl p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className={`p-6 ${isIncome ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5' : 'bg-gradient-to-br from-red-500/20 to-red-500/5'}`}>
          <DialogHeader>
            <DialogTitle className="sr-only">Transaction Detail</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${isIncome ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {transaction.categoryIcon}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {isIncome ? 'Income' : 'Expense'}
              </p>
              <p className={`text-3xl font-bold ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                {isIncome ? '+' : '-'}ETB {formatted}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {[
            { icon: FileText,  label: 'Description', value: transaction.description || '—' },
            { icon: Tag,       label: 'Category',    value: transaction.category },
            { icon: Calendar,  label: 'Date',        value: transaction.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
            { icon: Hash,      label: 'Transaction ID', value: transaction.id.slice(-8).toUpperCase() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          <button
            onClick={onClose}
            className="w-full mt-2 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-all"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
