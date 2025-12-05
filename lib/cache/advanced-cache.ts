/**
 * Advanced Caching System
 * Multi-tier caching with memory, localStorage, and server-side support
 */

type CacheEntry<T> = {
  value: T;
  expiry: number;
  tags?: string[];
};

// Memory cache for server-side
const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Memory cache with TTL support
 */
export class MemoryCache {
  private static maxSize = 1000;

  static get<T>(key: string): T | null {
    const entry = memoryCache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      memoryCache.delete(key);
      return null;
    }

    return entry.value;
  }

  static set<T>(key: string, value: T, ttlMs: number, tags?: string[]): void {
    // Evict oldest entries if cache is full
    if (memoryCache.size >= this.maxSize) {
      const firstKey = memoryCache.keys().next().value;
      if (firstKey) memoryCache.delete(firstKey);
    }

    memoryCache.set(key, {
      value,
      expiry: Date.now() + ttlMs,
      tags,
    });
  }

  static delete(key: string): void {
    memoryCache.delete(key);
  }

  static invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of memoryCache.entries()) {
      if (entry.tags?.includes(tag)) {
        memoryCache.delete(key);
        count++;
      }
    }
    return count;
  }

  static clear(): void {
    memoryCache.clear();
  }

  static size(): number {
    return memoryCache.size;
  }
}

/**
 * Browser localStorage cache with TTL
 */
export class LocalStorageCache {
  private static prefix = 'aa_cache_';

  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;

      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() > entry.expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return entry.value;
    } catch {
      return null;
    }
  }

  static set<T>(key: string, value: T, ttlMs: number): void {
    if (typeof window === 'undefined') return;

    try {
      const entry: CacheEntry<T> = {
        value,
        expiry: Date.now() + ttlMs,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch {
      // Storage full or quota exceeded
      this.clearExpired();
    }
  }

  static delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.prefix + key);
  }

  static clearExpired(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage).filter((k) => k.startsWith(this.prefix));
    const now = Date.now();

    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const entry = JSON.parse(raw);
          if (now > entry.expiry) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;

    const keys = Object.keys(localStorage).filter((k) => k.startsWith(this.prefix));
    keys.forEach((k) => localStorage.removeItem(k));
  }
}

/**
 * Multi-tier cache that checks memory first, then localStorage
 */
export class TieredCache {
  static async get<T>(
    key: string,
    fetcher?: () => Promise<T>,
    options: { memoryTtl?: number; storageTtl?: number; tags?: string[] } = {}
  ): Promise<T | null> {
    const { memoryTtl = 60000, storageTtl = 300000, tags } = options;

    // Check memory cache first
    const memoryValue = MemoryCache.get<T>(key);
    if (memoryValue !== null) {
      return memoryValue;
    }

    // Check localStorage
    const storageValue = LocalStorageCache.get<T>(key);
    if (storageValue !== null) {
      // Promote to memory cache
      MemoryCache.set(key, storageValue, memoryTtl, tags);
      return storageValue;
    }

    // Fetch if not cached and fetcher provided
    if (fetcher) {
      try {
        const value = await fetcher();
        MemoryCache.set(key, value, memoryTtl, tags);
        LocalStorageCache.set(key, value, storageTtl);
        return value;
      } catch {
        return null;
      }
    }

    return null;
  }

  static set<T>(
    key: string,
    value: T,
    options: { memoryTtl?: number; storageTtl?: number; tags?: string[] } = {}
  ): void {
    const { memoryTtl = 60000, storageTtl = 300000, tags } = options;
    MemoryCache.set(key, value, memoryTtl, tags);
    LocalStorageCache.set(key, value, storageTtl);
  }

  static delete(key: string): void {
    MemoryCache.delete(key);
    LocalStorageCache.delete(key);
  }

  static invalidateByTag(tag: string): void {
    MemoryCache.invalidateByTag(tag);
  }
}

/**
 * Stale-while-revalidate cache pattern
 */
export async function swr<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { staleTtl?: number; maxAge?: number } = {}
): Promise<T> {
  const { staleTtl = 60000, maxAge = 300000 } = options;

  const cached = MemoryCache.get<{ value: T; fetchedAt: number }>(key);
  const now = Date.now();

  if (cached) {
    const age = now - cached.fetchedAt;

    // Return cached if fresh
    if (age < staleTtl) {
      return cached.value;
    }

    // Return stale but revalidate in background
    if (age < maxAge) {
      // Fire and forget revalidation
      fetcher().then((value) => {
        MemoryCache.set(key, { value, fetchedAt: Date.now() }, maxAge);
      });
      return cached.value;
    }
  }

  // Fetch fresh data
  const value = await fetcher();
  MemoryCache.set(key, { value, fetchedAt: now }, maxAge);
  return value;
}

/**
 * Request deduplication - prevents duplicate concurrent requests
 */
const pendingRequests = new Map<string, Promise<unknown>>();

export async function dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const pending = pendingRequests.get(key) as Promise<T> | undefined;
  if (pending) {
    return pending;
  }

  const promise = fetcher().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Batch multiple requests into one
 */
export class BatchLoader<K, V> {
  private batch: Map<K, { resolve: (v: V) => void; reject: (e: Error) => void }[]> = new Map();
  private timeout: NodeJS.Timeout | null = null;

  constructor(
    private loader: (keys: K[]) => Promise<Map<K, V>>,
    private options: { maxBatchSize?: number; delay?: number } = {}
  ) {}

  async load(key: K): Promise<V> {
    return new Promise((resolve, reject) => {
      const existing = this.batch.get(key);
      if (existing) {
        existing.push({ resolve, reject });
      } else {
        this.batch.set(key, [{ resolve, reject }]);
      }

      if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.options.delay || 10);
      }

      if (this.batch.size >= (this.options.maxBatchSize || 100)) {
        this.flush();
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    const batch = this.batch;
    this.batch = new Map();

    const keys = Array.from(batch.keys());
    if (keys.length === 0) return;

    try {
      const results = await this.loader(keys);
      for (const [key, callbacks] of batch.entries()) {
        const value = results.get(key);
        if (value !== undefined) {
          callbacks.forEach((cb) => cb.resolve(value));
        } else {
          callbacks.forEach((cb) => cb.reject(new Error(`No result for key: ${key}`)));
        }
      }
    } catch (error) {
      for (const callbacks of batch.values()) {
        callbacks.forEach((cb) => cb.reject(error as Error));
      }
    }
  }
}
