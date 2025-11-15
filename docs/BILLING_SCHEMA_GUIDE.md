# Billing Schema Documentation

**Created:** 2025-11-15
**Purpose:** Complete billing and subscription system for Stripe integration

---

## Overview

The billing system consists of 9 main models that work together to provide:

- Subscription management (Free, Pro, Business, Enterprise tiers)
- Payment method storage
- Invoice tracking
- Usage-based limits
- Promotional codes
- Referral program
- Account credits
- Complete audit trail

---

## Core Models

### 1. Subscription

Tracks user subscriptions with Stripe.

**Key Fields:**
- `stripeCustomerId` - Unique Stripe customer ID
- `stripeSubscriptionId` - Active subscription ID
- `tier` - free, pro, business, enterprise
- `status` - active, canceled, past_due, trialing, etc.
- `currentPeriodStart/End` - Billing cycle dates
- `cancelAtPeriodEnd` - If true, cancels at period end
- `trialStart/End` - Trial period dates

**Usage:**
```typescript
// Get user's active subscription
const subscription = await prisma.subscription.findFirst({
  where: {
    userId: userId,
    status: 'active'
  }
})

// Check user's tier
const tier = subscription?.tier || 'free'
```

**Relations:**
- belongs to `User`
- belongs to `Organization` (optional)
- has many `Invoice`

---

### 2. PaymentMethod

Stores user's payment methods from Stripe.

**Key Fields:**
- `stripePaymentMethodId` - Stripe payment method ID
- `type` - card, bank_account
- `last4` - Last 4 digits
- `brand` - visa, mastercard, etc. (for cards)
- `expiryMonth/Year` - Card expiration
- `isDefault` - Default payment method

**Usage:**
```typescript
// Get user's default payment method
const defaultPM = await prisma.paymentMethod.findFirst({
  where: {
    userId: userId,
    isDefault: true
  }
})
```

**Relations:**
- belongs to `User`

---

### 3. Invoice

Tracks billing invoices from Stripe.

**Key Fields:**
- `stripeInvoiceId` - Stripe invoice ID
- `amount` - Total amount
- `currency` - usd, eur, etc.
- `status` - draft, open, paid, void, uncollectible
- `hostedInvoiceUrl` - Stripe hosted page
- `invoicePdf` - PDF download URL
- `paidAt` - Payment date
- `periodStart/End` - Billing period

**Usage:**
```typescript
// Get user's paid invoices
const invoices = await prisma.invoice.findMany({
  where: {
    userId: userId,
    status: 'paid'
  },
  orderBy: { createdAt: 'desc' }
})
```

**Relations:**
- belongs to `User`
- belongs to `Subscription` (optional)

---

### 4. UsageMetric

Tracks feature usage for enforcing tier limits.

**Key Fields:**
- `userId` - User ID
- `metric` - Name of metric (e.g., 'favorites_count', 'comparisons_daily')
- `value` - Current count
- `period` - daily, weekly, monthly, lifetime
- `date` - Date for this period
- `resetAt` - When to reset this metric

**Usage:**
```typescript
// Get today's comparison count
const today = new Date().toISOString().split('T')[0]
const metric = await prisma.usageMetric.findUnique({
  where: {
    userId_metric_period_date: {
      userId: userId,
      metric: 'comparisons_daily',
      period: 'daily',
      date: new Date(today)
    }
  }
})

const count = metric?.value || 0
```

**Common Metrics:**
- `favorites_count` (lifetime) - Total favorites
- `comparisons_daily` (daily) - Comparisons made today
- `saved_searches` (lifetime) - Number of saved searches
- `api_calls_monthly` (monthly) - API calls this month
- `reviews_monthly` (monthly) - Reviews written this month

**Relations:**
- Composite unique key: `[userId, metric, period, date]`

---

### 5. Coupon

Discount codes and promotions.

**Key Fields:**
- `code` - Unique coupon code
- `percentOff` - Percentage discount (10 = 10%)
- `amountOff` - Fixed amount discount
- `maxRedemptions` - Max uses
- `timesRedeemed` - Current redemption count
- `validFrom/Until` - Valid date range
- `firstTimeOnly` - Only for new users
- `applicableTiers` - Which tiers can use

**Usage:**
```typescript
// Validate coupon
const coupon = await prisma.coupon.findUnique({
  where: { code: 'LAUNCH50' }
})

if (coupon?.active &&
    new Date() >= coupon.validFrom &&
    (!coupon.validUntil || new Date() <= coupon.validUntil) &&
    (!coupon.maxRedemptions || coupon.timesRedeemed < coupon.maxRedemptions)) {
  // Coupon is valid
}
```

**Relations:**
- has many `CouponRedemption`

---

### 6. CouponRedemption

Tracks who used which coupons.

**Key Fields:**
- `couponId` - Which coupon
- `userId` - Who redeemed
- `discountAmount` - Amount saved
- `appliedTo` - subscription or invoice ID
- `redeemedAt` - When redeemed

