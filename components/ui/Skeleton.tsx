import React from 'react';

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton loading placeholder: used as fallback for dynamic imports
 * and asynchronous content loads. Prevents layout shift (CLS).
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/60 dark:bg-slate-800/60 ${className}`} /* taste-skill-ignore: loading skeleton */
      aria-hidden="true"
    />
  );
}

/**
 * Full-page skeleton for dynamic import loading states.
 * Mimics the general layout of a content section.
 */
export function PageSkeleton({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col h-full p-6 sm:p-8 space-y-6 animate-in fade-in duration-300 bg-white dark:bg-slate-950">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>

      {/* Additional content */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center pt-4">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-heading">{label}</span>
      </div>
    </div>
  );
}

export default Skeleton;
