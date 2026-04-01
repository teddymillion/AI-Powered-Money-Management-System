import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { BUDGET_GOALS } from '@/lib/mock-data';
import { Plus, Target, TrendingUp } from 'lucide-react';

export default function BudgetPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-accent" />
              <h1 className="text-3xl font-bold text-foreground">
                Budget & Goals
              </h1>
            </div>
            <p className="text-muted-foreground">
              Track your savings goals and financial targets
            </p>
          </div>
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-lg transition-all hover:scale-105">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Goal</span>
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUDGET_GOALS.map((goal, index) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const remaining = goal.target - goal.current;

            return (
              <Card
                key={goal.id}
                className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border/60 hover:shadow-lg transition-all duration-500 group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
                        {goal.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Goal: <CurrencyDisplay amount={goal.target} />
                      </p>
                    </div>
                    <span className="text-3xl flex-shrink-0 group-hover:scale-125 transition-transform duration-300">{goal.icon}</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {percentage}%
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2.5 bg-secondary rounded-full overflow-hidden"
                      />
                    </div>

                    {/* Amount */}
                    <div className="space-y-1 pt-2 border-t border-border/30">
                      <p className="text-sm font-medium text-foreground">
                        <CurrencyDisplay amount={goal.current} /> of{' '}
                        <CurrencyDisplay amount={goal.target} />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <CurrencyDisplay amount={remaining} /> remaining
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Monthly Budget Overview */}
        <Card className="border-border/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-border/60 hover:shadow-lg transition-all duration-500">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-accent/10 group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Monthly Budget
                </h3>
                <p className="text-sm text-muted-foreground">
                  March 2024 allocation
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Needs */}
              <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group/item cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-foreground group-hover/item:text-accent transition-colors">
                    Needs (50%)
                  </span>
                  <span className="text-sm font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                    <CurrencyDisplay amount={7500} />
                  </span>
                </div>
                <Progress value={50} className="h-3 bg-secondary rounded-full" />
                <p className="text-xs text-muted-foreground mt-2">
                  Rent, utilities, groceries
                </p>
              </div>

              {/* Wants */}
              <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group/item cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-foreground group-hover/item:text-accent transition-colors">
                    Wants (30%)
                  </span>
                  <span className="text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                    <CurrencyDisplay amount={4500} />
                  </span>
                </div>
                <Progress value={30} className="h-3 bg-secondary rounded-full" />
                <p className="text-xs text-muted-foreground mt-2">
                  Entertainment, dining, shopping
                </p>
              </div>

              {/* Savings */}
              <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group/item cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-foreground group-hover/item:text-accent transition-colors">
                    Savings (20%)
                  </span>
                  <span className="text-sm font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
                    <CurrencyDisplay amount={3000} />
                  </span>
                </div>
                <Progress value={20} className="h-3 bg-secondary rounded-full" />
                <p className="text-xs text-muted-foreground mt-2">
                  Emergency fund, goals, investments
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Tips */}
        <Card className="border-border/30 bg-gradient-to-br from-accent/5 to-secondary/30 hover:from-accent/10 hover:to-secondary/40 border-accent/20 hover:border-accent/40 transition-all duration-500 hover:shadow-lg group">
          <div className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/20 flex-shrink-0 group-hover:bg-accent/30 group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">Pro Tip</h4>
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                The 50/30/20 budget rule is a great starting point. Try to allocate
                50% to needs, 30% to wants, and 20% to savings. Adjust based on
                your unique situation and goals.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
