// Import 6 new affiliate networks
// Impact, FlexOffers, Pepperjam, Admitad, TradeDoubler, PartnerStack

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

import { importer } from '../lib/data-import/importer';
import { generateImpactData } from '../lib/data-import/generators/impact';
import { generateFlexOffersData } from '../lib/data-import/generators/flexoffers';
import { generatePepperjamData } from '../lib/data-import/generators/pepperjam';
import { generateAdmitadData } from '../lib/data-import/generators/admitad';
import { generateTradeDoublerData } from '../lib/data-import/generators/tradedoubler';
import { generatePartnerStackData } from '../lib/data-import/generators/partnerstack';

async function importNewNetworks() {
  console.log('🚀 Importing 6 new affiliate networks...\n');

  const networks = [
    { name: 'Impact', generator: generateImpactData, count: 500 },
    { name: 'FlexOffers', generator: generateFlexOffersData, count: 1000 },
    { name: 'Pepperjam', generator: generatePepperjamData, count: 300 },
    { name: 'Admitad', generator: generateAdmitadData, count: 2000 },
    { name: 'TradeDoubler', generator: generateTradeDoublerData, count: 200 },
    { name: 'PartnerStack', generator: generatePartnerStackData, count: 100 },
  ];

  const totalPrograms = networks.reduce((sum, n) => sum + n.count, 0);
  console.log(`Target: ${totalPrograms} programs across ${networks.length} networks\n`);

  let imported = 0;
  let errors = 0;

  for (const network of networks) {
    console.log(`\n📦 Importing ${network.name} (${network.count} programs)...`);

    try {
      const config = network.generator(network.count);
      const result = await importer.importNetwork(config);

      console.log(
        `   ✅ ${network.name}: ${result.programsImported} imported, ${result.programsUpdated} updated`
      );
      imported += result.programsImported + result.programsUpdated;

      if (result.errors.length > 0) {
        console.log(`   ⚠️  ${result.errors.length} errors`);
        errors += result.errors.length;
      }
    } catch (error) {
      console.error(`   ❌ ${network.name} failed:`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(50));
  console.log(`Networks: ${networks.length}`);
  console.log(`Programs imported: ${imported}`);
  console.log(`Errors: ${errors}`);
  console.log('='.repeat(50));

  return { imported, errors };
}

// Run
importNewNetworks()
  .then((result) => {
    console.log('\n✅ Import complete!');
    process.exit(result.errors > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });
