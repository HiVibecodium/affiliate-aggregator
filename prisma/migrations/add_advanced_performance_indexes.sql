-- Advanced performance indexes for AffiliateProgram table
-- Created: 2025-11-15
-- Purpose: Optimize complex filters and text search queries

-- Text search optimization (case-insensitive ILIKE queries)
CREATE INDEX IF NOT EXISTS "AffiliateProgram_name_idx" ON "AffiliateProgram"("name");
CREATE INDEX IF NOT EXISTS "AffiliateProgram_active_name_idx" ON "AffiliateProgram"("active", "name");

-- For PostgreSQL text search, create trgm index for LIKE/ILIKE queries
-- This requires pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS "AffiliateProgram_name_trgm_idx"
  ON "AffiliateProgram" USING gin (name gin_trgm_ops);

-- Three-column composite indexes for complex filter scenarios
CREATE INDEX IF NOT EXISTS "AffiliateProgram_active_category_commission_idx"
  ON "AffiliateProgram"("active", "category", "commissionRate");

CREATE INDEX IF NOT EXISTS "AffiliateProgram_active_network_category_idx"
  ON "AffiliateProgram"("active", "networkId", "category");

CREATE INDEX IF NOT EXISTS "AffiliateProgram_network_category_commission_idx"
  ON "AffiliateProgram"("networkId", "category", "commissionRate");

-- Covering index for common SELECT queries (includes frequently accessed columns)
CREATE INDEX IF NOT EXISTS "AffiliateProgram_active_category_commission_covering_idx"
  ON "AffiliateProgram"("active", "category")
  INCLUDE ("name", "commissionRate", "commissionType");

-- Performance notes:
-- These indexes optimize queries like:
-- 1. WHERE active = true AND name ILIKE '%search%' (uses name_trgm_idx)
-- 2. WHERE active = true AND category = 'Tech' AND commissionRate > 10 (uses active_category_commission_idx)
-- 3. WHERE active = true AND networkId = 'xyz' AND category = 'Tech' (uses active_network_category_idx)
-- 4. Complex filter combinations with sorting
--
-- Expected performance gain:
-- - Text search: 5-10x faster
-- - Complex filters: 2-3x faster
-- - Overall query time: <300ms (from current 558ms via cache)
