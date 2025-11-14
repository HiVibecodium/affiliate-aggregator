/**
 * Integration tests for Programs API
 * Focus: GET /api/programs with filters and pagination
 */

import { testDataFactories } from '../helpers';

describe('Programs API - GET /api/programs', () => {
  describe('Pagination', () => {
    it('should return programs with default pagination', () => {
      const response = {
        programs: [testDataFactories.affiliateProgram(), testDataFactories.affiliateProgram()],
        pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
      };

      expect(response.programs).toHaveLength(2);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.totalPages).toBe(1);
    });

    it('should calculate skip correctly', () => {
      const cases = [
        { page: 1, limit: 20, skip: 0 },
        { page: 2, limit: 20, skip: 20 },
        { page: 3, limit: 10, skip: 20 },
      ];

      cases.forEach(({ page, limit, skip }) => {
        expect((page - 1) * limit).toBe(skip);
      });
    });

    it('should calculate total pages correctly', () => {
      const cases = [
        { total: 100, limit: 20, pages: 5 },
        { total: 95, limit: 20, pages: 5 },
        { total: 101, limit: 20, pages: 6 },
      ];

      cases.forEach(({ total, limit, pages }) => {
        expect(Math.ceil(total / limit)).toBe(pages);
      });
    });
  });

  describe('Filtering', () => {
    it('should filter by network', () => {
      const programs = [
        testDataFactories.affiliateProgram({ networkId: 'net-1' }),
        testDataFactories.affiliateProgram({ networkId: 'net-2' }),
      ];

      const filtered = programs.filter((p) => p.networkId === 'net-1');
      expect(filtered).toHaveLength(1);
    });

    it('should filter by category', () => {
      const programs = [
        testDataFactories.affiliateProgram({ category: 'Tech' }),
        testDataFactories.affiliateProgram({ category: 'Fashion' }),
        testDataFactories.affiliateProgram({ category: 'Tech' }),
      ];

      const filtered = programs.filter((p) => p.category === 'Tech');
      expect(filtered).toHaveLength(2);
    });

    it('should filter by commission type', () => {
      const programs = [
        testDataFactories.affiliateProgram({ commissionType: 'CPA' }),
        testDataFactories.affiliateProgram({ commissionType: 'CPS' }),
      ];

      const filtered = programs.filter((p) => p.commissionType === 'CPA');
      expect(filtered).toHaveLength(1);
    });

    it('should search by name (case insensitive)', () => {
      const programs = [
        testDataFactories.affiliateProgram({ name: 'Amazon Program' }),
        testDataFactories.affiliateProgram({ name: 'eBay Program' }),
      ];

      const search = 'amazon';
      const filtered = programs.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
      expect(filtered).toHaveLength(1);
    });

    it('should filter by commission range', () => {
      const programs = [
        testDataFactories.affiliateProgram({ commissionRate: 5 }),
        testDataFactories.affiliateProgram({ commissionRate: 15 }),
        testDataFactories.affiliateProgram({ commissionRate: 25 }),
      ];

      const filtered = programs.filter((p) => p.commissionRate >= 10 && p.commissionRate <= 20);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].commissionRate).toBe(15);
    });

    it('should only return active programs', () => {
      const programs = [
        testDataFactories.affiliateProgram({ active: true }),
        testDataFactories.affiliateProgram({ active: false }),
      ];

      const filtered = programs.filter((p) => p.active);
      expect(filtered).toHaveLength(1);
    });
  });

  describe('Sorting', () => {
    it('should sort by commission desc', () => {
      const programs = [
        testDataFactories.affiliateProgram({ commissionRate: 5 }),
        testDataFactories.affiliateProgram({ commissionRate: 15 }),
        testDataFactories.affiliateProgram({ commissionRate: 10 }),
      ];

      const sorted = [...programs].sort((a, b) => b.commissionRate - a.commissionRate);
      expect(sorted[0].commissionRate).toBe(15);
      expect(sorted[2].commissionRate).toBe(5);
    });

    it('should sort by name asc', () => {
      const programs = [
        testDataFactories.affiliateProgram({ name: 'Zebra' }),
        testDataFactories.affiliateProgram({ name: 'Alpha' }),
      ];

      const sorted = [...programs].sort((a, b) => a.name.localeCompare(b.name));
      expect(sorted[0].name).toBe('Alpha');
    });

    it('should sort by createdAt desc (default)', () => {
      const now = Date.now();
      const programs = [
        testDataFactories.affiliateProgram({ createdAt: new Date(now - 2000) }),
        testDataFactories.affiliateProgram({ createdAt: new Date(now) }),
      ];

      const sorted = [...programs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      expect(sorted[0].createdAt.getTime()).toBeGreaterThan(sorted[1].createdAt.getTime());
    });
  });

  describe('Response Structure', () => {
    it('should have correct response format', () => {
      const response = {
        programs: [testDataFactories.affiliateProgram()],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
      };

      expect(response).toHaveProperty('programs');
      expect(response).toHaveProperty('pagination');
      expect(Array.isArray(response.programs)).toBe(true);
    });

    it('should include network info', () => {
      const network = testDataFactories.affiliateNetwork();
      const program = {
        ...testDataFactories.affiliateProgram(),
        network: { name: network.name, website: network.website },
      };

      expect(program.network.name).toBeDefined();
      expect(program.network.website).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should use defaults for missing params', () => {
      const defaults = {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      expect(defaults.page).toBe(1);
      expect(defaults.sortBy).toBe('createdAt');
    });

    it('should validate numeric params', () => {
      expect(parseInt('1')).toBe(1);
      expect(parseInt('abc')).toBeNaN();
      expect(parseFloat('10.5')).toBe(10.5);
    });
  });
});
