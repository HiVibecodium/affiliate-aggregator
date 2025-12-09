'use client';

/**
 * Mobile-optimized skeleton loading components
 */

export function ProgramCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div className="flex flex-col gap-1 ml-4">
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        ))}
      </div>

      {/* Category */}
      <div className="mb-4">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

export function ProgramListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProgramCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FilterChipsSkeleton() {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 animate-pulse"
        />
      ))}
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <SearchResultSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 animate-pulse"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>

      {/* CTA Button */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />

      {/* Features */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingPageSkeleton() {
  return (
    <div className="space-y-8 px-4 py-12">
      {/* Header */}
      <div className="text-center animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-8" />
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto" />
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <PricingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 animate-pulse">
      {/* Avatar and name */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
    </div>
  );
}

/**
 * Shimmer effect component
 */
export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

/**
 * Inline skeleton text
 */
export function SkeletonText({
  width = 'w-full',
  height = 'h-4',
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`} />
  );
}
