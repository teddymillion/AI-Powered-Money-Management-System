import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AIInsightCard } from '@/components/dashboard/ai-insight-card';
import { MONTHLY_OVERVIEW, SPENDING_BY_CATEGORY, TRANSACTIONS, AI_INSIGHTS } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Abebe
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your financial overview for March 2024
          </p>
        </div>

        {/* Overview Cards */}
        <OverviewCards
          balance={MONTHLY_OVERVIEW.balance}
          income={MONTHLY_OVERVIEW.income}
          expenses={MONTHLY_OVERVIEW.expenses}
          savings={MONTHLY_OVERVIEW.savings}
        />

        {/* AI Insight */}
        <AIInsightCard insights={AI_INSIGHTS} />

        {/* Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spending Chart - larger on desktop */}
          <div className="lg:col-span-2">
            <SpendingChart data={SPENDING_BY_CATEGORY} />
          </div>

          {/* Recent Transactions - side panel */}
          <div className="lg:col-span-1">
            <RecentTransactions transactions={TRANSACTIONS} />
          </div>
        </div>

        {/* Full width Recent Transactions on mobile */}
        <div className="hidden max-lg:block">
          <RecentTransactions transactions={TRANSACTIONS} />
        </div>
      </div>
    </DashboardLayout>
  );
}
