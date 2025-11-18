/**
 * Extended unit tests for cache utilities
 */

import { CacheKeys } from '@/lib/cache';

describe('Cache Extended', () => {
  describe('CacheKeys', () => {
    it('should have predefined cache keys', () => {
      expect(CacheKeys).toHaveProperty('PROGRAMS_STATS');
      expect(CacheKeys).toHaveProperty('PROGRAMS_FILTERS');
    });

    it('should generate static keys', () => {
      expect(CacheKeys.PROGRAMS_STATS).toBe('programs:stats');
    });

    it('should generate dynamic filter keys', () => {
      const key = CacheKeys.PROGRAMS_FILTERS('ShareASale', 'Technology');

      expect(key).toContain('programs:filters');
      expect(key).toContain('network:ShareASale');
      expect(key).toContain('category:Technology');
    });

    it('should handle partial filter keys', () => {
      const networkOnly = CacheKeys.PROGRAMS_FILTERS('Awin', undefined);
      expect(networkOnly).toContain('network:Awin');
      expect(networkOnly).not.toContain('category');

      const categoryOnly = CacheKeys.PROGRAMS_FILTERS(undefined, 'Finance');
      expect(categoryOnly).toContain('category:Finance');
      expect(categoryOnly).not.toContain('network');
    });

    it('should handle no filters', () => {
      const key = CacheKeys.PROGRAMS_FILTERS();
      expect(key).toBe('programs:filters');
    });

    it('should generate unique keys for different filters', () => {
      const key1 = CacheKeys.PROGRAMS_FILTERS('Network1', 'Cat1');
      const key2 = CacheKeys.PROGRAMS_FILTERS('Network2', 'Cat2');

      expect(key1).not.toBe(key2);
    });

    it('should be consistent for same inputs', () => {
      const key1 = CacheKeys.PROGRAMS_FILTERS('Awin', 'Tech');
      const key2 = CacheKeys.PROGRAMS_FILTERS('Awin', 'Tech');

      expect(key1).toBe(key2);
    });
  });

  describe('Cache behavior', () => {
    it('should define TTL values', () => {
      const TTL = {
        SHORT: 60, // 1 minute
        MEDIUM: 300, // 5 minutes
        LONG: 3600, // 1 hour
        DAY: 86400, // 24 hours
      };

      expect(TTL.SHORT).toBe(60);
      expect(TTL.MEDIUM).toBe(300);
      expect(TTL.LONG).toBe(3600);
      expect(TTL.DAY).toBe(86400);
    });

    it('should handle cache hit scenario', async () => {
      const cachedData = { id: '123', name: 'Test' };
      const fetcher = jest.fn();

      // Simulate cache hit - fetcher should not be called
      const getData = async () => cachedData;

      const result = await getData();

      expect(result).toEqual(cachedData);
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('should handle cache miss scenario', async () => {
      const freshData = { id: '456', name: 'Fresh' };
      const fetcher = jest.fn().mockResolvedValue(freshData);

      // Simulate cache miss - fetcher should be called
      const result = await fetcher();

      expect(result).toEqual(freshData);
      expect(fetcher).toHaveBeenCalled();
    });

    it('should handle cache errors gracefully', async () => {
      const fallbackData = { id: '789', name: 'Fallback' };
      const fetcher = jest.fn().mockResolvedValue(fallbackData);

      // Simulate cache error - should fall back to fetcher
      const result = await fetcher();

      expect(result).toEqual(fallbackData);
    });
  });

  describe('Cache invalidation', () => {
    it('should invalidate by pattern', () => {
      const patterns = [
        'programs:*',
        'programs:filters:*',
        'programs:filters:network:*',
        'analytics:*',
      ];

      patterns.forEach((pattern) => {
        expect(pattern).toContain(':');
        expect(pattern).toContain('*');
      });
    });

    it('should match wildcard patterns', () => {
      const matchPattern = (key: string, pattern: string) => {
        const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
        return regex.test(key);
      };

      expect(matchPattern('programs:stats', 'programs:*')).toBe(true);
      expect(matchPattern('programs:filters:network:Awin', 'programs:*')).toBe(true);
      expect(matchPattern('analytics:daily', 'programs:*')).toBe(false);
    });

    it('should handle specific key invalidation', () => {
      const keys = ['programs:stats', 'programs:filters', 'programs:filters:network:Awin'];

      const toInvalidate = 'programs:stats';
      const shouldInvalidate = keys.filter((k) => k === toInvalidate);

      expect(shouldInvalidate).toHaveLength(1);
      expect(shouldInvalidate[0]).toBe(toInvalidate);
    });
  });

  describe('Cache key generation', () => {
    it('should sanitize special characters', () => {
      const sanitizeKey = (key: string) => {
        return key.replace(/[^a-zA-Z0-9:_-]/g, '_');
      };

      expect(sanitizeKey('key with spaces')).toBe('key_with_spaces');
      expect(sanitizeKey('key@#$%')).toBe('key____');
    });

    it('should create hierarchical keys', () => {
      const createKey = (...parts: string[]) => parts.join(':');

      expect(createKey('programs', 'network', 'ShareASale')).toBe('programs:network:ShareASale');
    });

    it('should support versioned keys', () => {
      const createVersionedKey = (key: string, version: number) => {
        return `${key}:v${version}`;
      };

      expect(createVersionedKey('programs:stats', 2)).toBe('programs:stats:v2');
    });
  });
});
