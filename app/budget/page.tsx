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
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Budget & Goals
            </h1>
            <p className="text-muted-foreground">
              Track your savings goals and financial targets
            </p>
          </div>
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Goal</span>
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BUDGET_GOALS.map((goal) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const remaining = goal.target - goal.current;

            return (
              <Card
                key={goal.id}
                className="border-border/30 bg-card hover:border-border/50 transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {goal.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Goal: <CurrencyDisplay amount={goal.target} />
                      </p>
                    </div>
                    <span className="text-3xl flex-shrink-0">{goal.icon}</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">
                          {percentage}%
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2 bg-secondary"
                      />
                    </div>

                    {/* Amount */}
                    <div className="space-y-1">
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
        <Card className="border-border/30 bg-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent/10">
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
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Needs (50%)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <CurrencyDisplay amount={7500} />
                  </span>
                </div>
                <Progress value={50} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground mt-1">
                  Rent, utilities, groceries
                </p>
              </div>

              {/* Wants */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Wants (30%)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <CurrencyDisplay amount={4500} />
                  </span>
                </div>
                <Progress value={30} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground mt-1">
                  Entertainment, dining, shopping
                </p>
              </div>

              {/* Savings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Savings (20%)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <CurrencyDisplay amount={3000} />
                  </span>
                </div>
                <Progress value={20} className="h-2 bg-secondary" />
                <p className="text-xs text-muted-foreground mt-1">
                  Emergency fund, goals, investments
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Tips */}
        <Card className="border-border/30 bg-gradient-to-r from-card to-secondary">
          <div className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/20 flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-2">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
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
