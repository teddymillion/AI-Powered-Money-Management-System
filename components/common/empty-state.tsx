'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon background */}
      <div className="mb-6 p-4 rounded-full bg-accent/10">
        <Icon className="w-8 h-8 text-accent" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {/* Action button */}
      {action && (
        <Button
          onClick={action.onClick}
          size="sm"
          className="gap-2 bg-accent hover:bg-accent/90"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
