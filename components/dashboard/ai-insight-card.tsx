'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/language-context';

interface AIInsight { title: string; description: string; priority: 'low' | 'medium' | 'high'; }
interface AIInsightCardProps { insights: AIInsight[]; loading?: boolean; highlight?: boolean; }

const PRIORITY_CONFIG = {
  high:   { color: 'text-red-500',   bg: 'bg-red-500/10',   border: 'border-red-500/20',   icon: AlertCircle },
  medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: TrendingUp  },
  low:    { color: 'text-blue-500',  bg: 'bg-blue-500/10',  border: 'border-blue-500/20',  icon: Zap         },
};

function SkeletonInsight() {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/70">
      <CardContent className="py-6">
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
      </CardContent>
    </Card>
  );
}

export function AIInsightCard({ insights, loading = false, highlight = false }: AIInsightCardProps) {
  const router = useRouter();
  const { t } = useLang();

  const priorityLabels = { high: t('high'), medium: t('medium'), low: t('low') };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          <span className="text-sm font-semibold text-foreground">{t('aiInsights')}</span>
          <span className="text-xs text-muted-foreground">{t('generatingInsights')}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonInsight /><SkeletonInsight /><SkeletonInsight />
        </div>
      </div>
    );
  }

  if (!insights.length) {
    return (
      <Card className="rounded-2xl border-dashed border-border/60 bg-card/60">
        <CardContent className="py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">{t('noAiInsights')}</p>
          <p className="text-xs text-muted-foreground">{t('addTransactionsAi')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-foreground">{t('aiInsights')}</span>
          <Badge variant="secondary" className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">LIVE</Badge>
          {highlight && <Badge variant="secondary" className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20">NEW</Badge>}
        </div>
        <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10" onClick={() => router.push('/assistant')}>
          {t('askAi')} <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.slice(0, 3).map((insight, i) => {
          const cfg   = PRIORITY_CONFIG[insight.priority] || PRIORITY_CONFIG.low;
          const PIcon = cfg.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }}>
              <Card onClick={() => router.push('/assistant')}
                className={`group relative rounded-2xl border ${cfg.border} bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer overflow-hidden`}>
                <div className={`absolute inset-0 ${cfg.bg} opacity-40`} />
                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`${cfg.bg} p-2 rounded-xl flex-shrink-0`}>
                      <PIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <Badge variant="secondary" className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
                      {priorityLabels[insight.priority]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <CardTitle className="text-sm font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {insight.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{insight.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('askAi')} <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
