import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp } from 'lucide-react';

interface AIInsight {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

interface AIInsightCardProps {
  insights: AIInsight[];
}

export function AIInsightCard({ insights }: AIInsightCardProps) {
  const highPriority = insights.find((i) => i.priority === 'high') || insights[0];

  const priorityColors = {
    high: 'from-accent to-accent/60',
    medium: 'from-amber-600 to-amber-500',
    low: 'from-cyan-600 to-cyan-500',
  };

  return (
    <Card
      className={`relative overflow-hidden border-0 bg-gradient-to-br ${priorityColors[highPriority.priority]} shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer`}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative elements with enhanced animation */}
      <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full opacity-20 group-hover:opacity-30 bg-white transition-opacity duration-500" />
      <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full opacity-20 group-hover:opacity-30 bg-white transition-opacity duration-500" />

      {/* Secondary animated element */}
      <div className="absolute right-1/4 top-1/2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-500 blur-xl" />

      <div className="relative p-6 space-y-4">
        <div className="flex items-start gap-4">
          {/* Icon with animation */}
          <div className="p-3 rounded-lg bg-white/20 flex-shrink-0 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {highPriority.title}
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80 bg-white/20 px-2 py-1 rounded-full">
                    Priority
                  </span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed">
                  {highPriority.description}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-white flex-shrink-0 mt-1 group-hover:scale-125 group-hover:translate-y-1 transition-transform duration-300" />
            </div>

            <Button
              size="sm"
              className="mt-4 bg-white text-accent hover:bg-white/90 group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
