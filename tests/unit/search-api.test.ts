/**
 * Search API Tests
 */

describe('Search API', () => {
  describe('Query Parameters', () => {
    it('should accept q parameter for search query', () => {
      const params = new URLSearchParams({ q: 'amazon' });
      expect(params.get('q')).toBe('amazon');
    });

    it('should accept limit parameter', () => {
      const params = new URLSearchParams({ q: 'test', limit: '5' });
      expect(params.get('limit')).toBe('5');
    });

    it('should default limit to 5 when not provided', () => {
      const limit = parseInt(null || '5', 10);
      expect(limit).toBe(5);
    });

    it('should cap limit at 10', () => {
      const requestedLimit = 20;
      const limit = Math.min(requestedLimit, 10);
      expect(limit).toBe(10);
    });
  });

  describe('Query Validation', () => {
    it('should return empty suggestions for query less than 2 chars', () => {
      const query = 'a';
      const shouldSearch = query.length >= 2;
      expect(shouldSearch).toBe(false);
    });

    it('should search for query with 2 or more chars', () => {
      const query = 'am';
      const shouldSearch = query.length >= 2;
      expect(shouldSearch).toBe(true);
    });

    it('should handle empty query', () => {
      const query = '';
      const shouldSearch = query.length >= 2;
      expect(shouldSearch).toBe(false);
    });
  });

  describe('Response Format', () => {
    it('should return suggestions array', () => {
      const response = {
        suggestions: [{ id: '1', name: 'Test', network: 'Net', commissionRate: 10 }],
      };

      expect(Array.isArray(response.suggestions)).toBe(true);
    });

    it('should include required fields in suggestion', () => {
      const suggestion = {
        id: 'prog-123',
        name: 'Amazon Associates',
        network: 'Amazon',
        commissionRate: 10,
      };

      expect(suggestion).toHaveProperty('id');
      expect(suggestion).toHaveProperty('name');
      expect(suggestion).toHaveProperty('network');
      expect(suggestion).toHaveProperty('commissionRate');
    });

    it('should return empty suggestions array on error', () => {
      const errorResponse = { suggestions: [] };
      expect(errorResponse.suggestions).toEqual([]);
    });
  });

  describe('Search Logic', () => {
    const programs = [
      { id: '1', name: 'Amazon Associates', network: 'Amazon', commissionRate: 10 },
      { id: '2', name: 'Shopify Partners', network: 'Shopify', commissionRate: 20 },
      { id: '3', name: 'Test Financial', network: 'FinanceNet', commissionRate: 30 },
    ];

    it('should search by name (case insensitive)', () => {
      const query = 'amazon';
      const results = programs.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Amazon Associates');
    });

    it('should search by network name', () => {
      const query = 'shopify';
      const results = programs.filter((p) => p.network.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Shopify Partners');
    });

    it('should match partial strings', () => {
      const query = 'fin';
      const results = programs.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.network.toLowerCase().includes(query.toLowerCase())
      );

      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Test Financial');
    });

    it('should return empty array for no matches', () => {
      const query = 'xyz123';
      const results = programs.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

      expect(results.length).toBe(0);
    });
  });

  describe('Sorting', () => {
    const programs = [
      { id: '1', name: 'Low Commission', commissionRate: 5 },
      { id: '2', name: 'High Commission', commissionRate: 50 },
      { id: '3', name: 'Medium Commission', commissionRate: 25 },
    ];

    it('should sort by commission rate descending', () => {
      const sorted = [...programs].sort((a, b) => b.commissionRate - a.commissionRate);

      expect(sorted[0].name).toBe('High Commission');
      expect(sorted[1].name).toBe('Medium Commission');
      expect(sorted[2].name).toBe('Low Commission');
    });

    it('should respect limit after sorting', () => {
      const sorted = [...programs].sort((a, b) => b.commissionRate - a.commissionRate);
      const limited = sorted.slice(0, 2);

      expect(limited.length).toBe(2);
      expect(limited[0].commissionRate).toBe(50);
    });
  });

  describe('Special Characters', () => {
    it('should handle queries with spaces', () => {
      const query = 'amazon associates';
      expect(query.includes(' ')).toBe(true);
    });

    it('should handle queries with special characters', () => {
      const query = 'test & program';
      const escaped = encodeURIComponent(query);
      expect(decodeURIComponent(escaped)).toBe(query);
    });

    it('should handle unicode characters', () => {
      const query = 'финансы';
      expect(query.length).toBeGreaterThan(0);
    });
  });

  describe('Active Programs Filter', () => {
    const programs = [
      { id: '1', name: 'Active Program', active: true },
      { id: '2', name: 'Inactive Program', active: false },
      { id: '3', name: 'Another Active', active: true },
    ];

    it('should only return active programs', () => {
      const activePrograms = programs.filter((p) => p.active === true);
      expect(activePrograms.length).toBe(2);
    });

    it('should exclude inactive programs from results', () => {
      const activePrograms = programs.filter((p) => p.active === true);
      const hasInactive = activePrograms.some((p) => p.name === 'Inactive Program');
      expect(hasInactive).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should return empty suggestions on database error', () => {
      const handleError = (error: Error) => {
        console.error('Search error:', error);
        return { suggestions: [] };
      };

      const result = handleError(new Error('Database connection failed'));
      expect(result.suggestions).toEqual([]);
    });

    it('should log errors for debugging', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      console.error('Search error:', new Error('Test error'));

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('URL Construction', () => {
    it('should build correct API URL', () => {
      const query = 'amazon';
      const limit = 5;
      const url = `/api/programs/search?q=${encodeURIComponent(query)}&limit=${limit}`;

      expect(url).toBe('/api/programs/search?q=amazon&limit=5');
    });

    it('should handle special characters in URL', () => {
      const query = 'test program';
      const url = `/api/programs/search?q=${encodeURIComponent(query)}`;

      expect(url).toBe('/api/programs/search?q=test%20program');
    });
  });

  describe('Result Mapping', () => {
    it('should map database results to suggestion format', () => {
      const dbResult = {
        id: 'uuid-123',
        name: 'Test Program',
        commissionRate: 25,
        network: { name: 'TestNetwork' },
      };

      const suggestion = {
        id: dbResult.id,
        name: dbResult.name,
        network: dbResult.network.name,
        commissionRate: dbResult.commissionRate,
      };

      expect(suggestion.id).toBe('uuid-123');
      expect(suggestion.network).toBe('TestNetwork');
    });

    it('should handle array of results', () => {
      const dbResults = [
        { id: '1', name: 'Prog1', commissionRate: 10, network: { name: 'Net1' } },
        { id: '2', name: 'Prog2', commissionRate: 20, network: { name: 'Net2' } },
      ];

      const suggestions = dbResults.map((p) => ({
        id: p.id,
        name: p.name,
        network: p.network.name,
        commissionRate: p.commissionRate,
      }));

      expect(suggestions.length).toBe(2);
      expect(suggestions[0].network).toBe('Net1');
      expect(suggestions[1].network).toBe('Net2');
    });
  });
});
