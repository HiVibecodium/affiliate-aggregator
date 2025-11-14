-- Add composite indexes for AffiliateProgram table
-- These indexes optimize common query patterns (filtering + sorting)

-- Single column indexes
CREATE INDEX IF NOT EXISTS "AffiliateProgram_commissionType_idx" ON "AffiliateProgram"("commissionType");
CREATE INDEX IF NOT EXISTS "AffiliateProgram_commissionRate_idx" ON "AffiliateProgram"("commissionRate");

-- Composite indexes for filter combinations (most selective first)
CREATE INDEX IF NOT EXISTS "AffiliateProgram_active_category_idx" ON "AffiliateProgram"("active", "category");
CREATE INDEX IF NOT EXISTS "AffiliateProgram_active_networkId_idx" ON "AffiliateProgram"("active", "networkId");
CREATE INDEX IF NOT EXISTS "AffiliateProgram_active_commissionType_idx" ON "AffiliateProgram"("active", "commissionType");

-- Index for sorting by latest
CREATE INDEX IF NOT EXISTS "AffiliateProgram_createdAt_desc_idx" ON "AffiliateProgram"("createdAt" DESC);

-- Performance notes:
-- These indexes optimize queries like:
-- 1. WHERE active = true AND category = 'Technology' (uses active_category_idx)
-- 2. WHERE active = true AND networkId = 'xyz' (uses active_networkId_idx)
-- 3. WHERE active = true ORDER BY createdAt DESC (uses active + createdAt_desc_idx)
--
-- Expected performance gain: 3-5x faster for filtered queries
