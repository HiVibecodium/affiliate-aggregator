/**
 * Program Card Skeleton Loader
 * Beautiful loading state for program cards
 */

export function ProgramCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Title */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Subtitle */}
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        {/* Badges placeholder */}
        <div className="flex flex-col gap-2 ml-4">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Category */}
      <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )
}

/**
 * Multiple skeleton cards
 */
export function ProgramCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProgramCardSkeleton key={i} />
      ))}
    </div>
  )
}
