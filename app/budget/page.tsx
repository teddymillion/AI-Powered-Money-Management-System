'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Progress } from '@/components/ui/progress';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { NewGoalModal } from '@/components/budget/new-goal-modal';
import { api } from '@/lib/api';
import { Target, TrendingUp, Trash2 } from 'lucide-react';
import { useLang } from '@/lib/language-context';

interface Goal { _id: string; name: string; target: number; current: number; icon: string; deadline?: string; }
interface Summary { income: number; expenses: number; savings: number; }

function SkeletonGoal() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2"><div className="skeleton h-4 w-28 rounded" /><div className="skeleton h-3 w-20 rounded" /></div>
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
      <div className="skeleton h-2.5 w-full rounded-full" />
      <div className="skeleton h-3 w-24 rounded" />
    </div>
  );
}

export default function BudgetPage() {
  const { t } = useLang();
  const [goals, setGoals]       = useState<Goal[]>([]);
  const [summary, setSummary]   = useState<Summary | null>(null);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [g, s] = await Promise.all([api.getGoals(), api.getSummary()]);
      setGoals(g as Goal[]); setSummary(s as Summary);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteAccount') + '?')) return;
    setDeleting(id);
    try { await api.deleteGoal(id); setGoals(prev => prev.filter(g => g._id !== id)); }
    catch { /* silent */ }
    finally { setDeleting(null); }
  };

  const income     = summary?.income   ?? 0;
  const needs      = summary?.expenses ?? 0;
  const savings    = summary?.savings  ?? 0;
  const wants      = Math.max(0, income - needs - savings);
  const needsPct   = income > 0 ? Math.round((needs   / income) * 100) : 0;
  const wantsPct   = income > 0 ? Math.round((wants   / income) * 100) : 0;
  const savingsPct = income > 0 ? Math.round((savings / income) * 100) : 0;
  const month      = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-accent" />
              <h1 className="text-2xl font-bold text-foreground">{t('budgetGoals')}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{t('budgetSubtitle')}</p>
          </div>
          <NewGoalModal onCreated={fetchAll} />
        </div>

        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('yourGoals')}</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[0,1,2,3].map(i => <SkeletonGoal key={i} />)}
            </div>
          ) : goals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{t('noGoals')}</p>
              <p className="text-xs text-muted-foreground">{t('createFirstGoal')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {goals.map((goal) => {
                const pct       = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                const remaining = goal.target - goal.current;
                const daysLeft  = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000) : null;
                return (
                  <div key={goal._id} className="group rounded-2xl border border-border bg-card p-5 card-hover relative overflow-hidden">
                    <button onClick={() => handleDelete(goal._id)} disabled={deleting === goal._id}
                      className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-secondary opacity-0 group-hover:opacity-100 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl">{goal.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">{goal.name}</h3>
                        <p className="text-xs text-muted-foreground">{t('target')}: <CurrencyDisplay amount={goal.target} /></p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t('progress')}</span>
                        <span className="font-bold text-accent">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2 bg-secondary" />
                    </div>
                    <div className="space-y-1 pt-3 border-t border-border/50">
                      <p className="text-xs font-medium text-foreground">
                        <CurrencyDisplay amount={goal.current} /> / <CurrencyDisplay amount={goal.target} />
                      </p>
                      <p className="text-xs text-muted-foreground"><CurrencyDisplay amount={remaining} /> {t('remaining')}</p>
                      {daysLeft !== null && (
                        <p className={`text-xs font-medium ${daysLeft < 30 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                          {daysLeft > 0 ? `${daysLeft} ${t('daysLeft')}` : t('deadlinePassed')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-accent/10"><Target className="w-4 h-4 text-accent" /></div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t('monthlyBudget')}</h3>
              <p className="text-xs text-muted-foreground">{month}</p>
            </div>
          </div>
          {loading ? (
            <div className="space-y-3">{[0,1,2].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : (
            <div className="space-y-3">
              {[
                { label: t('needs'),   pct: needsPct,   amount: needs,   color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', desc: t('needsDesc') },
                { label: t('wants'),   pct: wantsPct,   amount: wants,   color: 'bg-amber-500',   textColor: 'text-amber-600 dark:text-amber-400',   desc: t('wantsDesc') },
                { label: t('savings'), pct: savingsPct, amount: savings, color: 'bg-blue-500',    textColor: 'text-blue-600 dark:text-blue-400',    desc: t('savingsDesc') },
              ].map(({ label, pct, amount, color, textColor, desc }) => (
                <div key={label} className="p-4 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-foreground">{label} — {pct}%</span>
                    <span className={`text-sm font-bold ${textColor}`}><CurrencyDisplay amount={amount} /></span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mb-1.5">
                    <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-secondary/30 p-6 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-accent/15 flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">{t('proTip')}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('proTipDesc')} <strong className="text-foreground">{needsPct}% / {wantsPct}% / {savingsPct}%</strong>.{' '}
              {savingsPct >= 20 ? t('excellentSavings') : t('increaseSavings')}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
