import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Predefined skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <Skeleton variant="text" width="60%" height="1.5rem" />
      <Skeleton variant="text" width="100%" height="1rem" />
      <Skeleton variant="text" width="100%" height="1rem" />
      <Skeleton variant="text" width="80%" height="1rem" />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="rounded" width="80px" height="32px" />
        <Skeleton variant="rounded" width="80px" height="32px" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton variant="rectangular" width="100%" height="40px" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" width="100%" height="60px" />
      ))}
    </div>
  );
}

export function ProgramCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" height="1.25rem" />
          <Skeleton variant="text" width="40%" height="0.875rem" />
        </div>
        <Skeleton variant="circular" width="40px" height="40px" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" height="0.875rem" />
        <Skeleton variant="text" width="90%" height="0.875rem" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rounded" width="60px" height="24px" />
        <Skeleton variant="rounded" width="80px" height="24px" />
        <Skeleton variant="rounded" width="70px" height="24px" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton variant="text" width="300px" height="2rem" />
        <Skeleton variant="text" width="200px" height="1rem" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <Skeleton variant="text" width="50%" height="0.875rem" />
            <Skeleton variant="text" width="80%" height="1.5rem" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
