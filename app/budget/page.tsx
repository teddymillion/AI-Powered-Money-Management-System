'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { BUDGET_GOALS } from '@/lib/mock-data';
import { api, APIError } from '@/lib/api';
import { Plus, Target, TrendingUp } from 'lucide-react';

interface Summary {
  income: number;
  expenses: number;
  savings: number;
}

export default function BudgetPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSummary()
      .then((data) => setSummary(data as Summary))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const income = summary?.income ?? 0;
  const needs = summary?.expenses ?? 0;
  const savings = summary?.savings ?? 0;
  // wants = income - needs - savings (floor at 0)
  const wants = Math.max(0, income - needs - savings);

  const needsPct  = income > 0 ? Math.round((needs   / income) * 100) : 0;
  const wantsPct  = income > 0 ? Math.round((wants   / income) * 100) : 0;
  const savingsPct = income > 0 ? Math.round((savings / income) * 100) : 0;

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-accent" />
              <h1 className="text-3xl font-bold text-foreground">Budget & Goals</h1>
            </div>
            <p className="text-muted-foreground">Track your savings goals and financial targets</p>
          </div>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-lg transition-all hover:scale-105"
            onClick={() => alert('Goal creation coming soon — add transactions first to track progress!')}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Goal</span>
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUDGET_GOALS.map((goal, index) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const remaining = goal.target - goal.current;
            return (
              <Card
                key={goal.id}
                className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border/60 hover:shadow-lg transition-all duration-500 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {goal.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Goal: <CurrencyDisplay amount={goal.target} />
                      </p>
                    </div>
                    <span className="text-3xl flex-shrink-0 group-hover:scale-125 transition-transform duration-300">
                      {goal.icon}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {percentage}%
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2.5 bg-secondary rounded-full overflow-hidden" />
                    </div>
                    <div className="space-y-1 pt-2 border-t border-border/30">
                      <p className="text-sm font-medium text-foreground">
                        <CurrencyDisplay amount={goal.current} /> of <CurrencyDisplay amount={goal.target} />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <CurrencyDisplay amount={remaining} /> remaining
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Monthly Budget — live data */}
        <Card className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border/60 hover:shadow-lg transition-all duration-500">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-accent/10">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Monthly Budget</h3>
                <p className="text-sm text-muted-foreground">{currentMonth}</p>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">Loading budget data...</p>
            ) : (
              <div className="space-y-4">
                {/* Needs */}
                <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-foreground">
                      Needs — {needsPct}% of income
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                      <CurrencyDisplay amount={needs} />
                    </span>
                  </div>
                  <Progress value={Math.min(needsPct, 100)} className="h-3 bg-secondary rounded-full" />
                  <p className="text-xs text-muted-foreground mt-2">Rent, utilities, groceries, transport</p>
                </div>

                {/* Wants */}
                <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-foreground">
                      Wants — {wantsPct}% of income
                    </span>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                      <CurrencyDisplay amount={wants} />
                    </span>
                  </div>
                  <Progress value={Math.min(wantsPct, 100)} className="h-3 bg-secondary rounded-full" />
                  <p className="text-xs text-muted-foreground mt-2">Entertainment, dining out, shopping</p>
                </div>

                {/* Savings */}
                <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 cursor-pointer">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-foreground">
                      Savings — {savingsPct}% of income
                    </span>
                    <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
                      <CurrencyDisplay amount={savings} />
                    </span>
                  </div>
                  <Progress value={Math.min(savingsPct, 100)} className="h-3 bg-secondary rounded-full" />
                  <p className="text-xs text-muted-foreground mt-2">Emergency fund, goals, investments</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Pro Tip */}
        <Card className="border-border/30 bg-gradient-to-br from-accent/5 to-secondary/30 border-accent/20 hover:border-accent/40 transition-all duration-500 hover:shadow-lg group">
          <div className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/20 flex-shrink-0 group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                Pro Tip — 50/30/20 Rule
              </h4>
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Aim for 50% on needs, 30% on wants, and 20% on savings. Your current split is{' '}
                <strong className="text-foreground">{needsPct}% / {wantsPct}% / {savingsPct}%</strong>.{' '}
                {savingsPct >= 20
                  ? '🎉 Great job on savings!'
                  : 'Try to increase your savings rate to at least 20%.'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
