/**
 * Dashboard Analytics Tests
 * Tests getDashboardAnalytics helper function
 */

import { testDataFactories } from '../helpers';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    affiliateProgram: {
      count: jest.fn(),
      groupBy: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    affiliateNetwork: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('Dashboard Analytics', () => {
  let prismaMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = require('@/lib/prisma').prisma;
  });

  describe('getDashboardAnalytics', () => {
    it('should fetch all analytics data', async () => {
      // Mock all Prisma calls
      prismaMock.affiliateProgram.count.mockResolvedValue(1000);
      prismaMock.affiliateNetwork.count
        .mockResolvedValueOnce(5) // total networks
        .mockResolvedValueOnce(5); // active networks

      prismaMock.affiliateNetwork.findMany.mockResolvedValue([
        {
          id: '1',
          name: 'Network 1',
          _count: { programs: 500 },
        },
        {
          id: '2',
          name: 'Network 2',
          _count: { programs: 300 },
        },
      ]);

      prismaMock.affiliateProgram.groupBy.mockResolvedValue([
        { category: 'E-commerce', _count: { category: 300 } },
        { category: 'Travel', _count: { category: 200 } },
      ]);

      prismaMock.affiliateProgram.aggregate.mockResolvedValue({
        _avg: { commissionRate: 7.5 },
      });

      prismaMock.affiliateProgram.findMany
        .mockResolvedValueOnce([
          // Top commissions
          {
            id: '1',
            name: 'High Commission Program',
            commissionRate: 25.0,
            commissionType: 'CPS',
            category: 'Finance',
            network: { name: 'Network 1' },
          },
        ])
        .mockResolvedValueOnce([
          // Recent programs
          {
            id: '2',
            name: 'New Program',
            category: 'Tech',
            commissionRate: 10.0,
            createdAt: new Date(),
            network: { name: 'Network 2' },
          },
        ]);

      const { getDashboardAnalytics } = await import('@/lib/dashboard/get-analytics');
      const result = await getDashboardAnalytics();

      // Verify structure
      expect(result).toHaveProperty('overview');
      expect(result).toHaveProperty('programsByNetwork');
      expect(result).toHaveProperty('programsByCategory');
      expect(result).toHaveProperty('topCommissions');
      expect(result).toHaveProperty('recentPrograms');

      // Verify overview
      expect(result.overview.totalPrograms).toBe(1000);
      expect(result.overview.totalNetworks).toBe(5);
      expect(result.overview.activeNetworks).toBe(5);
      expect(result.overview.avgCommission).toBe('7.50');

      // Verify network data
      expect(result.programsByNetwork).toHaveLength(2);
      expect(result.programsByNetwork[0].network).toBe('Network 1');
      expect(result.programsByNetwork[0].programs).toBe(500);

      // Verify category data
      expect(result.programsByCategory).toHaveLength(2);
      expect(result.programsByCategory[0].category).toBe('E-commerce');

      // Verify top commissions
      expect(result.topCommissions).toHaveLength(1);
      expect(result.topCommissions[0].commissionRate).toBe(25.0);

      // Verify recent programs
      expect(result.recentPrograms).toHaveLength(1);
    });

    it('should handle zero average commission', async () => {
      prismaMock.affiliateProgram.count.mockResolvedValue(100);
      prismaMock.affiliateNetwork.count.mockResolvedValue(2);
      prismaMock.affiliateNetwork.findMany.mockResolvedValue([]);
      prismaMock.affiliateProgram.groupBy.mockResolvedValue([]);
      prismaMock.affiliateProgram.aggregate.mockResolvedValue({
        _avg: { commissionRate: null },
      });
      prismaMock.affiliateProgram.findMany.mockResolvedValue([]);

      const { getDashboardAnalytics } = await import('@/lib/dashboard/get-analytics');
      const result = await getDashboardAnalytics();

      expect(result.overview.avgCommission).toBe('0');
    });

    it('should format commission to 2 decimal places', async () => {
      prismaMock.affiliateProgram.count.mockResolvedValue(100);
      prismaMock.affiliateNetwork.count.mockResolvedValue(2);
      prismaMock.affiliateNetwork.findMany.mockResolvedValue([]);
      prismaMock.affiliateProgram.groupBy.mockResolvedValue([]);
      prismaMock.affiliateProgram.aggregate.mockResolvedValue({
        _avg: { commissionRate: 12.345678 },
      });
      prismaMock.affiliateProgram.findMany.mockResolvedValue([]);

      const { getDashboardAnalytics } = await import('@/lib/dashboard/get-analytics');
      const result = await getDashboardAnalytics();

      expect(result.overview.avgCommission).toBe('12.35');
    });
  });
});
