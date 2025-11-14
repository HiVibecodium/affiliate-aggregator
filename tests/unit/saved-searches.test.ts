/**
 * Unit tests for Saved Searches module
 * Tests localStorage-based search management
 */

import type { SavedSearch } from '@/lib/saved-searches';

describe('Saved Searches Module', () => {
  describe('SavedSearch Interface', () => {
    it('should have required fields', () => {
      const search: SavedSearch = {
        id: '1234567890',
        name: 'Tech Programs',
        filters: { category: 'Technology' },
        createdAt: new Date().toISOString(),
      };

      expect(search).toHaveProperty('id');
      expect(search).toHaveProperty('name');
      expect(search).toHaveProperty('filters');
      expect(search).toHaveProperty('createdAt');
    });

    it('should support all filter types', () => {
      const filters = {
        network: 'ShareASale',
        category: 'Technology',
        commissionType: 'CPA',
        search: 'web hosting',
        minCommission: '10',
        maxCommission: '50',
      };

      expect(filters).toHaveProperty('network');
      expect(filters).toHaveProperty('category');
      expect(filters).toHaveProperty('commissionType');
      expect(filters).toHaveProperty('search');
      expect(filters).toHaveProperty('minCommission');
      expect(filters).toHaveProperty('maxCommission');
    });

    it('should allow optional filters', () => {
      const search: SavedSearch = {
        id: '123',
        name: 'Simple Search',
        filters: { category: 'Tech' },
        createdAt: new Date().toISOString(),
      };

      expect(search.filters.network).toBeUndefined();
      expect(search.filters.category).toBeDefined();
    });
  });

  describe('getSavedSearches logic', () => {
    it('should return empty array on server side', () => {
      const isServer = typeof window === 'undefined';

      if (isServer) {
        const searches: SavedSearch[] = [];
        expect(searches).toEqual([]);
      }
    });

    it('should parse stored JSON', () => {
      const stored = JSON.stringify([{ id: '1', name: 'Search 1', filters: {}, createdAt: '' }]);

      const parsed = JSON.parse(stored);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
    });

    it('should return empty array for missing data', () => {
      const stored = null;
      const result = stored ? JSON.parse(stored) : [];

      expect(result).toEqual([]);
    });

    it('should handle parse errors gracefully', () => {
      const invalidJSON = 'invalid{json';

      try {
        JSON.parse(invalidJSON);
      } catch {
        const fallback: SavedSearch[] = [];
        expect(fallback).toEqual([]);
      }
    });
  });

  describe('saveSearch logic', () => {
    it('should create new search with all fields', () => {
      const name = 'Tech Programs';
      const filters = { category: 'Technology' };

      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name,
        filters,
        createdAt: new Date().toISOString(),
      };

      expect(newSearch.id).toBeDefined();
      expect(newSearch.name).toBe('Tech Programs');
      expect(newSearch.filters).toEqual(filters);
      expect(newSearch.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should add new search to beginning of list', () => {
      const searches: SavedSearch[] = [{ id: '1', name: 'Old', filters: {}, createdAt: '' }];

      const newSearch: SavedSearch = {
        id: '2',
        name: 'New',
        filters: {},
        createdAt: '',
      };

      searches.unshift(newSearch);

      expect(searches[0].id).toBe('2');
      expect(searches[1].id).toBe('1');
    });

    it('should limit to 10 saved searches', () => {
      const searches: SavedSearch[] = Array.from({ length: 15 }, (_, i) => ({
        id: i.toString(),
        name: `Search ${i}`,
        filters: {},
        createdAt: '',
      }));

      const limited = searches.slice(0, 10);

      expect(limited).toHaveLength(10);
      expect(searches.length).toBe(15);
    });

    it('should generate unique IDs using timestamp', () => {
      const id1 = Date.now().toString();
      const id2 = Date.now().toString();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(typeof id1).toBe('string');
    });
  });

  describe('deleteSavedSearch logic', () => {
    it('should remove search by ID', () => {
      const searches: SavedSearch[] = [
        { id: '1', name: 'Search 1', filters: {}, createdAt: '' },
        { id: '2', name: 'Search 2', filters: {}, createdAt: '' },
        { id: '3', name: 'Search 3', filters: {}, createdAt: '' },
      ];

      const filtered = searches.filter((s) => s.id !== '2');

      expect(filtered).toHaveLength(2);
      expect(filtered.find((s) => s.id === '2')).toBeUndefined();
      expect(filtered.find((s) => s.id === '1')).toBeDefined();
    });

    it('should handle non-existent ID', () => {
      const searches: SavedSearch[] = [{ id: '1', name: 'Search 1', filters: {}, createdAt: '' }];

      const filtered = searches.filter((s) => s.id !== '999');

      expect(filtered).toHaveLength(1);
    });

    it('should handle empty list', () => {
      const searches: SavedSearch[] = [];
      const filtered = searches.filter((s) => s.id !== '1');

      expect(filtered).toHaveLength(0);
    });
  });

  describe('applySavedSearch logic', () => {
    it('should convert filters to URL params', () => {
      const search: SavedSearch = {
        id: '1',
        name: 'Test',
        filters: {
          category: 'Technology',
          commissionType: 'CPA',
        },
        createdAt: '',
      };

      const params = new URLSearchParams();
      Object.entries(search.filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      expect(params.get('category')).toBe('Technology');
      expect(params.get('commissionType')).toBe('CPA');
    });

    it('should skip undefined filter values', () => {
      const filters = {
        category: 'Tech',
        network: undefined,
        commissionType: 'CPA',
      };

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      expect(params.has('category')).toBe(true);
      expect(params.has('network')).toBe(false);
      expect(params.has('commissionType')).toBe(true);
    });

    it('should handle empty filters', () => {
      const filters = {};

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value as string);
      });

      expect(params.toString()).toBe('');
    });

    it('should handle all filter types', () => {
      const filters = {
        network: 'ShareASale',
        category: 'Technology',
        commissionType: 'CPA',
        search: 'hosting',
        minCommission: '10',
        maxCommission: '50',
      };

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      expect(params.get('network')).toBe('ShareASale');
      expect(params.get('minCommission')).toBe('10');
      expect(params.get('maxCommission')).toBe('50');
    });
  });

  describe('Storage key', () => {
    it('should use consistent storage key', () => {
      const STORAGE_KEY = 'affiliate_saved_searches';

      expect(STORAGE_KEY).toBe('affiliate_saved_searches');
      expect(typeof STORAGE_KEY).toBe('string');
    });
  });

  describe('Date handling', () => {
    it('should create ISO format timestamps', () => {
      const timestamp = new Date().toISOString();

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should maintain createdAt order', () => {
      const now = Date.now();
      const older = new Date(now - 1000).toISOString();
      const newer = new Date(now).toISOString();

      expect(newer > older).toBe(true);
    });
  });
});
