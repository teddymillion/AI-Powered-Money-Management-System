'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SpendingData { category: string; amount: number; percentage: number; }

const COLORS = ['#10b981','#6366f1','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];

function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="skeleton h-4 w-40 rounded mb-1" />
      <div className="skeleton h-3 w-28 rounded mb-6" />
      <div className="grid grid-cols-2 gap-6">
        <div className="skeleton h-48 w-48 rounded-full mx-auto" />
        <div className="space-y-3 pt-4">
          {[0,1,2,3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton w-3 h-3 rounded-full" />
              <div className="skeleton h-3 flex-1 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SpendingChart({ data, loading = false }: { data: SpendingData[]; loading?: boolean }) {
  if (loading) return <SkeletonChart />;

  const pieData = data.map((d) => ({ name: d.category, value: d.amount }));
  const total   = data.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-hover">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground">Spending by Category</h3>
        <p className="text-xs text-muted-foreground mt-0.5">This month's expense breakdown</p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <p className="text-sm text-muted-foreground">No expense data yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Add transactions to see your breakdown.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Donut */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [`ETB ${v.toLocaleString()}`, '']}
                  contentStyle={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: '12px', fontSize: '12px', color: 'var(--foreground)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold text-foreground">ETB {(total/1000).toFixed(1)}k</p>
            </div>
          </div>

          {/* Category list */}
          <div className="space-y-2.5">
            {data.slice(0, 6).map((item, i) => (
              <div key={item.category} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-medium text-foreground truncate max-w-[120px]">{item.category}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.percentage}%`, background: COLORS[i % COLORS.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
