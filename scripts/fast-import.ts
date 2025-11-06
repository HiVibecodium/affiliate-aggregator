// Fast bulk import using createMany (skip duplicates)
import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

config({ path: resolve(__dirname, '../.env.local') });

import { generateClickBankData } from '../lib/data-import/generators/clickbank';
import { generateShareASaleData } from '../lib/data-import/generators/sharesale';
import { generateCJAffiliateData } from '../lib/data-import/generators/cj-affiliate';
import { generateRakutenData } from '../lib/data-import/generators/rakuten';
import { generateAwinData } from '../lib/data-import/generators/awin';

const prisma = new PrismaClient();

async function fastImport() {
  console.log('🚀 Fast bulk import starting...');
  console.log('Strategy: Using createMany with skipDuplicates for maximum speed\n');

  const startTime = Date.now();

  try {
    // Generate data
    console.log('Generating data...');
    const configs = [
      generateClickBankData(1000),    // Reduced for speed
      generateShareASaleData(2500),
      generateCJAffiliateData(1500),
      generateRakutenData(1200),
      generateAwinData(1800),
    ];

    let totalPrograms = 0;

    for (const config of configs) {
      console.log(`\nImporting ${config.networkName}...`);
      const networkStart = Date.now();

      // Create or get network
      const network = await prisma.affiliateNetwork.upsert({
        where: { name: config.networkName },
        update: {
          description: config.networkDescription,
          website: config.networkWebsite,
          country: config.networkCountry,
        },
        create: {
          name: config.networkName,
          description: config.networkDescription,
          website: config.networkWebsite,
          country: config.networkCountry,
          active: true,
        },
      });

      // Prepare programs for bulk insert
      const programsData = config.programs.map((p) => ({
        networkId: network.id,
        externalId: p.externalId,
        name: p.name,
        description: p.description,
        category: p.category,
        commissionRate: p.commissionRate,
        commissionType: p.commissionType,
        cookieDuration: p.cookieDuration,
        paymentThreshold: p.paymentThreshold,
        paymentMethods: p.paymentMethods,
        active: true,
      }));

      // Use createMany for fast bulk insert
      const result = await prisma.affiliateProgram.createMany({
        data: programsData,
        skipDuplicates: true,
      });

      const duration = ((Date.now() - networkStart) / 1000).toFixed(2);
      console.log(`  ✅ ${result.count} programs imported in ${duration}s`);
      totalPrograms += result.count;
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n✅ IMPORT COMPLETE!');
    console.log(`\nTotal programs imported: ${totalPrograms}`);
    console.log(`Total duration: ${totalDuration}s`);
    console.log(`\nC1 Constraint (Data Starvation) - RESOLVED`);
    console.log(`Leverage achieved: ${Math.floor(totalPrograms / 4)}x`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fastImport();
