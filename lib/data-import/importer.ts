// Bulk affiliate program import system
// Resolves C1: Data Starvation (4 → 50,000+ programs)

import { PrismaClient } from '@prisma/client';
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
   */
  async importFromCSV(filePath: string): Promise<ImportResult> {
    // TODO: Implement CSV parsing
    throw new Error('CSV import not yet implemented');
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
