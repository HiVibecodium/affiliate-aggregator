-- Migration: Add payment frequency to AffiliateProgram
-- Created: 2025-01-16
-- Purpose: Allow filtering programs by payment frequency (daily, weekly, monthly, etc.)

-- Add paymentFrequency column
ALTER TABLE "AffiliateProgram"
ADD COLUMN "paymentFrequency" TEXT;

-- Add index for filtering performance
CREATE INDEX "AffiliateProgram_paymentFrequency_idx"
ON "AffiliateProgram"("paymentFrequency");

-- Add comment
COMMENT ON COLUMN "AffiliateProgram"."paymentFrequency"
IS 'Payment frequency: daily, weekly, net-15, net-30, monthly, net-60, quarterly, annual';

-- Optionally set default values for existing programs (can be NULL for now)
-- UPDATE "AffiliateProgram" SET "paymentFrequency" = 'monthly' WHERE "paymentFrequency" IS NULL;

-- Migration complete
-- Next steps:
-- 1. Execute this in Supabase SQL Editor
-- 2. Run: npx prisma db pull
-- 3. Run: npx prisma generate
