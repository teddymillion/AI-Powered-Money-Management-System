'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AIInsightCard } from '@/components/dashboard/ai-insight-card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/language-context';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { summary, transactions, insights, spendingByCategory, loading, insightsLoading, error, insightFresh, rawSummary, incomeOverride, expenseOverride, setIncome, setExpense } = useDashboardData();
  const firstName = user?.name?.split(' ')[0] || 'there';
  const now = new Date().toLocaleDateString(lang === 'am' ? 'en-ET' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('goodAfternoon') : t('goodEvening');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-up">
        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-accent/80 to-emerald-700 p-6 lg:p-8">
          <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/10 animate-blob" />
          <div className="absolute bottom-[-30px] left-1/3 w-36 h-36 rounded-full bg-white/5 animate-blob animation-delay-2000" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-white/60 text-xs font-medium mb-1">{now}</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{greeting}, {firstName} 👋</h1>
              <p className="text-white/70 text-sm mt-1">{t('financialOverview')}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 w-fit">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-semibold">{t('aiPoweredActive')}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">⚠ {error}</div>
        )}

        <OverviewCards
          balance={summary?.balance ?? 0}
          income={summary?.income ?? 0}
          expenses={summary?.expenses ?? 0}
          savings={summary?.savings ?? 0}
          rawIncome={rawSummary?.income ?? 0}
          rawExpenses={rawSummary?.expenses ?? 0}
          incomeOverride={incomeOverride}
          expenseOverride={expenseOverride}
          onSetIncome={setIncome}
          onSetExpense={setExpense}
          loading={loading}
        />
        <AIInsightCard insights={insights} loading={insightsLoading} highlight={insightFresh} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3"><SpendingChart data={spendingByCategory} loading={loading} /></div>
          <div className="lg:col-span-2"><RecentTransactions transactions={transactions} loading={loading} error={error} /></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
