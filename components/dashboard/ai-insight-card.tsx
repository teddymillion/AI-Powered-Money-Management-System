'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface AIInsight {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface AIInsightCardProps {
  insights: AIInsight[];
  loading?: boolean;
  highlight?: boolean;
}

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'text-red-500',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    icon: AlertCircle },
  medium: { label: 'Medium', color: 'text-amber-500',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  icon: TrendingUp  },
  low:    { label: 'Low',    color: 'text-blue-500',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: Zap         },
};

function SkeletonInsight() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-2.5 w-16 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-2.5 w-full rounded" />
        <div className="skeleton h-2.5 w-4/5 rounded" />
      </div>
    </div>
  );
}

export function AIInsightCard({ insights, loading = false, highlight = false }: AIInsightCardProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-sm font-semibold text-foreground">AI Insights</span>
          <span className="text-xs text-muted-foreground">Generating from your data...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonInsight /><SkeletonInsight /><SkeletonInsight />
        </div>
      </div>
    );
  }

  if (!insights.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No AI insights yet</p>
        <p className="text-xs text-muted-foreground">Add transactions to get personalised AI recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-foreground">AI Insights</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE
          </span>
          {highlight && (
            <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
        <button
          onClick={() => router.push('/assistant')}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
        >
          Ask AI <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.slice(0, 3).map((insight, i) => {
          const cfg = PRIORITY_CONFIG[insight.priority] || PRIORITY_CONFIG.low;
          const PIcon = cfg.icon;
          return (
            <div
              key={i}
              className={`group relative rounded-2xl border ${cfg.border} bg-card p-5 card-hover cursor-pointer overflow-hidden`}
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => router.push('/assistant')}
            >
              {/* Subtle gradient bg */}
              <div className={`absolute inset-0 ${cfg.bg} opacity-40`} />

              <div className="relative space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className={`${cfg.bg} p-2 rounded-xl flex-shrink-0`}>
                    <PIcon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color} ${cfg.bg} px-2 py-0.5 rounded-full border ${cfg.border}`}>
                    {cfg.label}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {insight.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ask AI <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
