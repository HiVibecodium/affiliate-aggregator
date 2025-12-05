/**
 * Tests for Advanced Caching System
 */

import { MemoryCache, TieredCache, swr, dedupe, BatchLoader } from '@/lib/cache/advanced-cache';

describe('MemoryCache', () => {
  beforeEach(() => {
    MemoryCache.clear();
  });

  test('should set and get values', () => {
    MemoryCache.set('key1', 'value1', 10000);
    expect(MemoryCache.get('key1')).toBe('value1');
  });

  test('should return null for non-existent keys', () => {
    expect(MemoryCache.get('nonexistent')).toBeNull();
  });

  test('should expire values after TTL', async () => {
    MemoryCache.set('expiring', 'value', 50);
    expect(MemoryCache.get('expiring')).toBe('value');

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(MemoryCache.get('expiring')).toBeNull();
  });

  test('should delete values', () => {
    MemoryCache.set('deletable', 'value', 10000);
    MemoryCache.delete('deletable');
    expect(MemoryCache.get('deletable')).toBeNull();
  });

  test('should invalidate by tag', () => {
    MemoryCache.set('tagged1', 'value1', 10000, ['tag1']);
    MemoryCache.set('tagged2', 'value2', 10000, ['tag1']);
    MemoryCache.set('untagged', 'value3', 10000, ['tag2']);

    const invalidated = MemoryCache.invalidateByTag('tag1');
    expect(invalidated).toBe(2);
    expect(MemoryCache.get('tagged1')).toBeNull();
    expect(MemoryCache.get('tagged2')).toBeNull();
    expect(MemoryCache.get('untagged')).toBe('value3');
  });

  test('should track size correctly', () => {
    expect(MemoryCache.size()).toBe(0);
    MemoryCache.set('key1', 'value1', 10000);
    expect(MemoryCache.size()).toBe(1);
    MemoryCache.set('key2', 'value2', 10000);
    expect(MemoryCache.size()).toBe(2);
    MemoryCache.clear();
    expect(MemoryCache.size()).toBe(0);
  });
});

describe('TieredCache', () => {
  beforeEach(() => {
    MemoryCache.clear();
  });

  test('should fetch and cache data', async () => {
    let fetchCount = 0;
    const fetcher = async () => {
      fetchCount++;
      return { data: 'test' };
    };

    // First call should fetch
    const result1 = await TieredCache.get('tiered-key', fetcher);
    expect(result1).toEqual({ data: 'test' });
    expect(fetchCount).toBe(1);

    // Second call should use cache
    const result2 = await TieredCache.get('tiered-key', fetcher);
    expect(result2).toEqual({ data: 'test' });
    expect(fetchCount).toBe(1);
  });

  test('should set values directly', async () => {
    TieredCache.set('direct-key', { value: 123 });
    const result = await TieredCache.get('direct-key');
    expect(result).toEqual({ value: 123 });
  });

  test('should delete from all tiers', async () => {
    TieredCache.set('to-delete', 'value');
    expect(await TieredCache.get('to-delete')).toBe('value');

    TieredCache.delete('to-delete');
    expect(await TieredCache.get('to-delete')).toBeNull();
  });
});

describe('swr (Stale While Revalidate)', () => {
  beforeEach(() => {
    MemoryCache.clear();
  });

  test('should fetch fresh data on first call', async () => {
    let fetchCount = 0;
    const fetcher = async () => {
      fetchCount++;
      return 'fresh-data';
    };

    const result = await swr('swr-key', fetcher, { staleTtl: 100, maxAge: 1000 });
    expect(result).toBe('fresh-data');
    expect(fetchCount).toBe(1);
  });

  test('should return cached data if fresh', async () => {
    let fetchCount = 0;
    const fetcher = async () => {
      fetchCount++;
      return `data-${fetchCount}`;
    };

    await swr('swr-fresh', fetcher, { staleTtl: 1000, maxAge: 5000 });
    const result = await swr('swr-fresh', fetcher, { staleTtl: 1000, maxAge: 5000 });

    expect(result).toBe('data-1');
    expect(fetchCount).toBe(1);
  });
});

describe('dedupe', () => {
  test('should deduplicate concurrent requests', async () => {
    let fetchCount = 0;
    const slowFetcher = async () => {
      fetchCount++;
      await new Promise((resolve) => setTimeout(resolve, 50));
      return 'result';
    };

    // Fire concurrent requests
    const [result1, result2, result3] = await Promise.all([
      dedupe('dedupe-key', slowFetcher),
      dedupe('dedupe-key', slowFetcher),
      dedupe('dedupe-key', slowFetcher),
    ]);

    expect(result1).toBe('result');
    expect(result2).toBe('result');
    expect(result3).toBe('result');
    expect(fetchCount).toBe(1); // Should only fetch once
  });

  test('should allow new requests after completion', async () => {
    let fetchCount = 0;
    const fetcher = async () => {
      fetchCount++;
      return `result-${fetchCount}`;
    };

    await dedupe('dedupe-new', fetcher);
    await dedupe('dedupe-new', fetcher);

    expect(fetchCount).toBe(2); // Should fetch twice (sequentially)
  });
});

describe('BatchLoader', () => {
  test('should batch multiple requests', async () => {
    let batchCount = 0;
    const loader = new BatchLoader<string, string>(
      async (keys) => {
        batchCount++;
        const results = new Map<string, string>();
        keys.forEach((key) => results.set(key, `value-${key}`));
        return results;
      },
      { delay: 10 }
    );

    // Fire concurrent loads
    const [result1, result2, result3] = await Promise.all([
      loader.load('a'),
      loader.load('b'),
      loader.load('c'),
    ]);

    expect(result1).toBe('value-a');
    expect(result2).toBe('value-b');
    expect(result3).toBe('value-c');
    expect(batchCount).toBe(1); // Should batch all into one request
  });

  test('should handle missing keys', async () => {
    const loader = new BatchLoader<string, string>(async (keys) => {
      const results = new Map<string, string>();
      // Only return keys that don't start with 'missing'
      keys
        .filter((k) => !k.startsWith('missing'))
        .forEach((key) => results.set(key, `value-${key}`));
      return results;
    });

    // Load two keys concurrently - one exists, one doesn't
    const existingPromise = loader.load('existing');
    const missingPromise = loader.load('missing-key');

    const result = await existingPromise;
    expect(result).toBe('value-existing');

    await expect(missingPromise).rejects.toThrow('No result for key');
  });
});
