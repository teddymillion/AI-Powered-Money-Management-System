'use client';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated spinner */}
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-border/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" />
      </div>

      {/* Loading text */}
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
