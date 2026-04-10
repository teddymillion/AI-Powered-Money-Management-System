'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { api, APIError } from '@/lib/api';

const ICONS = ['🎯','🏠','✈️','💻','🎓','🚗','💍','🏋️','📱','💰','🏦','🌍'];

export function NewGoalModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen]         = useState(false);
  const [name, setName]         = useState('');
  const [target, setTarget]     = useState('');
  const [current, setCurrent]   = useState('');
  const [icon, setIcon]         = useState('🎯');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const reset = () => { setName(''); setTarget(''); setCurrent(''); setIcon('🎯'); setDeadline(''); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target || Number(target) <= 0) { setError('Name and a valid target amount are required.'); return; }
    setLoading(true); setError(null);
    try {
      await api.createGoal({ name, target: Number(target), current: Number(current || 0), icon, deadline: deadline || undefined });
      setOpen(false); reset(); onCreated();
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'Failed to create goal.');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm";

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 active:scale-95 transition-all shadow-md shadow-accent/20">
          <Plus className="w-4 h-4" /><span className="hidden sm:inline">New Goal</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border bg-card rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-base font-semibold text-foreground">Create New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${icon === ic ? 'border-accent bg-accent/10' : 'border-border bg-secondary hover:border-border/80'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Goal Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Emergency Fund" required className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Amount (ETB)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">ETB</span>
              <input type="number" min="1" step="1" placeholder="50,000" value={target} onChange={e => setTarget(e.target.value)} required className={`${inputCls} pl-14`} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Already Saved <span className="normal-case font-normal">(optional)</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">ETB</span>
              <input type="number" min="0" step="1" placeholder="0" value={current} onChange={e => setCurrent(e.target.value)} className={`${inputCls} pl-14`} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Date <span className="normal-case font-normal">(optional)</span></label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputCls} />
          </div>
          {error && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <X className="w-3.5 h-3.5 flex-shrink-0" />{error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setOpen(false)} disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-all">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition-all active:scale-[0.98] shadow-md shadow-accent/20">
              {loading ? <span className="flex items-center justify-center gap-2"><div className="w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />Creating...</span> : 'Create Goal'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
