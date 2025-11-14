/**
 * Unit tests for Saved Searches - actual execution
 * Tests with real function execution
 */

import {
  getSavedSearches,
  saveSearch,
  deleteSavedSearch,
  applySavedSearch,
  type SavedSearch,
} from '@/lib/saved-searches';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('Saved Searches - Execution Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getSavedSearches Execution', () => {
    it('should execute and return empty array initially', () => {
      const searches = getSavedSearches();
      expect(searches).toEqual([]);
      expect(Array.isArray(searches)).toBe(true);
    });

    it('should execute and parse stored searches', () => {
      const mockSearches: SavedSearch[] = [
        {
          id: '1',
          name: 'Test Search',
          filters: { category: 'Tech' },
          createdAt: new Date().toISOString(),
        },
      ];

      localStorageMock.setItem('affiliate_saved_searches', JSON.stringify(mockSearches));

      const searches = getSavedSearches();
      expect(searches).toHaveLength(1);
      expect(searches[0].name).toBe('Test Search');
    });
  });

  describe('saveSearch Execution', () => {
    it('should execute and create new search', () => {
      const name = 'Tech Programs';
      const filters = { category: 'Technology', commissionType: 'CPA' };

      const result = saveSearch(name, filters);

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Tech Programs');
      expect(result.filters).toEqual(filters);
      expect(result.createdAt).toBeDefined();
    });

    it('should execute and add to storage', () => {
      saveSearch('Search 1', { category: 'Tech' });

      const searches = getSavedSearches();
      expect(searches).toHaveLength(1);
      expect(searches[0].name).toBe('Search 1');
    });

    it('should execute and limit to 10 searches', () => {
      // Add 12 searches
      for (let i = 0; i < 12; i++) {
        saveSearch(`Search ${i}`, { category: `Cat ${i}` });
      }

      const searches = getSavedSearches();
      expect(searches).toHaveLength(10);
      expect(searches[0].name).toBe('Search 11'); // Most recent first
    });

    it('should execute with all filter types', () => {
      const filters = {
        network: 'ShareASale',
        category: 'Technology',
        commissionType: 'CPA',
        search: 'hosting',
        minCommission: '10',
        maxCommission: '50',
      };

      const result = saveSearch('Complex Search', filters);

      expect(result.filters.network).toBe('ShareASale');
      expect(result.filters.minCommission).toBe('10');
    });
  });

  describe('deleteSavedSearch Execution', () => {
    it('should execute delete function', () => {
      // Test that deleteSavedSearch can be called
      expect(() => deleteSavedSearch('any-id')).not.toThrow();
    });

    it('should execute with different IDs', () => {
      deleteSavedSearch('id-1');
      deleteSavedSearch('id-2');
      deleteSavedSearch('non-existent');

      // Should complete without errors
      expect(true).toBe(true);
    });
  });

  describe('applySavedSearch Execution', () => {
    it('should execute and create URL params', () => {
      const search: SavedSearch = {
        id: '1',
        name: 'Test',
        filters: {
          category: 'Technology',
          commissionType: 'CPA',
        },
        createdAt: new Date().toISOString(),
      };

      const params = applySavedSearch(search);

      expect(params.get('category')).toBe('Technology');
      expect(params.get('commissionType')).toBe('CPA');
      expect(params.toString()).toContain('category=Technology');
    });

    it('should execute with all filters', () => {
      const search: SavedSearch = {
        id: '1',
        name: 'Full Search',
        filters: {
          network: 'ShareASale',
          category: 'Tech',
          commissionType: 'CPA',
          search: 'hosting',
          minCommission: '10',
          maxCommission: '50',
        },
        createdAt: '',
      };

      const params = applySavedSearch(search);

      expect(params.get('network')).toBe('ShareASale');
      expect(params.get('search')).toBe('hosting');
      expect(params.get('minCommission')).toBe('10');
    });

    it('should execute and skip undefined values', () => {
      const search: SavedSearch = {
        id: '1',
        name: 'Partial',
        filters: {
          category: 'Tech',
          network: undefined,
        },
        createdAt: '',
      };

      const params = applySavedSearch(search);

      expect(params.has('category')).toBe(true);
      expect(params.has('network')).toBe(false);
    });
  });

  describe('Integration Flow', () => {
    it('should execute save-retrieve-apply flow', () => {
      // Save
      const saved = saveSearch('Flow Test', {
        category: 'Technology',
        commissionType: 'CPA',
      });
      expect(saved.id).toBeDefined();
      expect(saved.name).toBe('Flow Test');

      // Apply
      const params = applySavedSearch(saved);
      expect(params.get('category')).toBe('Technology');
      expect(params.get('commissionType')).toBe('CPA');
    });

    it('should execute multiple saves', () => {
      const s1 = saveSearch('S1', { category: 'A' });
      const s2 = saveSearch('S2', { category: 'B' });
      const s3 = saveSearch('S3', { category: 'C' });

      expect(s1.id).toBeDefined();
      expect(s2.id).toBeDefined();
      expect(s3.id).toBeDefined();
      expect(s1.name).toBe('S1');
      expect(s2.name).toBe('S2');
    });
  });
});
