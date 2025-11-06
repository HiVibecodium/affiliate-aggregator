// Add enhanced fields to AffiliateProgram table
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

const migrations = [
  // URL fields
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "programUrl" TEXT',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "merchantUrl" TEXT',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "affiliateUrl" TEXT',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT',

  // Metadata fields
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "minPayout" DOUBLE PRECISION',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "averageEarnings" DOUBLE PRECISION',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "epc" DOUBLE PRECISION',

  // Array fields
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "geoTargeting" TEXT[] DEFAULT \'{}\'',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "language" TEXT[] DEFAULT \'{}\'',

  // Quality indicators
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN DEFAULT false',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "popularity" INTEGER DEFAULT 0',

  // Data source tracking
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "dataSource" TEXT',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "externalId" TEXT',
  'ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP',

  // Indexes
  'CREATE INDEX IF NOT EXISTS "AffiliateProgram_featured_idx" ON "AffiliateProgram"("featured")',
  'CREATE INDEX IF NOT EXISTS "AffiliateProgram_popularity_idx" ON "AffiliateProgram"("popularity")',
  'CREATE INDEX IF NOT EXISTS "AffiliateProgram_externalId_idx" ON "AffiliateProgram"("externalId")',

  // Unique constraint
  'CREATE UNIQUE INDEX IF NOT EXISTS "AffiliateProgram_networkId_externalId_key" ON "AffiliateProgram"("networkId", "externalId")',
];

console.log('Adding enhanced fields to AffiliateProgram table...');

try {
  for (const sql of migrations) {
    console.log(`Executing: ${sql.substring(0, 60)}...`);
    await prisma.$executeRawUnsafe(sql);
  }

  console.log('\\n✅ Enhanced fields added successfully!');
  await prisma.$disconnect();
} catch (error) {
  console.error('\\n❌ Migration failed:', error.message);
  await prisma.$disconnect();
  process.exit(1);
}
