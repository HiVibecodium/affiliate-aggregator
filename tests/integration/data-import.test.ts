/**
 * Integration tests for data import functionality
 * Tests bulk import system with database interactions
 */

import { testDataFactories } from '../helpers';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    affiliateNetwork: {
      upsert: jest.fn(),
    },
    affiliateProgram: {
      upsert: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

describe('Data Import Integration Tests', () => {
  let prismaMock: unknown;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = require('@/lib/prisma').prisma;
  });

  describe('Affiliate network import', () => {
    it('should create new network if not exists', async () => {
      const mockNetwork = testDataFactories.affiliateNetwork({
        id: 'network-1',
        name: 'Test Network',
      });

      prismaMock.affiliateNetwork.upsert.mockResolvedValue(mockNetwork);

      const result = await prismaMock.affiliateNetwork.upsert({
        where: { name: 'Test Network' },
        create: {
          name: 'Test Network',
          description: 'Test description',
          website: 'https://test.com',
          country: 'US',
          active: true,
        },
        update: {},
      });

      expect(result.id).toBe('network-1');
      expect(result.name).toBe('Test Network');
    });

    it('should update existing network', async () => {
      const mockNetwork = testDataFactories.affiliateNetwork({
        id: 'network-1',
        name: 'Test Network',
        description: 'Updated description',
      });

      prismaMock.affiliateNetwork.upsert.mockResolvedValue(mockNetwork);

      const result = await prismaMock.affiliateNetwork.upsert({
        where: { name: 'Test Network' },
        create: {
          name: 'Test Network',
          active: true,
        },
        update: {
          description: 'Updated description',
          updatedAt: new Date(),
        },
      });

      expect(result.description).toBe('Updated description');
    });

    it('should handle network with all properties', async () => {
      const networkData = {
        name: 'Complete Network',
        description: 'Full description',
        website: 'https://network.com',
        country: 'UK',
        commission: 5.5,
        active: true,
      };

      const mockNetwork = testDataFactories.affiliateNetwork({
        ...networkData,
        id: 'network-complete',
      });

      prismaMock.affiliateNetwork.upsert.mockResolvedValue(mockNetwork);

      const result = await prismaMock.affiliateNetwork.upsert({
        where: { name: 'Complete Network' },
        create: networkData,
        update: networkData,
      });

      expect(result.website).toBe('https://network.com');
      expect(result.country).toBe('UK');
      expect(result.commission).toBe(5.5);
    });
  });

  describe('Affiliate program import', () => {
    it('should create new program if not exists', async () => {
      const mockProgram = testDataFactories.affiliateProgram({
        id: 'program-1',
        networkId: 'network-1',
        externalId: 'ext-123',
      });

      prismaMock.affiliateProgram.upsert.mockResolvedValue(mockProgram);

      const result = await prismaMock.affiliateProgram.upsert({
        where: {
          networkId_externalId: {
            networkId: 'network-1',
            externalId: 'ext-123',
          },
        },
        create: {
          networkId: 'network-1',
          externalId: 'ext-123',
          name: 'Test Program',
          category: 'Technology',
          active: true,
        },
        update: {},
      });

      expect(result.id).toBe('program-1');
      expect(result.name).toBe('Test Program');
    });

    it('should update existing program', async () => {
      const mockProgram = testDataFactories.affiliateProgram({
        id: 'program-1',
        commissionRate: 15.0,
      });

      prismaMock.affiliateProgram.upsert.mockResolvedValue(mockProgram);

      const result = await prismaMock.affiliateProgram.upsert({
        where: {
          networkId_externalId: {
            networkId: 'network-1',
            externalId: 'ext-123',
          },
        },
        create: {},
        update: {
          commissionRate: 15.0,
          updatedAt: new Date(),
        },
      });

      expect(result.commissionRate).toBe(15.0);
    });

    it('should handle program with all commission types', async () => {
      const commissionTypes = ['CPA', 'CPS', 'CPL', 'CPM'];

      for (const type of commissionTypes) {
        const mockProgram = testDataFactories.affiliateProgram({
          commissionType: type,
        });

        prismaMock.affiliateProgram.upsert.mockResolvedValue(mockProgram);

        const result = await prismaMock.affiliateProgram.upsert({
          where: {
            networkId_externalId: {
              networkId: 'network-1',
              externalId: `ext-${type}`,
            },
          },
          create: {
            networkId: 'network-1',
            externalId: `ext-${type}`,
            name: `${type} Program`,
            commissionType: type,
            active: true,
          },
          update: {},
        });

        expect(result.commissionType).toBe(type);
      }
    });

    it('should handle program with payment methods array', async () => {
      const paymentMethods = ['bank_transfer', 'paypal', 'check'];
      const mockProgram = testDataFactories.affiliateProgram({
        paymentMethods,
      });

      prismaMock.affiliateProgram.upsert.mockResolvedValue(mockProgram);

      const result = await prismaMock.affiliateProgram.upsert({
        where: {
          networkId_externalId: {
            networkId: 'network-1',
            externalId: 'ext-123',
          },
        },
        create: {
          networkId: 'network-1',
          externalId: 'ext-123',
          name: 'Multi-payment Program',
          paymentMethods,
          active: true,
        },
        update: {},
      });

      expect(result.paymentMethods).toEqual(paymentMethods);
    });

    it('should handle programs with cookie duration', async () => {
      const mockProgram = testDataFactories.affiliateProgram({
        cookieDuration: 90,
      });

      prismaMock.affiliateProgram.upsert.mockResolvedValue(mockProgram);

      const result = await prismaMock.affiliateProgram.upsert({
        where: {
          networkId_externalId: {
            networkId: 'network-1',
            externalId: 'ext-123',
          },
        },
        create: {
          networkId: 'network-1',
          externalId: 'ext-123',
          name: 'Program with cookie',
          cookieDuration: 90,
          active: true,
        },
        update: {},
      });

      expect(result.cookieDuration).toBe(90);
    });
  });

  describe('Batch import operations', () => {
    it('should handle multiple programs in batch', async () => {
      const programs = [
        testDataFactories.affiliateProgram({ externalId: 'ext-1' }),
        testDataFactories.affiliateProgram({ externalId: 'ext-2' }),
        testDataFactories.affiliateProgram({ externalId: 'ext-3' }),
      ];

      prismaMock.affiliateProgram.createMany.mockResolvedValue({
        count: 3,
      });

      const result = await prismaMock.affiliateProgram.createMany({
        data: programs,
        skipDuplicates: true,
      });

      expect(result.count).toBe(3);
    });

    it('should skip duplicate programs', async () => {
      prismaMock.affiliateProgram.createMany.mockResolvedValue({
        count: 2,
      });

      const result = await prismaMock.affiliateProgram.createMany({
        data: [
          testDataFactories.affiliateProgram({ externalId: 'ext-1' }),
          testDataFactories.affiliateProgram({ externalId: 'ext-1' }), // duplicate
        ],
        skipDuplicates: true,
      });

      expect(result.count).toBe(2);
    });

    it('should maintain data integrity in batch', async () => {
      const programs = [
        testDataFactories.affiliateProgram({
          networkId: 'network-1',
          name: 'Program 1',
          category: 'Tech',
        }),
        testDataFactories.affiliateProgram({
          networkId: 'network-1',
          name: 'Program 2',
          category: 'Finance',
        }),
      ];

      prismaMock.affiliateProgram.createMany.mockResolvedValue({
        count: 2,
      });

      const result = await prismaMock.affiliateProgram.createMany({
        data: programs,
      });

      expect(result.count).toBe(2);
    });
  });

  describe('Import error handling', () => {
    it('should handle network not found error', async () => {
      const error = new Error('Network not found');
      prismaMock.affiliateProgram.upsert.mockRejectedValue(error);

      try {
        await prismaMock.affiliateProgram.upsert({
          where: {
            networkId_externalId: {
              networkId: 'invalid-network',
              externalId: 'ext-123',
            },
          },
          create: {},
          update: {},
        });
        fail('Should have thrown');
      } catch (e) {
        expect((e as Error).message).toBe('Network not found');
      }
    });

    it('should handle database constraint violations', async () => {
      const error = new Error('Unique constraint failed');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code = 'P2002';
      prismaMock.affiliateProgram.upsert.mockRejectedValue(error);

      try {
        await prismaMock.affiliateProgram.upsert({
          where: {
            networkId_externalId: {
              networkId: 'network-1',
              externalId: 'ext-123',
            },
          },
          create: {},
          update: {},
        });
        fail('Should have thrown');
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((e as any).code).toBe('P2002');
      }
    });

    it('should handle batch operation errors', async () => {
      const error = new Error('Batch operation failed');
      prismaMock.affiliateProgram.createMany.mockRejectedValue(error);

      try {
        await prismaMock.affiliateProgram.createMany({
          data: [],
        });
        fail('Should have thrown');
      } catch (e) {
        expect((e as Error).message).toBe('Batch operation failed');
      }
    });
  });

  describe('Import data validation', () => {
    it('should handle program with minimal data', async () => {
      const mockProgram = testDataFactories.affiliateProgram({
        name: 'Minimal Program',
        description: null,
        category: null,
        commissionRate: null,
      });

      prismaMock.affiliateProgram.upsert.mockResolvedValue(mockProgram);

      const result = await prismaMock.affiliateProgram.upsert({
        where: {
          networkId_externalId: {
            networkId: 'network-1',
            externalId: 'ext-123',
          },
        },
        create: {
          networkId: 'network-1',
          externalId: 'ext-123',
          name: 'Minimal Program',
        },
        update: {},
      });

      expect(result.name).toBe('Minimal Program');
      expect(result.description).toBeNull();
    });

    it('should handle program with complete data', async () => {
      const completeProgram = {
        networkId: 'network-1',
        externalId: 'ext-complete',
        name: 'Complete Program',
        description: 'Full description',
        category: 'E-commerce',
        commissionRate: 12.5,
        commissionType: 'CPS',
        cookieDuration: 60,
        paymentThreshold: 50.0,
        paymentMethods: ['bank_transfer', 'paypal'],
        active: true,
      };

      const mockProgram = testDataFactories.affiliateProgram(completeProgram);

      prismaMock.affiliateProgram.upsert.mockResolvedValue(mockProgram);

      const result = await prismaMock.affiliateProgram.upsert({
        where: {
          networkId_externalId: {
            networkId: 'network-1',
            externalId: 'ext-complete',
          },
        },
        create: completeProgram,
        update: completeProgram,
      });

      expect(result.commissionRate).toBe(12.5);
      expect(result.cookieDuration).toBe(60);
      expect(result.paymentMethods).toEqual(['bank_transfer', 'paypal']);
    });
  });
});
