import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, APIError } from '@/lib/api';
import { buildCategorySpending, normalizeTransactions } from '@/lib/finance';

export interface DashboardSummary {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
  byCategory: { category: string; amount: number; percentage: number }[];
  trends: {
    weekly: { period: string; income: number; expenses: number; savings: number }[];
    monthly: { period: string; income: number; expenses: number; savings: number }[];
    yearly: { period: string; income: number; expenses: number; savings: number }[];
  };
}

export interface AIInsight {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

const INCOME_KEY  = 'override_income';
const EXPENSE_KEY = 'override_expense';

function readOverride(key: string): number | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(key);
  return v !== null ? Number(v) : null;
}

export function useDashboardData() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insightFresh, setInsightFresh] = useState(false);
  // Override state — changing these triggers re-render of everything
  const [incomeOverride, setIncomeOverride]   = useState<number | null>(() => readOverride(INCOME_KEY));
  const [expenseOverride, setExpenseOverride] = useState<number | null>(() => readOverride(EXPENSE_KEY));

  const setIncome = (v: number | null) => {
    if (v === null) localStorage.removeItem(INCOME_KEY);
    else localStorage.setItem(INCOME_KEY, String(v));
    setIncomeOverride(v);
  };
  const setExpense = (v: number | null) => {
    if (v === null) localStorage.removeItem(EXPENSE_KEY);
    else localStorage.setItem(EXPENSE_KEY, String(v));
    setExpenseOverride(v);
  };

  // Effective values — override wins over API value
  const effectiveSummary = useMemo(() => {
    if (!summary) return null;
    const income   = incomeOverride  !== null ? incomeOverride  : summary.income;
    const expenses = expenseOverride !== null ? expenseOverride : summary.expenses;
    const savings  = income - expenses;
    const balance  = savings; // balance = income - expenses for the month
    return { ...summary, income, expenses, savings, balance };
  }, [summary, incomeOverride, expenseOverride]);

  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const insightData = await api.getAIInsights();
      const newInsights = (insightData as any).insights || [];
      setInsights(newInsights);

      const hash = JSON.stringify(newInsights);
      const lastHash = window.localStorage.getItem('insight_hash');
      if (hash && hash !== lastHash) {
        setInsightFresh(true);
        window.localStorage.setItem('insight_hash', hash);
      } else {
        setInsightFresh(false);
      }
    } catch {
      // Insights failing shouldn't break the dashboard
    } finally {
      setInsightsLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [summaryData, transactionData] = await Promise.all([
        api.getSummary(),
        api.getTransactions({ sort: 'date_desc' }),
      ]);

      setSummary(summaryData as DashboardSummary);
      setTransactions(normalizeTransactions(transactionData as any[]));
    } catch (err) {
      if (err instanceof APIError && err.status === 401) {
        router.replace('/login');
        return;
      }
      const message = err instanceof APIError ? err.message : 'Failed to load dashboard data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
    fetchInsights();

    const handler = () => fetchData();
    window.addEventListener('transactions:updated', handler);
    return () => window.removeEventListener('transactions:updated', handler);
  }, [fetchData, fetchInsights]);

  const spendingByCategory = useMemo(() => {
    if (!effectiveSummary) return [];
    return buildCategorySpending(effectiveSummary.byCategory);
  }, [effectiveSummary]);

  return {
    summary: effectiveSummary,
    rawSummary: summary,
    transactions,
    insights,
    spendingByCategory,
    loading,
    insightsLoading,
    error,
    refresh: fetchData,
    insightFresh,
    // Override controls passed down to OverviewCards
    incomeOverride,
    expenseOverride,
    setIncome,
    setExpense,
  };
}
