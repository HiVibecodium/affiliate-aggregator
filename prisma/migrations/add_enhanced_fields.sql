-- Migration: Add enhanced fields to AffiliateProgram
-- Resolves C1 (Data Starvation) - enables comprehensive program data

-- Add URL fields
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "programUrl" TEXT;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "merchantUrl" TEXT;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "affiliateUrl" TEXT;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;

-- Add metadata fields
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "minPayout" DOUBLE PRECISION;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "averageEarnings" DOUBLE PRECISION;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "epc" DOUBLE PRECISION;

-- Add geographic and language support
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "geoTargeting" TEXT[] DEFAULT '{}';
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "language" TEXT[] DEFAULT '{}';

-- Add quality indicators
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN DEFAULT false;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "popularity" INTEGER DEFAULT 0;

-- Add data source tracking
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "dataSource" TEXT;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "externalId" TEXT;
ALTER TABLE "AffiliateProgram" ADD COLUMN IF NOT EXISTS "lastSyncedAt" TIMESTAMP;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "AffiliateProgram_featured_idx" ON "AffiliateProgram"("featured");
CREATE INDEX IF NOT EXISTS "AffiliateProgram_popularity_idx" ON "AffiliateProgram"("popularity");
CREATE INDEX IF NOT EXISTS "AffiliateProgram_externalId_idx" ON "AffiliateProgram"("externalId");

-- Create unique constraint for network + externalId
CREATE UNIQUE INDEX IF NOT EXISTS "AffiliateProgram_networkId_externalId_key" ON "AffiliateProgram"("networkId", "externalId");
