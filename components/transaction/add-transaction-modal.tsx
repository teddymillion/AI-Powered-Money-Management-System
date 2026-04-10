'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { api, APIError } from '@/lib/api';

export function AddTransactionModal({ onClose }: { onClose?: () => void }) {
  const [open, setOpen]           = useState(false);
  const [type, setType]           = useState<'income'|'expense'>('expense');
  const [category, setCategory]   = useState(CATEGORIES.find(c=>c.type==='expense')?.id || CATEGORIES[0].id);
  const [amount, setAmount]       = useState('');
  const [description, setDesc]    = useState('');
  const [date, setDate]           = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string|null>(null);

  const visible = useMemo(() => CATEGORIES.filter(c => !c.type || c.type === type), [type]);

  const reset = () => { setAmount(''); setDesc(''); setDate(new Date().toISOString().split('T')[0]); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { setError('Enter a valid amount.'); return; }
    setLoading(true); setError(null);
    try {
      await api.addTransaction({ type, category, amount: Number(amount), description, date });
      setOpen(false); reset();
      window.dispatchEvent(new CustomEvent('transactions:updated'));
      onClose?.();
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Unable to save transaction.');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 active:scale-95 transition-all shadow-md shadow-accent/20">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-border bg-card rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-base font-semibold text-foreground">New Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Type toggle */}
          <div className="flex p-1 bg-secondary rounded-xl">
            {(['expense','income'] as const).map(v => (
              <button key={v} type="button" onClick={() => {
                setType(v);
                const first = CATEGORIES.find(c => !c.type || c.type === v);
                if (first) setCategory(first.id);
              }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  type === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {v === 'expense' ? '↓ Expense' : '↑ Income'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount (ETB)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">ETB</span>
              <input
                type="number" min="0.01" step="0.01" placeholder="0.00"
                value={amount} onChange={e => setAmount(e.target.value)} required
                className="w-full pl-14 pr-4 py-3 bg-secondary border border-border rounded-xl text-lg font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
            <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto scrollbar-thin pr-1">
              {visible.map(cat => (
                <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all duration-150 ${
                    category === cat.id
                      ? 'border-accent bg-accent/10 text-foreground'
                      : 'border-border bg-secondary text-muted-foreground hover:border-border/80 hover:text-foreground'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] font-medium leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              placeholder="What was this for?"
              value={description} onChange={e => setDesc(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
            <input
              type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <X className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)} disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-all">
              Cancel
            </button>
            <button type="submit" disabled={!amount || loading}
              className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-accent/20">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save Transaction'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
