-- Reviews & Ratings System Migration
-- Created: 2025-11-15
-- Purpose: Add community review and rating functionality

-- Drop existing tables if any (clean slate)
DROP TABLE IF EXISTS "ReviewReport" CASCADE;
DROP TABLE IF EXISTS "ReviewHelpful" CASCADE;
DROP TABLE IF EXISTS "ProgramReview" CASCADE;

-- Create ProgramReview table
CREATE TABLE "ProgramReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    -- Review content
    "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Verification
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "experience" TEXT,

    -- Metrics
    "monthsUsed" INTEGER,
    "earningsRange" TEXT,
    "trafficSource" TEXT,

    -- Moderation
    "status" TEXT NOT NULL DEFAULT 'pending',
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "reportCount" INTEGER NOT NULL DEFAULT 0,

    -- Engagement
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "notHelpfulCount" INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    -- Foreign keys
    CONSTRAINT "ProgramReview_programId_fkey" FOREIGN KEY ("programId")
        REFERENCES "AffiliateProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgramReview_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,

    -- Constraints
    CONSTRAINT "ProgramReview_userId_programId_key" UNIQUE ("userId", "programId")
);

-- Create ReviewHelpful table (upvote/downvote)
CREATE TABLE "ReviewHelpful" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT "ReviewHelpful_reviewId_fkey" FOREIGN KEY ("reviewId")
        REFERENCES "ProgramReview"("id") ON DELETE CASCADE ON UPDATE CASCADE,

    -- Constraints
    CONSTRAINT "ReviewHelpful_reviewId_userId_key" UNIQUE ("reviewId", "userId")
);

-- Create ReviewReport table (moderation)
CREATE TABLE "ReviewReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId")
        REFERENCES "ProgramReview"("id") ON DELETE CASCADE ON UPDATE CASCADE,

    -- Constraints
    CONSTRAINT "ReviewReport_reviewId_userId_key" UNIQUE ("reviewId", "userId")
);

-- Create indexes for ProgramReview
CREATE INDEX IF NOT EXISTS "ProgramReview_programId_idx" ON "ProgramReview"("programId");
CREATE INDEX IF NOT EXISTS "ProgramReview_userId_idx" ON "ProgramReview"("userId");
CREATE INDEX IF NOT EXISTS "ProgramReview_rating_idx" ON "ProgramReview"("rating");
CREATE INDEX IF NOT EXISTS "ProgramReview_status_idx" ON "ProgramReview"("status");
CREATE INDEX IF NOT EXISTS "ProgramReview_createdAt_idx" ON "ProgramReview"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "ProgramReview_helpfulCount_idx" ON "ProgramReview"("helpfulCount" DESC);

-- Create indexes for ReviewHelpful
CREATE INDEX IF NOT EXISTS "ReviewHelpful_reviewId_idx" ON "ReviewHelpful"("reviewId");
CREATE INDEX IF NOT EXISTS "ReviewHelpful_userId_idx" ON "ReviewHelpful"("userId");

-- Create indexes for ReviewReport
CREATE INDEX IF NOT EXISTS "ReviewReport_reviewId_idx" ON "ReviewReport"("reviewId");
CREATE INDEX IF NOT EXISTS "ReviewReport_userId_idx" ON "ReviewReport"("userId");
CREATE INDEX IF NOT EXISTS "ReviewReport_status_idx" ON "ReviewReport"("status");

-- Performance notes:
-- These indexes optimize:
-- 1. Finding all reviews for a program (programId index)
-- 2. Finding user's reviews (userId index)
-- 3. Filtering by rating (for "4+ stars only" filter)
-- 4. Showing recent reviews (createdAt DESC)
-- 5. "Most helpful" sorting (helpfulCount DESC)
-- 6. Moderation queue (status = 'pending')
