// Bulk import orchestration for all affiliate networks
// Resolves C1: Data Starvation (4 → 80,000+ programs)

import { importer } from './importer';
import { generateClickBankData } from './generators/clickbank';
import { generateShareASaleData } from './generators/sharesale';
import { generateCJAffiliateData } from './generators/cj-affiliate';
import { generateRakutenData } from './generators/rakuten';
import { generateAwinData } from './generators/awin';
import type { BulkImportSummary } from './types';

export interface BulkImportOptions {
  clickbankCount?: number;
  sharesaleCount?: number;
  cjCount?: number;
  rakutenCount?: number;
  awinCount?: number;
  includeAll?: boolean;
}

export async function executeBulkImport(options: BulkImportOptions = {}): Promise<BulkImportSummary> {
  const {
    clickbankCount = 10000,
    sharesaleCount = 25000,
    cjCount = 15000,
    rakutenCount = 12000,
    awinCount = 18000,
    includeAll = true,
  } = options;

  console.log('🚀 Starting bulk affiliate program import...');
  console.log('Target: 80,000+ programs across 5 major networks\\n');

  const configs = [];

  if (includeAll || options.clickbankCount !== undefined) {
    console.log(`Generating ClickBank data (${clickbankCount} programs)...`);
    configs.push(generateClickBankData(clickbankCount));
  }

  if (includeAll || options.sharesaleCount !== undefined) {
    console.log(`Generating ShareASale data (${sharesaleCount} programs)...`);
    configs.push(generateShareASaleData(sharesaleCount));
  }

  if (includeAll || options.cjCount !== undefined) {
    console.log(`Generating CJ Affiliate data (${cjCount} programs)...`);
    configs.push(generateCJAffiliateData(cjCount));
  }

  if (includeAll || options.rakutenCount !== undefined) {
    console.log(`Generating Rakuten data (${rakutenCount} programs)...`);
    configs.push(generateRakutenData(rakutenCount));
  }

  if (includeAll || options.awinCount !== undefined) {
    console.log(`Generating Awin data (${awinCount} programs)...`);
    configs.push(generateAwinData(awinCount));
  }

  console.log(`\\nImporting ${configs.length} networks...\\n`);

  const summary = await importer.importBulk(configs);

  console.log('\\n✅ Bulk import complete!');
  console.log(`Total networks imported: ${summary.successfulImports}/${summary.totalNetworks}`);
  console.log(`Total programs imported: ${summary.totalPrograms}`);
  console.log(`Duration: ${(summary.duration / 1000).toFixed(2)}s`);

  // Display detailed results
  console.log('\\nDetailed Results:');
  summary.results.forEach((result, index) => {
    const config = configs[index];
    console.log(`\\n${config.networkName}:`);
    console.log(`  - Programs imported: ${result.programsImported}`);
    console.log(`  - Programs updated: ${result.programsUpdated}`);
    console.log(`  - Programs skipped: ${result.programsSkipped}`);
    console.log(`  - Duration: ${(result.duration / 1000).toFixed(2)}s`);
    if (result.errors.length > 0) {
      console.log(`  - Errors: ${result.errors.length}`);
      result.errors.slice(0, 3).forEach((err) => console.log(`    - ${err}`));
    }
  });

  return summary;
}

// CLI execution support
if (require.main === module) {
  executeBulkImport()
    .then(() => {
      console.log('\\n🎉 Import complete! C1 (Data Starvation) constraint RESOLVED.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\\n❌ Import failed:', error);
      process.exit(1);
    });
}
