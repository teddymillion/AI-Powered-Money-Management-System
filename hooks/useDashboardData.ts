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

export function useDashboardData() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insightFresh, setInsightFresh] = useState(false);

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
    if (!summary) return [];
    return buildCategorySpending(summary.byCategory);
  }, [summary]);

  return {
    summary,
    transactions,
    insights,
    spendingByCategory,
    loading,
    insightsLoading,
    error,
    refresh: fetchData,
    insightFresh,
  };
}
