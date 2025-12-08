'use client';

import dynamic from 'next/dynamic';
import { ProgramListSkeleton, FiltersSkeleton } from './ProgramCardSkeleton';

// Lazy load QuickViewModal - only loaded when user clicks quick view
export const LazyQuickViewModal = dynamic(
  () => import('./QuickViewModal').then((mod) => ({ default: mod.QuickViewModal })),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load MobileFilterSheet - only on mobile
export const LazyMobileFilterSheet = dynamic(
  () => import('./MobileFilterSheet').then((mod) => ({ default: mod.MobileFilterSheet })),
  {
    loading: () => <FiltersSkeleton />,
    ssr: false,
  }
);

// Lazy load ComparisonBar - only when items are in comparison
export const LazyComparisonBar = dynamic(
  () => import('./ComparisonBar').then((mod) => ({ default: mod.ComparisonBar })),
  {
    ssr: false,
  }
);

// Lazy load TourButton - not critical for initial render
export const LazyTourButton = dynamic(
  () => import('./TourButton').then((mod) => ({ default: mod.TourButton })),
  {
    ssr: false,
  }
);

// Lazy load SearchSuggestions - only when user types
export const LazySearchSuggestions = dynamic(
  () => import('./SearchSuggestions').then((mod) => ({ default: mod.SearchSuggestions })),
  {
    ssr: false,
  }
);

// Lazy load HeroSearch for homepage
export const LazyHeroSearch = dynamic(
  () => import('./HeroSearch').then((mod) => ({ default: mod.HeroSearch })),
  {
    loading: () => (
      <div className="w-full max-w-2xl mx-auto">
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
      </div>
    ),
    ssr: false,
  }
);

// Lazy load EnhancedProgramCard for program lists
export const LazyEnhancedProgramCard = dynamic(
  () => import('./EnhancedProgramCard').then((mod) => ({ default: mod.EnhancedProgramCard })),
  {
    loading: () => (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </div>
    ),
  }
);

// Export skeleton as well for direct use
export { ProgramListSkeleton, FiltersSkeleton };
