/**
 * Data Importer Tests
 */

import type { NetworkImportConfig, NetworkProgramData } from '@/lib/data-import/types';

// Mock PrismaClient - needs to be before any imports that use it
const mockUpsert = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockCreate = jest.fn();
const mockCount = jest.fn();
const mockFindMany = jest.fn();

const mockPrismaInstance = {
  affiliateNetwork: {
    upsert: mockUpsert,
    count: mockCount,
    findMany: mockFindMany,
  },
  affiliateProgram: {
    findUnique: mockFindUnique,
    update: mockUpdate,
    create: mockCreate,
    count: mockCount,
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaInstance),
}));

// Mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

// Mock csv-parse
jest.mock('csv-parse/sync', () => ({
  parse: jest.fn(),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

// Import after mocks are set up
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

// Late import to allow mocks to be in place
let AffiliateProgramImporter: typeof import('@/lib/data-import/importer').AffiliateProgramImporter;
let importer: import('@/lib/data-import/importer').AffiliateProgramImporter;

describe('AffiliateProgramImporter', () => {
  let importerInstance: InstanceType<typeof AffiliateProgramImporter>;

  beforeAll(async () => {
    // Dynamic import after mocks are set up
    const importerModule = await import('@/lib/data-import/importer');
    AffiliateProgramImporter = importerModule.AffiliateProgramImporter;
    importer = importerModule.importer;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    importerInstance = new AffiliateProgramImporter();
  });

  describe('importNetwork', () => {
    const mockConfig: NetworkImportConfig = {
      networkName: 'TestNetwork',
      networkDescription: 'Test description',
      networkWebsite: 'https://test.com',
      networkCountry: 'US',
      dataSource: 'api',
      programs: [
        {
          externalId: 'TEST001',
          name: 'Test Program 1',
          description: 'Description 1',
          category: 'E-commerce',
          commissionRate: 10,
          commissionType: 'CPS',
          cookieDuration: 30,
          paymentThreshold: 50,
          paymentMethods: ['PayPal', 'Bank Transfer'],
        },
        {
          externalId: 'TEST002',
          name: 'Test Program 2',
          category: 'Finance',
          commissionRate: 15,
          commissionType: 'CPA',
          cookieDuration: 45,
          paymentThreshold: 100,
        },
      ],
    };

    it('creates network and imports new programs', async () => {
      mockUpsert.mockResolvedValue({ id: 'network-1', name: 'TestNetwork' });
      mockFindUnique.mockResolvedValue(null); // Programs don't exist
      mockCreate.mockResolvedValue({ id: 'program-1' });

      const result = await importerInstance.importNetwork(mockConfig);

      expect(result.success).toBe(true);
      expect(result.programsImported).toBe(2);
      expect(result.programsUpdated).toBe(0);
      expect(result.programsSkipped).toBe(0);
      expect(result.networkId).toBe('network-1');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('updates existing programs', async () => {
      mockUpsert.mockResolvedValue({ id: 'network-1', name: 'TestNetwork' });
      mockFindUnique.mockResolvedValue({ id: 'existing-program' }); // Programs exist
      mockUpdate.mockResolvedValue({ id: 'existing-program' });

      const result = await importerInstance.importNetwork(mockConfig);

      expect(result.success).toBe(true);
      expect(result.programsImported).toBe(0);
      expect(result.programsUpdated).toBe(2);
    });

    it('handles mixed new and existing programs', async () => {
      mockUpsert.mockResolvedValue({ id: 'network-1', name: 'TestNetwork' });
      mockFindUnique
        .mockResolvedValueOnce(null) // First program doesn't exist
        .mockResolvedValueOnce({ id: 'existing-program' }); // Second exists
      mockCreate.mockResolvedValue({ id: 'new-program' });
      mockUpdate.mockResolvedValue({ id: 'existing-program' });

      const result = await importerInstance.importNetwork(mockConfig);

      expect(result.programsImported).toBe(1);
      expect(result.programsUpdated).toBe(1);
    });

    it('handles program import errors', async () => {
      mockUpsert.mockResolvedValue({ id: 'network-1', name: 'TestNetwork' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate
        .mockResolvedValueOnce({ id: 'program-1' })
        .mockRejectedValueOnce(new Error('DB constraint error'));

      const result = await importerInstance.importNetwork(mockConfig);

      expect(result.programsImported).toBe(1);
      expect(result.programsSkipped).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Test Program 2');
    });

    it('handles network upsert failure', async () => {
      mockUpsert.mockRejectedValue(new Error('Network creation failed'));

      const result = await importerInstance.importNetwork(mockConfig);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Network import failed');
    });

    it('processes programs in batches', async () => {
      const manyPrograms: NetworkProgramData[] = Array.from({ length: 250 }, (_, i) => ({
        externalId: `PROG${i.toString().padStart(3, '0')}`,
        name: `Program ${i}`,
        commissionRate: 10,
        commissionType: 'CPS',
      }));

      const largeConfig: NetworkImportConfig = {
        ...mockConfig,
        programs: manyPrograms,
      };

      mockUpsert.mockResolvedValue({ id: 'network-1' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program' });

      const result = await importerInstance.importNetwork(largeConfig);

      expect(result.programsImported).toBe(250);
    });

    it('continues after batch failure', async () => {
      const batchConfig: NetworkImportConfig = {
        ...mockConfig,
        programs: Array.from({ length: 150 }, (_, i) => ({
          externalId: `PROG${i}`,
          name: `Program ${i}`,
          commissionRate: 10,
          commissionType: 'CPS',
        })),
      };

      mockUpsert.mockResolvedValue({ id: 'network-1' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program' });

      const result = await importerInstance.importNetwork(batchConfig);

      expect(result.programsImported).toBe(150);
    });
  });

  describe('importBulk', () => {
    it('imports multiple networks', async () => {
      const configs: NetworkImportConfig[] = [
        {
          networkName: 'Network1',
          dataSource: 'api',
          programs: [
            { externalId: 'P1', name: 'Program 1', commissionRate: 10, commissionType: 'CPS' },
          ],
        },
        {
          networkName: 'Network2',
          dataSource: 'api',
          programs: [
            { externalId: 'P2', name: 'Program 2', commissionRate: 15, commissionType: 'CPA' },
          ],
        },
      ];

      mockUpsert.mockResolvedValue({ id: 'network-id' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program-id' });

      const summary = await importerInstance.importBulk(configs);

      expect(summary.totalNetworks).toBe(2);
      expect(summary.totalPrograms).toBe(2);
      expect(summary.successfulImports).toBe(2);
      expect(summary.failedImports).toBe(0);
      expect(summary.results.length).toBe(2);
      expect(summary.duration).toBeGreaterThanOrEqual(0);
    });

    it('tracks failed network imports', async () => {
      const configs: NetworkImportConfig[] = [
        {
          networkName: 'Network1',
          dataSource: 'api',
          programs: [
            { externalId: 'P1', name: 'Program 1', commissionRate: 10, commissionType: 'CPS' },
          ],
        },
        {
          networkName: 'Network2',
          dataSource: 'api',
          programs: [
            { externalId: 'P2', name: 'Program 2', commissionRate: 15, commissionType: 'CPA' },
          ],
        },
      ];

      mockUpsert
        .mockResolvedValueOnce({ id: 'network-1' })
        .mockRejectedValueOnce(new Error('Network2 failed'));
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program-id' });

      const summary = await importerInstance.importBulk(configs);

      expect(summary.successfulImports).toBe(1);
      expect(summary.failedImports).toBe(1);
    });
  });

  describe('importFromCSV', () => {
    it('imports programs from CSV file', async () => {
      const csvContent = 'header line';
      (fs.readFileSync as jest.Mock).mockReturnValue(csvContent);
      (parse as jest.Mock).mockReturnValue([
        {
          networkName: 'CSVNetwork',
          externalId: 'CSV001',
          name: 'CSV Program',
          description: 'Imported from CSV',
          category: 'Tech',
          commissionRate: 12,
          commissionType: 'CPS',
          cookieDuration: 30,
          paymentThreshold: 25,
          paymentMethods: 'PayPal,Wire',
        },
      ]);

      mockUpsert.mockResolvedValue({ id: 'network-1' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program-1' });

      const result = await importerInstance.importFromCSV('/path/to/file.csv');

      expect(result.success).toBe(true);
      expect(result.programsImported).toBe(1);
    });

    it('uses provided network name', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('csv');
      (parse as jest.Mock).mockReturnValue([
        {
          externalId: 'CSV001',
          name: 'CSV Program',
          commissionRate: 10,
          commissionType: 'CPS',
        },
      ]);

      mockUpsert.mockResolvedValue({ id: 'network-1' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program-1' });

      await importerInstance.importFromCSV('/path/to/file.csv', 'CustomNetwork');

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: 'CustomNetwork' },
        })
      );
    });

    it('skips rows with missing required fields', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('csv');
      (parse as jest.Mock).mockReturnValue([
        { externalId: 'CSV001', name: 'Valid Program', commissionRate: 10, commissionType: 'CPS' },
        { externalId: '', name: 'Missing ID', commissionRate: 10, commissionType: 'CPS' },
        { externalId: 'CSV002', name: '', commissionRate: 10, commissionType: 'CPS' },
      ]);

      mockUpsert.mockResolvedValue({ id: 'network-1' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program-1' });

      const result = await importerInstance.importFromCSV('/path/to/file.csv');

      expect(result.programsImported).toBe(1);
      expect(result.programsSkipped).toBe(2);
    });

    it('handles empty CSV file', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('');
      (parse as jest.Mock).mockReturnValue([]);

      const result = await importerInstance.importFromCSV('/path/to/file.csv');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('CSV file is empty or has no valid records');
    });

    it('handles file read error', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      const result = await importerInstance.importFromCSV('/nonexistent/file.csv');

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('CSV import failed');
    });

    it('parses payment methods from comma-separated string', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('csv');
      (parse as jest.Mock).mockReturnValue([
        {
          externalId: 'CSV001',
          name: 'Program',
          commissionRate: 10,
          commissionType: 'CPS',
          paymentMethods: 'PayPal, Bank Transfer, Check',
        },
      ]);

      mockUpsert.mockResolvedValue({ id: 'network-1' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program-1' });

      await importerInstance.importFromCSV('/path/to/file.csv');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            paymentMethods: ['PayPal', 'Bank Transfer', 'Check'],
          }),
        })
      );
    });

    it('groups programs by network from CSV', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('csv');
      (parse as jest.Mock).mockReturnValue([
        {
          networkName: 'Network1',
          externalId: 'P1',
          name: 'Program 1',
          commissionRate: 10,
          commissionType: 'CPS',
        },
        {
          networkName: 'Network2',
          externalId: 'P2',
          name: 'Program 2',
          commissionRate: 15,
          commissionType: 'CPA',
        },
        {
          networkName: 'Network1',
          externalId: 'P3',
          name: 'Program 3',
          commissionRate: 12,
          commissionType: 'CPS',
        },
      ]);

      mockUpsert.mockResolvedValue({ id: 'network-id' });
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ id: 'program-id' });

      const result = await importerInstance.importFromCSV('/path/to/file.csv');

      expect(result.programsImported).toBe(3);
      // Should have called upsert for 2 different networks
      expect(mockUpsert).toHaveBeenCalledTimes(2);
    });
  });

  describe('getImportStats', () => {
    it('returns import statistics', async () => {
      mockCount.mockResolvedValueOnce(5).mockResolvedValueOnce(500);
      mockFindMany.mockResolvedValue([
        { name: 'Network1', _count: { programs: 200 } },
        { name: 'Network2', _count: { programs: 300 } },
      ]);

      const stats = await importerInstance.getImportStats();

      expect(stats.totalNetworks).toBe(5);
      expect(stats.totalPrograms).toBe(500);
      expect(stats.programsByNetwork).toEqual([
        { networkName: 'Network1', count: 200 },
        { networkName: 'Network2', count: 300 },
      ]);
    });
  });

  describe('exported importer instance', () => {
    it('exports singleton importer instance', () => {
      expect(importer).toBeDefined();
      expect(importer).toBeInstanceOf(AffiliateProgramImporter);
    });
  });
});
