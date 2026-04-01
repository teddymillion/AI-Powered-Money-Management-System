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
    <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${priorityColors[highPriority.priority]}`}>
      {/* Decorative elements */}
      <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full opacity-20 bg-white" />
      <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full opacity-20 bg-white" />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="p-3 rounded-lg bg-white/20 flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {highPriority.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                  {highPriority.description}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-white flex-shrink-0 mt-1" />
            </div>

            <Button
              size="sm"
              className="mt-4 bg-white text-accent hover:bg-white/90"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
