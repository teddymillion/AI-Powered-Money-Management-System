'use client';

import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  icon?: LucideIcon;
  label: string;
  status: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({
  icon: Icon,
  label,
  status,
  size = 'md',
}: StatusBadgeProps) {
  const statusStyles = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    neutral: 'bg-secondary text-muted-foreground border-border/30',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border font-medium transition-all duration-300 hover:scale-105 ${statusStyles[status]} ${sizeStyles[size]}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
    </div>
  );
}
