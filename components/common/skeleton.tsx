'use client';

export function SkeletonCard() {
  return (
    <div className="border border-border/30 rounded-lg bg-card/50 p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-gradient-to-r from-secondary to-secondary/50 rounded w-3/4" />
      <div className="space-y-3">
        <div className="h-8 bg-gradient-to-r from-secondary to-secondary/50 rounded w-1/2" />
        <div className="h-4 bg-gradient-to-r from-secondary/40 to-secondary/20 rounded w-full" />
        <div className="h-4 bg-gradient-to-r from-secondary/40 to-secondary/20 rounded w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonLine() {
  return (
    <div className="h-4 bg-gradient-to-r from-secondary to-secondary/50 rounded animate-pulse" />
  );
}

export function SkeletonAvatar() {
  return (
    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary to-secondary/50 animate-pulse" />
  );
}
