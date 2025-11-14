// Bulk affiliate program import system
// Resolves C1: Data Starvation (4 → 50,000+ programs)

import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import type { NetworkImportConfig, ImportResult, BulkImportSummary, NetworkProgramData } from './types';

const prisma = new PrismaClient();

export class AffiliateProgramImporter {
  /**
   * Import programs for a single network
   * Handles upsert logic to prevent duplicates
   */
  async importNetwork(config: NetworkImportConfig): Promise<ImportResult> {
    const startTime = Date.now();
    const result: ImportResult = {
      success: false,
      programsImported: 0,
      programsSkipped: 0,
      programsUpdated: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Step 1: Ensure network exists
      const network = await prisma.affiliateNetwork.upsert({
        where: { name: config.networkName },
        update: {
          description: config.networkDescription,
          website: config.networkWebsite,
          country: config.networkCountry,
          updatedAt: new Date(),
        },
        create: {
          name: config.networkName,
          description: config.networkDescription,
          website: config.networkWebsite,
          country: config.networkCountry,
          active: true,
        },
      });

      result.networkId = network.id;

      // Step 2: Import programs in batches
      const batchSize = 100;
      for (let i = 0; i < config.programs.length; i += batchSize) {
        const batch = config.programs.slice(i, i + batchSize);

        try {
          await this.importProgramBatch(network.id, batch, config.dataSource, result);
        } catch (error) {
          const errorMsg = `Batch ${i / batchSize + 1} failed: ${error instanceof Error ? error.message : String(error)}`;
          result.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      return result;
    } catch (error) {
      result.errors.push(`Network import failed: ${error instanceof Error ? error.message : String(error)}`);
      result.duration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Import a batch of programs
   */
  private async importProgramBatch(
    networkId: string,
    programs: NetworkProgramData[],
    dataSource: string,
    result: ImportResult
  ): Promise<void> {
    for (const programData of programs) {
      try {
        // Check if program exists by externalId
        const existing = await prisma.affiliateProgram.findUnique({
          where: {
            networkId_externalId: {
              networkId,
              externalId: programData.externalId,
            },
          },
        });

        if (existing) {
          // Update existing program
          await prisma.affiliateProgram.update({
            where: { id: existing.id },
            data: {
              name: programData.name,
              description: programData.description,
              category: programData.category,
              commissionRate: programData.commissionRate,
              commissionType: programData.commissionType,
              cookieDuration: programData.cookieDuration,
              paymentThreshold: programData.paymentThreshold,
              paymentMethods: programData.paymentMethods || [],
            },
          });
          result.programsUpdated++;
        } else {
          // Create new program
          await prisma.affiliateProgram.create({
            data: {
              networkId,
              externalId: programData.externalId,
              name: programData.name,
              description: programData.description,
              category: programData.category,
              commissionRate: programData.commissionRate,
              commissionType: programData.commissionType,
              cookieDuration: programData.cookieDuration,
              paymentThreshold: programData.paymentThreshold,
              paymentMethods: programData.paymentMethods || [],
              active: true,
            },
          });
          result.programsImported++;
        }
      } catch (error) {
        result.programsSkipped++;
        result.errors.push(`Program '${programData.name}' failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Import multiple networks in bulk
   */
  async importBulk(configs: NetworkImportConfig[]): Promise<BulkImportSummary> {
    const startTime = new Date();
    const results: ImportResult[] = [];
    let totalPrograms = 0;
    let successfulImports = 0;

    for (const config of configs) {
      console.log(`Importing network: ${config.networkName} (${config.programs.length} programs)`);
      const result = await this.importNetwork(config);
      results.push(result);
      totalPrograms += config.programs.length;
      if (result.success) successfulImports++;
    }

    const endTime = new Date();
    const summary: BulkImportSummary = {
      totalNetworks: configs.length,
      totalPrograms,
      successfulImports,
      failedImports: configs.length - successfulImports,
      results,
      startTime,
      endTime,
      duration: endTime.getTime() - startTime.getTime(),
    };

    return summary;
  }

  /**
   * Import from CSV file
   * Expected CSV format:
   * networkName,externalId,name,description,category,commissionRate,commissionType,cookieDuration,paymentThreshold,paymentMethods
   *
   * Example:
   * "ShareASale","12345","Example Program","Great program","E-commerce",5.5,"CPS",30,50,"PayPal,Bank Transfer"
   */
  async importFromCSV(filePath: string, networkName?: string): Promise<ImportResult> {
    const startTime = Date.now();
    const result: ImportResult = {
      success: false,
      programsImported: 0,
      programsSkipped: 0,
      programsUpdated: 0,
      errors: [],
      duration: 0,
    };

    try {
      // Read and parse CSV file
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          // Auto-cast numeric values
          if (context.column === 'commissionRate' ||
              context.column === 'cookieDuration' ||
              context.column === 'paymentThreshold') {
            const num = parseFloat(value);
            return isNaN(num) ? null : num;
          }
          return value;
        },
      }) as Array<{
        networkName?: string;
        externalId: string;
        name: string;
        description?: string;
        category?: string;
        commissionRate?: string | number;
        commissionType?: string;
        cookieDuration?: string | number;
        paymentThreshold?: string | number;
        paymentMethods?: string;
      }>;

      if (records.length === 0) {
        result.errors.push('CSV file is empty or has no valid records');
        result.duration = Date.now() - startTime;
        return result;
      }

      // Group programs by network
      const programsByNetwork = new Map<string, NetworkProgramData[]>();

      for (const record of records) {
        const network = networkName || record.networkName || 'Unknown Network';

        if (!record.externalId || !record.name) {
          result.programsSkipped++;
          result.errors.push(`Skipped row: missing externalId or name`);
          continue;
        }

        const programData: NetworkProgramData = {
          externalId: record.externalId,
          name: record.name,
          description: record.description || undefined,
          category: record.category || undefined,
          commissionRate: typeof record.commissionRate === 'number' ? record.commissionRate : undefined,
          commissionType: record.commissionType || undefined,
          cookieDuration: typeof record.cookieDuration === 'number' ? record.cookieDuration : undefined,
          paymentThreshold: typeof record.paymentThreshold === 'number' ? record.paymentThreshold : undefined,
          paymentMethods: record.paymentMethods
            ? record.paymentMethods.split(',').map(m => m.trim())
            : undefined,
        };

        if (!programsByNetwork.has(network)) {
          programsByNetwork.set(network, []);
        }
        programsByNetwork.get(network)!.push(programData);
      }

      // Import each network
      for (const [network, programs] of programsByNetwork) {
        const config: NetworkImportConfig = {
          networkName: network,
          dataSource: 'csv',
          programs,
        };

        const networkResult = await this.importNetwork(config);

        result.programsImported += networkResult.programsImported;
        result.programsSkipped += networkResult.programsSkipped;
        result.programsUpdated += networkResult.programsUpdated;
        result.errors.push(...networkResult.errors);

        if (!result.networkId && networkResult.networkId) {
          result.networkId = networkResult.networkId;
        }
      }

      result.success = result.errors.length === 0 || result.programsImported > 0;
      result.duration = Date.now() - startTime;

      return result;
    } catch (error) {
      result.errors.push(`CSV import failed: ${error instanceof Error ? error.message : String(error)}`);
      result.duration = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    totalNetworks: number;
    totalPrograms: number;
    programsByNetwork: { networkName: string; count: number }[];
  }> {
    const [totalNetworks, totalPrograms, programsByNetwork] = await Promise.all([
      prisma.affiliateNetwork.count(),
      prisma.affiliateProgram.count(),
      prisma.affiliateNetwork.findMany({
        include: {
          _count: {
            select: { programs: true },
          },
        },
      }),
    ]);

    return {
      totalNetworks,
      totalPrograms,
      programsByNetwork: programsByNetwork.map((network) => ({
        networkName: network.name,
        count: network._count.programs,
      })),
    };
  }
}

export const importer = new AffiliateProgramImporter();