**Usage:**
```typescript
// Record coupon usage
await prisma.couponRedemption.create({
  data: {
    couponId: coupon.id,
    userId: userId,
    discountAmount: discount,
    appliedTo: subscription.id
  }
})

// Update coupon redemption count
await prisma.coupon.update({
  where: { id: coupon.id },
  data: { timesRedeemed: { increment: 1 } }
})
```

**Relations:**
- belongs to `Coupon`

---

### 7. BillingEvent

Audit trail for all billing actions.

**Key Fields:**
- `type` - Event type (subscription_created, payment_succeeded, etc.)
- `status` - success, failed, pending
- `subscriptionId/invoiceId` - Related resources
- `stripeEventId` - Stripe webhook event ID
- `eventData` - Full event payload (JSON)
- `errorMessage/errorCode` - If failed

**Usage:**
```typescript
// Log billing event
await prisma.billingEvent.create({
  data: {
    userId: userId,
    type: 'payment_succeeded',
    status: 'success',
    invoiceId: invoice.id,
    stripeEventId: event.id,
    eventData: event.data
  }
})

// Get user's billing history
const events = await prisma.billingEvent.findMany({
  where: { userId: userId },
  orderBy: { createdAt: 'desc' },
  take: 50
})
```

**Common Event Types:**
- `subscription_created`
- `subscription_updated`
- `subscription_canceled`
- `payment_succeeded`
- `payment_failed`
- `invoice_paid`
- `invoice_payment_failed`
- `customer_created`

**Relations:**
- No direct relations (uses IDs for reference)

---

### 8. Referral

Tracks referral program.

**Key Fields:**
- `referrerId` - User who referred
- `referredId` - User who was referred (null until signup)
- `referralCode` - Unique referral code
- `email` - Invited email
- `status` - pending, completed, rewarded
- `referrerReward/referredReward` - Reward types
- `signedUpAt/convertedAt` - Conversion dates

**Usage:**
```typescript
// Generate referral code for user
const code = generateUniqueCode() // e.g., 'REF-ABC123'
await prisma.referral.create({
  data: {
    referrerId: userId,
    referralCode: code,
    email: inviteeEmail,
    status: 'pending',
    referrerReward: '1_month_free',
    referredReward: '50_percent_off'
  }
})

// Process referral signup
const referral = await prisma.referral.findUnique({
  where: { referralCode: code }
})

await prisma.referral.update({
  where: { id: referral.id },
  data: {
    referredId: newUser.id,
    signedUpAt: new Date(),
    status: 'completed'
  }
})
```

**Relations:**
- No direct relations (references users by ID)

---

### 9. Credit

Account credits/balance system.

**Key Fields:**
- `amount` - Credit amount
- `currency` - usd, etc.
- `description` - What credit is for
- `source` - referral, promotion, refund
- `applied` - Has credit been used
- `appliedTo` - invoice/subscription ID
- `expiresAt` - Expiration date

**Usage:**
```typescript
// Give user credit
await prisma.credit.create({
  data: {
    userId: userId,
    amount: 10.00,
    currency: 'usd',
    description: 'Referral bonus',
    source: 'referral',
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  }
})

// Get available credits
const credits = await prisma.credit.findMany({
  where: {
    userId: userId,
    applied: false,
    OR: [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } }
    ]
  }
})

const totalCredits = credits.reduce((sum, c) => sum + c.amount, 0)
```

**Relations:**
- No direct relations

---

## Tier System

### Feature Limits by Tier

```typescript
export const TIER_LIMITS = {
  free: {
    favorites: 5,
    comparisons: 3, // per day
    savedSearches: 0,
    applications: 0,
    apiCalls: 0,
    teamMembers: 1,
    canWriteReviews: false,
    canExport: false,
  },
  pro: {
    favorites: Infinity,
    comparisons: Infinity,
    savedSearches: 10,
    applications: Infinity,
    apiCalls: 0,
    teamMembers: 1,
    canWriteReviews: true,
    canExport: true,
  },
  business: {
    favorites: Infinity,
    comparisons: Infinity,
    savedSearches: Infinity,
    applications: Infinity,
    apiCalls: 10000,
    teamMembers: 5,
    canWriteReviews: true,
    canExport: true,
  },
  enterprise: {
    favorites: Infinity,
    comparisons: Infinity,
    savedSearches: Infinity,
    applications: Infinity,
    apiCalls: Infinity,
    teamMembers: Infinity,
    canWriteReviews: true,
    canExport: true,
  },
}
```

### Checking Access

```typescript
async function checkFeatureAccess(userId: string, feature: string) {
  // Get subscription
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'active' }
  })

  const tier = subscription?.tier || 'free'
  const limit = TIER_LIMITS[tier][feature]

  // If unlimited
  if (limit === Infinity || typeof limit !== 'number') {
    return { allowed: true }
  }

  // Check usage
  const usage = await getCurrentUsage(userId, feature)

  return {
    allowed: usage < limit,
    limit,
    current: usage,
    remaining: limit - usage
  }
}
```

