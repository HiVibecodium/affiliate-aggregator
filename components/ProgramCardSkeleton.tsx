'use client';

export function ProgramCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
          {/* Subtitle skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
        <div className="flex flex-col gap-1 ml-4">
          {/* Badge skeletons */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mr-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          </div>
        ))}
      </div>

      {/* Category skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24 inline-block" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

export function ProgramListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProgramCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>

      {/* Search */}
      <div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Selects */}
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}

      {/* Range inputs */}
      <div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-2" />
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}
