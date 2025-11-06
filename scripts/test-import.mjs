// Test import with small sample
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

console.log('🧪 Testing import system with 100 programs...');

try {
  // Create/update ClickBank network
  const network = await prisma.affiliateNetwork.upsert({
    where: { name: 'ClickBank' },
    update: {
      description: 'Digital marketplace with 10,000+ products',
      website: 'https://clickbank.com',
      country: 'US',
    },
    create: {
      name: 'ClickBank',
      description: 'Digital marketplace with 10,000+ products',
      website: 'https://clickbank.com',
      country: 'US',
      active: true,
    },
  });

  console.log(`✅ Network created: ${network.name} (${network.id})`);

  // Create sample programs
  const programs = [];
  for (let i = 1; i <= 100; i++) {
    programs.push({
      networkId: network.id,
      externalId: `CB${String(i).padStart(6, '0')}`,
      name: `Test Program ${i}`,
      description: `Sample program for testing`,
      category: 'Health & Fitness',
      commissionRate: 50 + (i % 26),
      commissionType: 'CPS',
      cookieDuration: 60,
      paymentThreshold: 10,
      paymentMethods: ['PayPal', 'Direct Deposit'],
      programUrl: `https://clickbank.com/program/${i}`,
      merchantUrl: `https://example.com/program-${i}`,
      affiliateUrl: `https://clickbank.com/affiliate/${i}`,
      minPayout: 10,
      averageEarnings: 100 + (i * 10),
      epc: 1.5 + (i * 0.01),
      geoTargeting: ['US', 'CA', 'GB'],
      language: ['en'],
      verified: true,
      featured: i <= 10,
      popularity: 1000 - i,
      dataSource: 'test',
      lastSyncedAt: new Date(),
      active: true,
    });
  }

  const result = await prisma.affiliateProgram.createMany({
    data: programs,
    skipDuplicates: true,
  });

  console.log(`✅ Imported ${result.count} programs`);

  // Verify count
  const count = await prisma.affiliateProgram.count({
    where: { networkId: network.id },
  });

  console.log(`✅ Total programs in database: ${count}`);
  console.log('\\n🎉 Test import successful!');

  await prisma.$disconnect();
} catch (error) {
  console.error('❌ Test failed:', error.message);
  await prisma.$disconnect();
  process.exit(1);
}
