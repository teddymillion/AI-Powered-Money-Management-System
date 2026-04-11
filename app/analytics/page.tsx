'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { api, APIError } from '@/lib/api';
import { buildCategorySpending } from '@/lib/finance';
import { useLang } from '@/lib/language-context';

type ViewType = 'weekly' | 'monthly' | 'yearly';

interface SummaryData {
  income: number; expenses: number; savings: number; balance: number;
  highestSpendingDay: { date: string; amount: number; label: string } | null;
  byCategory: { category: string; amount: number; percentage: number }[];
  trends: Record<ViewType, { period: string; income: number; expenses: number; savings: number }[]>;
}

export default function AnalyticsPage() {
  const { t } = useLang();
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [summary, setSummary]   = useState<SummaryData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true); setError(null);
    api.getSummary()
      .then((data) => { if (mounted) setSummary(data as SummaryData); })
      .catch((err) => { if (mounted) setError(err instanceof APIError ? err.message : t('unableToLoadAnalytics')); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const trendData    = summary?.trends[viewType] || [];
  const categoryData = useMemo(() => summary ? buildCategorySpending(summary.byCategory) : [], [summary]);

  const viewLabels: Record<ViewType, string> = {
    weekly: t('weekly'), monthly: t('monthly'), yearly: t('yearly'),
  };

  const tooltipStyle = {
    contentStyle: { backgroundColor: 'rgba(15,17,23,0.9)', border: '1px solid rgba(148,163,184,0.3)', borderRadius: '8px', color: '#f5f5f5' },
    formatter: (value: number) => `${t('etb')} ${value.toLocaleString()}`,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">{t('analyticsTitle')}</h1>
          </div>
          <p className="text-muted-foreground">{t('analyticsSubtitle')}</p>
        </div>

        {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

        <div className="flex gap-1.5 p-1 bg-secondary/30 rounded-xl w-full sm:w-fit overflow-x-auto">
          {(['weekly', 'monthly', 'yearly'] as const).map((view) => (
            <Button key={view} onClick={() => setViewType(view)} size="sm"
              className={`flex-1 sm:flex-none transition-all duration-300 ${viewType === view ? 'bg-accent text-accent-foreground shadow-lg' : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
              {viewLabels[view]}
            </Button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card className="border-border/70 bg-card/70 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('incomeVsExpenses')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('comparePatterns')}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">{t('trends')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? <div className="text-sm text-muted-foreground">{t('loadingTrends')}</div> : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="period" stroke="rgba(148,163,184,0.5)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(148,163,184,0.5)" style={{ fontSize: '12px' }} />
                    <Tooltip {...tooltipStyle} />
                    <Legend />
                    <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/70 bg-card/70 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('savingsTrend')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('trackSavingsGrowth')}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">{t('momentum')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? <div className="text-sm text-muted-foreground">{t('loadingTrends')}</div> : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="period" stroke="rgba(148,163,184,0.5)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="rgba(148,163,184,0.5)" style={{ fontSize: '12px' }} />
                    <Tooltip {...tooltipStyle} />
                    <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/70 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('categoryBreakdown')}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t('whereMoneyGoes')}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">{t('distribution')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? <div className="text-sm text-muted-foreground">{t('loadingCategories')}</div> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                    <XAxis dataKey="category" stroke="rgba(148,163,184,0.5)" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="rgba(148,163,184,0.5)" style={{ fontSize: '12px' }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: t('avgMonthlyExpense'),
              value: `${t('etb')} ${summary?.expenses?.toLocaleString() || 0}`,
              trend: summary ? `${((summary.expenses / (summary.income || 1)) * 100).toFixed(1)}%` : '0%',
            },
            {
              label: t('highestSpendingDay'),
              value: loading ? t('calculating') : summary?.highestSpendingDay ? `${t('etb')} ${summary.highestSpendingDay.amount.toLocaleString()}` : t('noDataYet'),
              trend: summary?.highestSpendingDay?.label || undefined,
            },
            {
              label: t('savingsRate'),
              value: summary ? `${((summary.savings / (summary.income || 1)) * 100).toFixed(1)}%` : '0%',
              trend: t('tracking'),
            },
          ].map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="border-border/70 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="py-6 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  {stat.trend && <p className="text-xs text-emerald-400 font-medium">{stat.trend}</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
