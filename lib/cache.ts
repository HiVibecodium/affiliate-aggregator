/**
 * Redis Cache Wrapper
 * Optional caching layer using Upstash Redis
 * Falls back gracefully if Redis is not configured
 */

import type { Redis } from '@upstash/redis';

let redis: Redis | null = null;

// Initialize Redis only if credentials are provided
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const { Redis: RedisClient } = require('@upstash/redis');
    redis = new RedisClient({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (_error) {
    // Redis not available, caching disabled
    if (process.env.NODE_ENV === 'development') {
      console.warn('Redis not available, caching disabled');
    }
  }
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // If Redis not configured, just fetch
  if (!redis) {
    return fetcher();
  }

  try {
    // Try to get from cache
    const cached = await redis.get(key);

    if (cached) {
      return cached as T;
    }

    // Cache miss - fetch and store
    const data = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    // Redis error - fall back to direct fetch
    if (process.env.NODE_ENV === 'development') {
      console.error('Redis error, falling back:', error);
    }
    return fetcher();
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Cache invalidation error:', error);
    }
  }
}

export const CacheKeys = {
  PROGRAMS_STATS: 'programs:stats',
  PROGRAMS_FILTERS: (network?: string, category?: string) => {
    let key = 'programs:filters';
    if (network) key += `:network:${network}`;
    if (category) key += `:category:${category}`;
    return key;
  },
  POPULAR_PROGRAMS: 'analytics:popular',
};
