-- Migration: Add invite token to OrganizationMember
-- Created: 2025-01-16
-- Purpose: Secure token-based team invitations

-- Add inviteToken column
ALTER TABLE "OrganizationMember"
ADD COLUMN "inviteToken" TEXT;

-- Add index for token lookup
CREATE INDEX "OrganizationMember_inviteToken_idx"
ON "OrganizationMember"("inviteToken");

-- Add unique constraint (each token should be unique)
ALTER TABLE "OrganizationMember"
ADD CONSTRAINT "OrganizationMember_inviteToken_key" UNIQUE ("inviteToken");

-- Comment
COMMENT ON COLUMN "OrganizationMember"."inviteToken"
IS 'Secure token for invite acceptance, expires after 7 days';

-- Migration complete
-- Next: npx prisma db pull && npx prisma generate
