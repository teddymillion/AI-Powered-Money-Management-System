'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SpendingData { category: string; amount: number; percentage: number; }
interface SpendingChartProps { data: SpendingData[]; loading?: boolean; }

const COLORS = ['#10b981','#6366f1','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];

export function SpendingChart({ data, loading = false }: SpendingChartProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const tooltipStyle = isDark
    ? { backgroundColor: 'rgba(15,17,23,0.97)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '10px', color: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }
    : { backgroundColor: 'rgba(255,255,255,0.97)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '10px', color: '#000000', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };

  const pieData = data.map(item => ({ name: item.category, value: item.amount }));

  return (
    <Card className="border-border/70 bg-card/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
            <p className="text-xs text-muted-foreground">Your expenses breakdown</p>
          </div>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">Analytics</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading spending breakdown...</div>
        ) : data.length === 0 ? (
          <div className="text-sm text-muted-foreground">No expense data for this period.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `ETB ${value.toLocaleString()}`}
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: isDark ? '#ffffff' : '#000000', fontWeight: 600 }}
                    itemStyle={{ color: isDark ? '#ffffff' : '#000000' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={item.category} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-all duration-300">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">ETB {item.amount.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-[10px]">{item.percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
