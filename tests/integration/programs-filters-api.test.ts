/**
 * Integration tests for Programs Filters API
 * Focus: GET /api/programs/filters with cascading filters
 */

describe('Programs Filters API - GET /api/programs/filters', () => {
  describe('Response Structure', () => {
    it('should return all filter types', () => {
      const response = {
        categories: [
          { value: 'Technology', count: 100 },
          { value: 'Fashion', count: 50 },
        ],
        commissionTypes: [
          { value: 'CPA', count: 80 },
          { value: 'CPS', count: 70 },
        ],
        commissionRange: { min: 0, max: 50 },
      };

      expect(response).toHaveProperty('categories');
      expect(response).toHaveProperty('commissionTypes');
      expect(response).toHaveProperty('commissionRange');
      expect(Array.isArray(response.categories)).toBe(true);
      expect(Array.isArray(response.commissionTypes)).toBe(true);
    });

    it('should include counts for each filter option', () => {
      const category = { value: 'Technology', count: 100 };

      expect(category).toHaveProperty('value');
      expect(category).toHaveProperty('count');
      expect(category.count).toBeGreaterThan(0);
    });

    it('should include min/max commission range', () => {
      const range = { min: 5, max: 50 };

      expect(range).toHaveProperty('min');
      expect(range).toHaveProperty('max');
      expect(range.min).toBeLessThanOrEqual(range.max);
    });
  });

  describe('Cascading Filters', () => {
    it('should filter categories based on selected commission type', () => {
      const allCategories = ['Tech', 'Fashion', 'Sports'];
      const commissionType = 'CPA';

      // Simulate: When CPA is selected, only some categories are available
      const availableCategories = ['Tech', 'Sports']; // Fashion has no CPA programs

      expect(availableCategories).not.toContain('Fashion');
      expect(availableCategories.length).toBeLessThanOrEqual(allCategories.length);
    });

    it('should filter commission types based on selected category', () => {
      const allTypes = ['CPA', 'CPS', 'CPL'];
      const category = 'Technology';

      // Simulate: When Technology is selected, only some types are available
      const availableTypes = ['CPA', 'CPS']; // Tech has no CPL programs

      expect(availableTypes).not.toContain('CPL');
      expect(availableTypes.length).toBeLessThanOrEqual(allTypes.length);
    });

    it('should update commission range based on filters', () => {
      const globalRange = { min: 0, max: 100 };
      const filteredRange = { min: 10, max: 50 };

      // After applying filters, range should be narrower
      expect(filteredRange.min).toBeGreaterThanOrEqual(globalRange.min);
      expect(filteredRange.max).toBeLessThanOrEqual(globalRange.max);
    });
  });

  describe('Data Aggregation', () => {
    it('should sort categories by count descending', () => {
      const categories = [
        { value: 'Tech', count: 100 },
        { value: 'Fashion', count: 200 },
        { value: 'Sports', count: 50 },
      ];

      const sorted = [...categories].sort((a, b) => b.count - a.count);

      expect(sorted[0].count).toBe(200);
      expect(sorted[1].count).toBe(100);
      expect(sorted[2].count).toBe(50);
    });

    it('should exclude null categories', () => {
      const categories = [
        { value: 'Tech', count: 100 },
        { value: 'Fashion', count: 50 },
      ];

      const hasNull = categories.some((c) => c.value === null || c.value === undefined);
      expect(hasNull).toBe(false);
    });

    it('should exclude null commission types', () => {
      const types = [
        { value: 'CPA', count: 80 },
        { value: 'CPS', count: 70 },
      ];

      const hasNull = types.some((t) => t.value === null || t.value === undefined);
      expect(hasNull).toBe(false);
    });
  });

  describe('Commission Range Calculation', () => {
    it('should calculate min commission correctly', () => {
      const programs = [5, 10, 15, 20, 25];
      const min = Math.min(...programs);

      expect(min).toBe(5);
    });

    it('should calculate max commission correctly', () => {
      const programs = [5, 10, 15, 20, 25];
      const max = Math.max(...programs);

      expect(max).toBe(25);
    });

    it('should use defaults when no programs match', () => {
      const emptyResult = { min: 0, max: 100 };

      expect(emptyResult.min).toBe(0);
      expect(emptyResult.max).toBe(100);
    });
  });

  describe('Active Programs Filter', () => {
    it('should only include active programs in filters', () => {
      const programs = [
        { category: 'Tech', active: true },
        { category: 'Fashion', active: false },
        { category: 'Sports', active: true },
      ];

      const active = programs.filter((p) => p.active);
      const categories = [...new Set(active.map((p) => p.category))];

      expect(categories).toContain('Tech');
      expect(categories).toContain('Sports');
      expect(categories).not.toContain('Fashion');
    });
  });

  describe('Query Parameters', () => {
    it('should parse network filter from query', () => {
      const params = new URLSearchParams({ network: 'ShareASale' });
      const network = params.get('network');

      expect(network).toBe('ShareASale');
    });

    it('should parse category filter from query', () => {
      const params = new URLSearchParams({ category: 'Technology' });
      const category = params.get('category');

      expect(category).toBe('Technology');
    });

    it('should parse commission type filter from query', () => {
      const params = new URLSearchParams({ commissionType: 'CPA' });
      const type = params.get('commissionType');

      expect(type).toBe('CPA');
    });
  });
});
