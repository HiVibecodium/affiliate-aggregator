/**
 * Unit tests for Cache module - actual execution
 * Tests real cache functions with execution
 */

import { CacheKeys, getCached, invalidateCache } from '@/lib/cache';

describe('Cache Module - Execution Tests', () => {
  describe('CacheKeys Execution', () => {
    it('should execute PROGRAMS_STATS key', () => {
      const key = CacheKeys.PROGRAMS_STATS;
      expect(key).toBe('programs:stats');
    });

    it('should execute POPULAR_PROGRAMS key', () => {
      const key = CacheKeys.POPULAR_PROGRAMS;
      expect(key).toBe('analytics:popular');
    });

    it('should execute PROGRAMS_FILTERS with no params', () => {
      const key = CacheKeys.PROGRAMS_FILTERS();
      expect(key).toBe('programs:filters');
    });

    it('should execute PROGRAMS_FILTERS with network', () => {
      const key = CacheKeys.PROGRAMS_FILTERS('ShareASale');
      expect(key).toBe('programs:filters:network:ShareASale');
    });

    it('should execute PROGRAMS_FILTERS with category', () => {
      const key = CacheKeys.PROGRAMS_FILTERS(undefined, 'Technology');
      expect(key).toBe('programs:filters:category:Technology');
    });

    it('should execute PROGRAMS_FILTERS with both', () => {
      const key = CacheKeys.PROGRAMS_FILTERS('Awin', 'Fashion');
      expect(key).toBe('programs:filters:network:Awin:category:Fashion');
    });
  });

  describe('getCached Function Execution', () => {
    it('should execute getCached without redis', async () => {
      const fetcher = jest.fn(async () => ({ data: 'test' }));
      const result = await getCached('test-key', fetcher, 300);

      expect(result).toEqual({ data: 'test' });
      expect(fetcher).toHaveBeenCalled();
    });

    it('should execute with default TTL', async () => {
      const fetcher = jest.fn(async () => 'value');
      const result = await getCached('key', fetcher);

      expect(result).toBe('value');
      expect(fetcher).toHaveBeenCalled();
    });

    it('should execute with custom TTL', async () => {
      const fetcher = jest.fn(async () => 123);
      const result = await getCached('key', fetcher, 600);

      expect(result).toBe(123);
      expect(fetcher).toHaveBeenCalled();
    });

    it('should execute with complex data', async () => {
      const complexData = {
        items: [1, 2, 3],
        meta: { count: 3 },
      };

      const fetcher = jest.fn(async () => complexData);
      const result = await getCached('complex', fetcher);

      expect(result).toEqual(complexData);
      expect(fetcher).toHaveBeenCalled();
    });
  });

  describe('invalidateCache Function Execution', () => {
    it('should execute invalidateCache without redis', async () => {
      await expect(invalidateCache('pattern*')).resolves.toBeUndefined();
    });

    it('should execute with different patterns', async () => {
      await expect(invalidateCache('programs:*')).resolves.toBeUndefined();
      await expect(invalidateCache('analytics:*')).resolves.toBeUndefined();
      await expect(invalidateCache('*')).resolves.toBeUndefined();
    });
  });

  describe('Real Function Calls', () => {
    it('should call getCached multiple times', async () => {
      let counter = 0;
      const fetcher = async () => ++counter;

      const result1 = await getCached('counter', fetcher);
      const result2 = await getCached('counter', fetcher);

      expect(result1).toBeGreaterThan(0);
      expect(result2).toBeGreaterThan(0);
    });

    it('should handle fetcher errors', async () => {
      const fetcher = async () => {
        throw new Error('Fetch failed');
      };

      await expect(getCached('error', fetcher)).rejects.toThrow('Fetch failed');
    });
  });
});
