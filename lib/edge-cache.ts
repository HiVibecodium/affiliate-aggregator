/**
 * Edge Caching Utilities
 * Provides cache headers for Vercel Edge Network and CDN caching
 */

import { NextResponse } from 'next/server';

// Cache duration presets (in seconds)
export const CacheDurations = {
  // No cache - for dynamic/personalized content
  NO_CACHE: 0,
  // Short cache - for frequently changing data
  SHORT: 60, // 1 minute
  // Medium cache - for semi-static data
  MEDIUM: 300, // 5 minutes
  // Long cache - for mostly static data
  LONG: 3600, // 1 hour
  // Very long cache - for static assets
  VERY_LONG: 86400, // 24 hours
  // Immutable - for versioned assets
  IMMUTABLE: 31536000, // 1 year
} as const;

export type CacheDuration = (typeof CacheDurations)[keyof typeof CacheDurations];

interface CacheOptions {
  /**
   * Max-age for the cache
   */
  maxAge: number;
  /**
   * Stale-while-revalidate duration
   */
  swr?: number;
  /**
   * Whether content is private (user-specific)
   */
  private?: boolean;
  /**
   * Whether to allow CDN caching
   */
  cdnCache?: boolean;
  /**
   * Custom cache tags for invalidation
   */
  tags?: string[];
}

/**
 * Generate Cache-Control header value
 */
export function getCacheControlHeader(options: CacheOptions): string {
  const parts: string[] = [];

  // Privacy setting
  if (options.private) {
    parts.push('private');
  } else {
    parts.push('public');
  }

  // Max-age
  parts.push(`max-age=${options.maxAge}`);

  // Stale-while-revalidate
  if (options.swr) {
    parts.push(`stale-while-revalidate=${options.swr}`);
  }

  // CDN cache (s-maxage for shared caches)
  if (options.cdnCache && !options.private) {
    parts.push(`s-maxage=${options.maxAge}`);
  }

  return parts.join(', ');
}

/**
 * Apply cache headers to NextResponse
 */
export function withCacheHeaders<T>(
  response: NextResponse<T>,
  options: CacheOptions
): NextResponse<T> {
  response.headers.set('Cache-Control', getCacheControlHeader(options));

  // Vercel-specific cache tags for targeted invalidation
  if (options.tags && options.tags.length > 0) {
    response.headers.set('x-vercel-cache-tags', options.tags.join(','));
  }

  return response;
}

/**
 * Create cached JSON response
 */
export function cachedJson<T>(data: T, options: CacheOptions): NextResponse<T> {
  const response = NextResponse.json(data);
  return withCacheHeaders(response, options);
}

/**
 * Presets for common API patterns
 */
export const CachePresets = {
  /**
   * Static data that rarely changes (programs list, categories)
   */
  static: {
    maxAge: CacheDurations.LONG,
    swr: CacheDurations.MEDIUM,
    cdnCache: true,
  } as CacheOptions,

  /**
   * Semi-dynamic data (stats, analytics)
   */
  semiDynamic: {
    maxAge: CacheDurations.MEDIUM,
    swr: CacheDurations.SHORT,
    cdnCache: true,
  } as CacheOptions,

  /**
   * Dynamic data (search results with many variations)
   */
  dynamic: {
    maxAge: CacheDurations.SHORT,
    swr: CacheDurations.SHORT,
    cdnCache: true,
  } as CacheOptions,

  /**
   * User-specific data (favorites, user settings)
   */
  userSpecific: {
    maxAge: CacheDurations.NO_CACHE,
    private: true,
    cdnCache: false,
  } as CacheOptions,

  /**
   * Immutable versioned assets
   */
  immutable: {
    maxAge: CacheDurations.IMMUTABLE,
    cdnCache: true,
  } as CacheOptions,

  /**
   * Real-time data (no cache)
   */
  realtime: {
    maxAge: CacheDurations.NO_CACHE,
    cdnCache: false,
  } as CacheOptions,
} as const;

/**
 * Stale-While-Revalidate pattern for API routes
 * Returns cached data while fetching fresh data in background
 */
export async function staleWhileRevalidate<T>(
  _cacheKey: string,
  fetcher: () => Promise<T>,
  _options: {
    maxAge: number;
    staleAge: number;
  }
): Promise<{ data: T; stale: boolean }> {
  // This would typically integrate with a cache like Redis or Vercel KV
  // For now, just fetch fresh data
  const data = await fetcher();
  return { data, stale: false };
}

/**
 * Generate ETag for response content
 */
export function generateETag(content: string | object): string {
  const str = typeof content === 'string' ? content : JSON.stringify(content);
  // Simple hash function for ETag
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `"${Math.abs(hash).toString(16)}"`;
}

/**
 * Check if request has matching ETag (for 304 response)
 */
export function checkETag(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get('if-none-match');
  return ifNoneMatch === etag;
}

/**
 * Helper to add Vary header for proper cache key generation
 */
export function addVaryHeader(response: NextResponse, headers: string[]): NextResponse {
  response.headers.set('Vary', headers.join(', '));
  return response;
}
