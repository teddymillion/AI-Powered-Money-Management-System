'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
}

interface SpendingChartProps {
  data: SpendingData[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  // Prepare data for pie chart
  const pieData = data.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const COLORS = [
    '#10b981', // emerald
    '#6366f1', // indigo
    '#f59e0b', // amber
    '#ef4444', // red
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
  ];

  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border/60 hover:shadow-lg transition-all duration-500">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Spending by Category
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your expenses breakdown
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="flex justify-center group">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `ETB ${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 17, 23, 0.95)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '10px',
                    color: '#f5f5f5',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {data.map((item, index) => (
              <div
                key={item.category}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-all duration-300 hover:pl-3 group/item cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover/item:text-accent transition-colors truncate">
                    {item.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      ETB {item.amount.toLocaleString()}
                    </p>
                    <div className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
