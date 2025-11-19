/**
 * Hybrid Cache System
 * - In-memory LRU cache for fast access (primary)
 * - Optional Redis for distributed caching (fallback)
 * Falls back gracefully if Redis is not configured
 */

import type { Redis } from '@upstash/redis';

// In-memory LRU cache to reduce memory usage
class LRUCache<T> {
  private cache: Map<string, { value: T; expiry: number }>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check expiry
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key: string, value: T, ttlSeconds: number): void {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global in-memory cache instance
const memoryCache = new LRUCache<unknown>(100);

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
  // Try in-memory cache first (fastest)
  const memCached = memoryCache.get(key);
  if (memCached) {
    return memCached as T;
  }

  // Try Redis if configured
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        // Store in memory for next time
        memoryCache.set(key, cached as T, ttl);
        return cached as T;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Redis error, continuing with fetch:', error);
      }
    }
  }

  // Cache miss - fetch and store
  const data = await fetcher();

  // Store in memory cache
  memoryCache.set(key, data, ttl);

  // Store in Redis if available
  if (redis) {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      // Redis error - non-critical, already in memory cache
      if (process.env.NODE_ENV === 'development') {
        console.error('Redis setex error:', error);
      }
    }
  }

  return data;
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
