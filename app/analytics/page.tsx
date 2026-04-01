'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { MONTHLY_TRENDS } from '@/lib/mock-data';
import { Calendar } from 'lucide-react';

type ViewType = 'weekly' | 'monthly' | 'yearly';

// Extended mock data for different views
const EXTENDED_TRENDS = {
  weekly: [
    { period: 'Week 1', income: 3500, expenses: 2000, savings: 1500 },
    { period: 'Week 2', income: 3500, expenses: 2100, savings: 1400 },
    { period: 'Week 3', income: 3500, expenses: 2200, savings: 1300 },
    { period: 'Week 4', income: 3500, expenses: 2300, savings: 1200 },
  ],
  monthly: MONTHLY_TRENDS,
  yearly: [
    { period: 'Q1', income: 45000, expenses: 26400, savings: 18600 },
    { period: 'Q2', income: 48000, expenses: 27600, savings: 20400 },
  ],
};

const CATEGORY_BREAKDOWN = [
  { category: 'Rent', value: 3500 },
  { category: 'Food', value: 1200 },
  { category: 'Transport', value: 850 },
  { category: 'Utilities', value: 800 },
  { category: 'Entertainment', value: 500 },
  { category: 'Healthcare', value: 600 },
  { category: 'Education', value: 2000 },
  { category: 'Other', value: 650 },
];

export default function AnalyticsPage() {
  const [viewType, setViewType] = useState<ViewType>('monthly');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into your financial performance
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            onClick={() => setViewType('weekly')}
            variant={viewType === 'weekly' ? 'default' : 'outline'}
            className={
              viewType === 'weekly'
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'border-border hover:bg-secondary'
            }
          >
            Weekly
          </Button>
          <Button
            onClick={() => setViewType('monthly')}
            variant={viewType === 'monthly' ? 'default' : 'outline'}
            className={
              viewType === 'monthly'
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'border-border hover:bg-secondary'
            }
          >
            Monthly
          </Button>
          <Button
            onClick={() => setViewType('yearly')}
            variant={viewType === 'yearly' ? 'default' : 'outline'}
            className={
              viewType === 'yearly'
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'border-border hover:bg-secondary'
            }
          >
            Yearly
          </Button>
        </div>

        {/* Income vs Expenses Chart */}
        <Card className="border-border/30 bg-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Income vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={EXTENDED_TRENDS[viewType]}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis
                  dataKey="period"
                  stroke="rgba(148, 163, 184, 0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#f5f5f5',
                  }}
                  formatter={(value: number) => `ETB ${value.toLocaleString()}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Savings Trend */}
        <Card className="border-border/30 bg-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Savings Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={EXTENDED_TRENDS[viewType]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis
                  dataKey="period"
                  stroke="rgba(148, 163, 184, 0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#f5f5f5',
                  }}
                  formatter={(value: number) => `ETB ${value.toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-border/30 bg-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CATEGORY_BREAKDOWN}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis
                  dataKey="category"
                  stroke="rgba(148, 163, 184, 0.5)"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 17, 23, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#f5f5f5',
                  }}
                  formatter={(value: number) => `ETB ${value.toLocaleString()}`}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Average Monthly Expense',
              value: 'ETB 8,925',
              trend: '+2.1%',
            },
            {
              label: 'Highest Spending Day',
              value: 'March 15',
              subtext: 'ETB 450 spent',
            },
            {
              label: 'Savings Rate',
              value: '39%',
              trend: '+3.5%',
            },
          ].map((stat, index) => (
            <Card key={index} className="border-border/30 bg-card">
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground mb-2">
                  {stat.value}
                </p>
                {stat.trend && (
                  <p className="text-xs text-green-400">{stat.trend} from last month</p>
                )}
                {stat.subtext && (
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
