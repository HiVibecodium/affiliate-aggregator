-- Billing System Migration
-- Created: 2025-11-15
-- Description: Add complete billing and subscription system with Stripe integration

-- ==============================================================================
-- SUBSCRIPTION MANAGEMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT,

    -- Stripe identifiers
    "stripeCustomerId" TEXT NOT NULL UNIQUE,
    "stripeSubscriptionId" TEXT UNIQUE,
    "stripePriceId" TEXT,
    "stripeProductId" TEXT,

    -- Subscription details
    "tier" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',

    -- Billing period
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),

    -- Trial
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),

    -- Metadata
    "metadata" JSONB,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL
);

CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_organizationId_idx" ON "Subscription"("organizationId");
CREATE INDEX "Subscription_stripeCustomerId_idx" ON "Subscription"("stripeCustomerId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX "Subscription_tier_idx" ON "Subscription"("tier");
CREATE INDEX "Subscription_currentPeriodEnd_idx" ON "Subscription"("currentPeriodEnd");

-- ==============================================================================
-- PAYMENT METHODS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "PaymentMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,

    -- Stripe identifier
    "stripePaymentMethodId" TEXT NOT NULL UNIQUE,

    -- Payment method details
    "type" TEXT NOT NULL,
    "last4" TEXT NOT NULL,

    -- Card-specific fields
    "brand" TEXT,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "country" TEXT,

    -- Bank account-specific
    "bankName" TEXT,
    "accountType" TEXT,
    "routingLast4" TEXT,

    -- Status
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "PaymentMethod_userId_idx" ON "PaymentMethod"("userId");
CREATE INDEX "PaymentMethod_isDefault_idx" ON "PaymentMethod"("isDefault");

-- ==============================================================================
-- INVOICES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,

    -- Stripe identifier
    "stripeInvoiceId" TEXT NOT NULL UNIQUE,

    -- Invoice details
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL,
    "description" TEXT,

    -- Invoice URLs
    "hostedInvoiceUrl" TEXT,
    "invoicePdf" TEXT,

    -- Dates
    "paidAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),

    -- Period
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),

    -- Metadata
    "metadata" JSONB,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL
);

CREATE INDEX "Invoice_userId_idx" ON "Invoice"("userId");
CREATE INDEX "Invoice_subscriptionId_idx" ON "Invoice"("subscriptionId");
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt" DESC);
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- ==============================================================================
-- USAGE METRICS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "UsageMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,

    -- Metric details
    "metric" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    -- Period tracking
    "period" TEXT NOT NULL DEFAULT 'daily',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Reset information
    "resetAt" TIMESTAMP(3),
    "lastReset" TIMESTAMP(3),
    "resetCount" INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageMetric_userId_metric_period_date_key" UNIQUE ("userId", "metric", "period", "date")
);

CREATE INDEX "UsageMetric_userId_idx" ON "UsageMetric"("userId");
CREATE INDEX "UsageMetric_userId_metric_idx" ON "UsageMetric"("userId", "metric");
CREATE INDEX "UsageMetric_date_idx" ON "UsageMetric"("date");
CREATE INDEX "UsageMetric_resetAt_idx" ON "UsageMetric"("resetAt");

-- ==============================================================================
-- COUPONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" TEXT NOT NULL PRIMARY KEY,

    -- Stripe identifier
    "stripeCouponId" TEXT UNIQUE,

    -- Coupon details
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "description" TEXT,

    -- Discount
    "percentOff" INTEGER,
    "amountOff" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'usd',

    -- Restrictions
    "maxRedemptions" INTEGER,
    "timesRedeemed" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "firstTimeOnly" BOOLEAN NOT NULL DEFAULT false,
    "minimumAmount" DOUBLE PRECISION,
    "applicableTiers" TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Status
    "active" BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");
CREATE INDEX "Coupon_active_idx" ON "Coupon"("active");
CREATE INDEX "Coupon_validUntil_idx" ON "Coupon"("validUntil");

-- ==============================================================================
-- COUPON REDEMPTIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "CouponRedemption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    -- Redemption details
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "appliedTo" TEXT,

    -- Stripe reference
    "stripePromotionCodeId" TEXT,

    -- Timestamps
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponRedemption_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE CASCADE
);

CREATE INDEX "CouponRedemption_couponId_idx" ON "CouponRedemption"("couponId");
CREATE INDEX "CouponRedemption_userId_idx" ON "CouponRedemption"("userId");
CREATE INDEX "CouponRedemption_redeemedAt_idx" ON "CouponRedemption"("redeemedAt");

-- ==============================================================================
-- BILLING EVENTS (Audit Trail)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "BillingEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,

    -- Event details
    "type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,

    -- Associated resources
    "subscriptionId" TEXT,
    "invoiceId" TEXT,
    "paymentMethodId" TEXT,

    -- Stripe event
    "stripeEventId" TEXT UNIQUE,

    -- Event data
    "eventData" JSONB,

    -- Error tracking
    "errorMessage" TEXT,
    "errorCode" TEXT,

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "BillingEvent_userId_idx" ON "BillingEvent"("userId");
CREATE INDEX "BillingEvent_type_idx" ON "BillingEvent"("type");
CREATE INDEX "BillingEvent_status_idx" ON "BillingEvent"("status");
CREATE INDEX "BillingEvent_createdAt_idx" ON "BillingEvent"("createdAt" DESC);
CREATE INDEX "BillingEvent_subscriptionId_idx" ON "BillingEvent"("subscriptionId");

-- ==============================================================================
-- REFERRALS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT,

    -- Referral details
    "referralCode" TEXT NOT NULL UNIQUE,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',

    -- Rewards
    "referrerReward" TEXT,
    "referredReward" TEXT,
    "rewardApplied" BOOLEAN NOT NULL DEFAULT false,

    -- Conversion tracking
    "signedUpAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");
CREATE INDEX "Referral_referredId_idx" ON "Referral"("referredId");
CREATE INDEX "Referral_referralCode_idx" ON "Referral"("referralCode");
CREATE INDEX "Referral_status_idx" ON "Referral"("status");
CREATE INDEX "Referral_createdAt_idx" ON "Referral"("createdAt" DESC);

-- ==============================================================================
-- CREDITS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS "Credit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,

    -- Credit details
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "description" TEXT,
    "source" TEXT,

    -- Usage
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "appliedTo" TEXT,
    "appliedAt" TIMESTAMP(3),

    -- Expiration
    "expiresAt" TIMESTAMP(3),

    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Credit_userId_idx" ON "Credit"("userId");
CREATE INDEX "Credit_applied_idx" ON "Credit"("applied");
CREATE INDEX "Credit_expiresAt_idx" ON "Credit"("expiresAt");
CREATE INDEX "Credit_createdAt_idx" ON "Credit"("createdAt" DESC);

-- ==============================================================================
-- COMMENTS
-- ==============================================================================

COMMENT ON TABLE "Subscription" IS 'User subscriptions with Stripe integration';
COMMENT ON TABLE "PaymentMethod" IS 'User payment methods (cards, bank accounts)';
COMMENT ON TABLE "Invoice" IS 'Billing invoices from Stripe';
COMMENT ON TABLE "UsageMetric" IS 'Track feature usage for tier limits';
COMMENT ON TABLE "Coupon" IS 'Discount codes and promotions';
COMMENT ON TABLE "CouponRedemption" IS 'Track coupon usage';
COMMENT ON TABLE "BillingEvent" IS 'Audit trail for all billing actions';
COMMENT ON TABLE "Referral" IS 'Referral program tracking';
COMMENT ON TABLE "Credit" IS 'Account credits and balance';