---

## Common Queries

### Get User's Current Plan

```typescript
async function getUserPlan(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: 'active'
    },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  return {
    tier: subscription?.tier || 'free',
    status: subscription?.status || 'active',
    periodEnd: subscription?.currentPeriodEnd,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd,
    recentInvoices: subscription?.invoices
  }
}
```

### Check if User Can Perform Action

```typescript
async function canPerformAction(userId: string, action: string) {
  const access = await checkFeatureAccess(userId, action)

  if (!access.allowed) {
    return {
      allowed: false,
      reason: `You've reached your ${action} limit (${access.limit}). Upgrade to Pro for unlimited access.`,
      upgradeUrl: '/billing/upgrade'
    }
  }

  return { allowed: true }
}
```

### Record Usage

```typescript
async function recordUsage(userId: string, metric: string, period: 'daily' | 'monthly' | 'lifetime') {
  const date = new Date()
  const dateKey = period === 'daily'
    ? date.toISOString().split('T')[0]
    : period === 'monthly'
    ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    : 'all-time'

  await prisma.usageMetric.upsert({
    where: {
      userId_metric_period_date: {
        userId,
        metric,
        period,
        date: new Date(dateKey)
      }
    },
    update: {
      value: { increment: 1 }
    },
    create: {
      userId,
      metric,
      period,
      date: new Date(dateKey),
      value: 1
    }
  })
}
```

---

## Migration Instructions

### Option 1: Using Prisma Migrate (Development)

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_billing_system

# Apply migration
npx prisma migrate deploy
```

### Option 2: Manual SQL (Production)

```bash
# Connect to your database
psql $DATABASE_URL

# Run the migration SQL
\i docs/BILLING_MIGRATION.sql

# Verify tables created
\dt

# Generate Prisma client
npx prisma generate
```

### Post-Migration Steps

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Verify schema:**
   ```bash
   npx prisma db pull
   npx prisma validate
   ```

3. **Seed initial data (optional):**
   ```typescript
   // Create some default coupons
   await prisma.coupon.createMany({
     data: [
       {
         code: 'LAUNCH50',
         percentOff: 50,
         maxRedemptions: 100,
         validUntil: new Date('2025-12-31'),
         applicableTiers: ['pro', 'business']
       }
     ]
   })
   ```

---

## Testing the Schema

```typescript
// Test script: test-billing-schema.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testBillingSchema() {
  // 1. Create subscription
  const sub = await prisma.subscription.create({
    data: {
      userId: 'test-user-id',
      stripeCustomerId: 'cus_test123',
      tier: 'pro',
      status: 'active'
    }
  })

  console.log('✅ Subscription created:', sub.id)

  // 2. Add payment method
  const pm = await prisma.paymentMethod.create({
    data: {
      userId: 'test-user-id',
      stripePaymentMethodId: 'pm_test123',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      isDefault: true
    }
  })

  console.log('✅ Payment method added:', pm.id)

  // 3. Create invoice
  const invoice = await prisma.invoice.create({
    data: {
      userId: 'test-user-id',
      subscriptionId: sub.id,
      stripeInvoiceId: 'in_test123',
      amount: 12.00,
      status: 'paid',
      paidAt: new Date()
    }
  })

  console.log('✅ Invoice created:', invoice.id)

  // 4. Track usage
  await prisma.usageMetric.create({
    data: {
      userId: 'test-user-id',
      metric: 'favorites_count',
      value: 3,
      period: 'lifetime',
      date: new Date()
    }
  })

  console.log('✅ Usage tracked')

  // 5. Clean up
  await prisma.usageMetric.deleteMany({ where: { userId: 'test-user-id' } })
  await prisma.invoice.deleteMany({ where: { userId: 'test-user-id' } })
  await prisma.paymentMethod.deleteMany({ where: { userId: 'test-user-id' } })
  await prisma.subscription.deleteMany({ where: { userId: 'test-user-id' } })

  console.log('✅ Cleanup complete')
}

testBillingSchema().catch(console.error).finally(() => prisma.$disconnect())
```

---

## Next Steps

After applying this migration:

1. **Install Stripe SDK:**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Create Stripe utility functions** (see `lib/billing/stripe.ts`)

3. **Create API routes** for billing:
   - `/api/billing/checkout` - Create checkout session
   - `/api/billing/portal` - Customer portal
   - `/api/billing/subscription` - Get/update subscription
   - `/api/billing/webhooks` - Stripe webhooks

4. **Create UI components:**
   - Pricing table
   - Billing dashboard
   - Upgrade prompts
   - Usage stats

5. **Implement feature gates** in your app

---

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [SaaS Pricing Strategies](https://www.priceintelligently.com/blog/saas-pricing-strategy)

---

**Questions or Issues?**

See main billing implementation plan in `/docs/BILLING_IMPLEMENTATION.md`
