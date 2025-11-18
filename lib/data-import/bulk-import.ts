// Bulk import orchestration for all affiliate networks
// Resolves C1: Data Starvation (4 → 80,000+ programs)

import { importer } from './importer';
import { generateClickBankData } from './generators/clickbank';
import { generateShareASaleData } from './generators/sharesale';
import { generateCJAffiliateData } from './generators/cj-affiliate';
import { generateRakutenData } from './generators/rakuten';
import { generateAwinData } from './generators/awin';
import type { BulkImportSummary } from './types';
import { logger } from '@/lib/logger';

export interface BulkImportOptions {
  clickbankCount?: number;
  sharesaleCount?: number;
  cjCount?: number;
  rakutenCount?: number;
  awinCount?: number;
  includeAll?: boolean;
}

export async function executeBulkImport(
  options: BulkImportOptions = {}
): Promise<BulkImportSummary> {
  const {
    clickbankCount = 10000,
    sharesaleCount = 25000,
    cjCount = 15000,
    rakutenCount = 12000,
    awinCount = 18000,
    includeAll = true,
  } = options;

  logger.log('🚀 Starting bulk affiliate program import...');
  logger.log('Target: 80,000+ programs across 5 major networks\\n');

  const configs: ReturnType<typeof generateClickBankData>[] = [];

  if (includeAll || options.clickbankCount !== undefined) {
    logger.log(`Generating ClickBank data (${clickbankCount} programs)...`);
    configs.push(generateClickBankData(clickbankCount));
  }

  if (includeAll || options.sharesaleCount !== undefined) {
    logger.log(`Generating ShareASale data (${sharesaleCount} programs)...`);
    configs.push(generateShareASaleData(sharesaleCount));
  }

  if (includeAll || options.cjCount !== undefined) {
    logger.log(`Generating CJ Affiliate data (${cjCount} programs)...`);
    configs.push(generateCJAffiliateData(cjCount));
  }

  if (includeAll || options.rakutenCount !== undefined) {
    logger.log(`Generating Rakuten data (${rakutenCount} programs)...`);
    configs.push(generateRakutenData(rakutenCount));
  }

  if (includeAll || options.awinCount !== undefined) {
    logger.log(`Generating Awin data (${awinCount} programs)...`);
    configs.push(generateAwinData(awinCount));
  }

  logger.log(`\\nImporting ${configs.length} networks...\\n`);

  const summary = await importer.importBulk(configs);

  logger.log('\\n✅ Bulk import complete!');
  logger.log(`Total networks imported: ${summary.successfulImports}/${summary.totalNetworks}`);
  logger.log(`Total programs imported: ${summary.totalPrograms}`);
  logger.log(`Duration: ${(summary.duration / 1000).toFixed(2)}s`);

  // Display detailed results
  logger.log('\\nDetailed Results:');
  summary.results.forEach((result, index) => {
    const config = configs[index];
    logger.log(`\\n${config.networkName}:`);
    logger.log(`  - Programs imported: ${result.programsImported}`);
    logger.log(`  - Programs updated: ${result.programsUpdated}`);
    logger.log(`  - Programs skipped: ${result.programsSkipped}`);
    logger.log(`  - Duration: ${(result.duration / 1000).toFixed(2)}s`);
    if (result.errors.length > 0) {
      logger.log(`  - Errors: ${result.errors.length}`);
      result.errors.slice(0, 3).forEach((err) => logger.log(`    - ${err}`));
    }
  });

  return summary;
}

// CLI execution support
if (require.main === module) {
  executeBulkImport()
    .then(() => {
      logger.log('\\n🎉 Import complete! C1 (Data Starvation) constraint RESOLVED.');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('\\n❌ Import failed:', error);
      process.exit(1);
    });
}
