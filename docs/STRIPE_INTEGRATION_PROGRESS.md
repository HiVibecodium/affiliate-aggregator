# Stripe Integration Progress

**Date:** 2025-11-15
**Status:** Phase 2 - In Progress (80% Complete)

---

## ✅ Completed

### 1. Dependencies Installed
```bash
✅ stripe@latest
✅ @stripe/stripe-js@latest
```

### 2. Core Utilities Created

**`lib/billing/stripe.ts`** ✅
- Stripe client configuration
- Price ID mapping
- Error handling
- Amount formatting

**`lib/billing/subscription.ts`** ✅
- getOrCreateCustomer()
- createCheckoutSession()
- createSubscription()
- updateSubscription()
- getActiveSubscription()
- getUserTier()
- cancelSubscription()
- reactivateSubscription()
- createPortalSession()
- changeSubscriptionPlan()

**`lib/billing/feature-gates.ts`** ✅
- TIER_LIMITS configuration
- checkFeatureAccess()
- checkAndRecordUsage()
- recordUsage()
- decrementUsage()
- getUsageSummary()

**`lib/billing/webhooks.ts`** ✅
- handleCheckoutCompleted()
- handleSubscriptionCreated()
- handleSubscriptionUpdated()
- handleSubscriptionDeleted()
- handleInvoicePaid()
- handleInvoicePaymentFailed()
- handlePaymentMethodAttached()
- handleWebhookEvent() (main router)

### 3. API Routes Created

**`app/api/billing/checkout/route.ts`** ✅
- POST endpoint for creating checkout sessions

---

## 🔄 Remaining Tasks

### API Routes (Need to Create)

**`app/api/billing/portal/route.ts`** ⏳
```typescript
// Create customer portal session
export async function POST(request: Request) {
  const { customerId } = await request.json()
  const session = await createPortalSession(customerId, returnUrl)
  return NextResponse.json({ url: session.url })
}
```

**`app/api/billing/subscription/route.ts`** ⏳
```typescript
// GET - Get user's subscription
// PUT - Update subscription (upgrade/downgrade)
// DELETE - Cancel subscription
```

**`app/api/billing/webhooks/route.ts`** ⏳
```typescript
import { stripe, webhookSecret } from '@/lib/billing/stripe'
import { handleWebhookEvent } from '@/lib/billing/webhooks'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  await handleWebhookEvent(event)

  return NextResponse.json({ received: true })
}
```

**`app/api/billing/plans/route.ts`** ⏳
```typescript
// GET - List available plans with pricing
```

---

## 🔧 Environment Variables Required

Add to `.env.local`:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_YEARLY_PRICE_ID=price_...
STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_...
STRIPE_BUSINESS_YEARLY_PRICE_ID=price_...
```

---

## 📋 Stripe Dashboard Setup

### Step 1: Create Products

1. Go to Stripe Dashboard → Products
2. Create 2 products:
   - **Pro Plan**
   - **Business Plan**

### Step 2: Create Prices

For each product, create 2 prices:
- **Monthly** (recurring)
- **Yearly** (recurring, 30-32% discount)

**Pro Plan:**
- Pro Monthly: $12/month
- Pro Yearly: $99/year ($8.25/mo)

**Business Plan:**
- Business Monthly: $49/month
- Business Yearly: $399/year ($33.25/mo)

### Step 3: Configure Webhooks

1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/billing/webhooks`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_method.attached`
4. Copy webhook secret to `.env.local`

---

## 🎨 UI Components (Next Phase)

### Pages to Create

**`app/billing/page.tsx`** - Billing Dashboard
```typescript
- Current plan
- Usage statistics
- Payment method
- Invoice history
- Upgrade/downgrade buttons
```

**`app/billing/upgrade/page.tsx`** - Pricing Page
```typescript
- Pricing table
- Feature comparison
- Checkout flow
```

**`app/billing/success/page.tsx`** - Post-Checkout
```typescript
- Thank you message
- Next steps
- Access to Pro features
```

### Components to Create

**`components/billing/PricingTable.tsx`**
```typescript
- Display all tiers
- Feature comparison
- CTA buttons
```

**`components/billing/UpgradePrompt.tsx`**
```typescript
- Modal when hitting limits
- Show current usage
- Upgrade call-to-action
```

**`components/billing/UsageStats.tsx`**
```typescript
- Progress bars for each limit
- Current/limit display
- Visual indicators
```

**`components/billing/BillingHistory.tsx`**
```typescript
- List of invoices
- Download PDF
- Payment status
```

---

## 🔒 Feature Gating Integration

### Example: Protecting Features

**In favorites route:**
```typescript
import { checkAndRecordUsage } from '@/lib/billing/feature-gates'

export async function POST(request: Request) {
  const { userId, programId } = await request.json()

  // Check if user can add favorite
  const access = await checkAndRecordUsage(userId, 'favorites')

  if (!access.allowed) {
    return NextResponse.json(
      { error: access.message, upgradeUrl: access.upgradeUrl },
      { status: 403 }
    )
  }

  // Add favorite...
}
```

**In comparisons:**
```typescript
const access = await checkAndRecordUsage(userId, 'comparisons_daily')
```

**In reviews:**
```typescript
const access = await checkFeatureAccess(userId, 'can_write_reviews')
if (!access.allowed) {
  // Show upgrade prompt
}
```

---

## 🧪 Testing

### Test Checkout Flow

```bash
# 1. Start dev server
npm run dev

# 2. Create test checkout
curl -X POST http://localhost:3000/api/billing/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "email": "test@example.com",
    "tier": "pro",
    "interval": "month"
  }'

# 3. Use test card in checkout
# Card: 4242 4242 4242 4242
# Expiry: Any future date
# CVC: Any 3 digits
```

### Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-brew/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/billing/webhooks

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

---

## 📊 Monitoring & Analytics

### Metrics to Track

**Subscription Metrics:**
- Active subscriptions by tier
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Churn rate
- Upgrade/downgrade rate

**Usage Metrics:**
- Feature usage by tier
- Limit hit frequency
- Conversion from free to paid

**Financial Metrics:**
- Total revenue
- Failed payments
- Refunds
- Coupon usage

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Create production Stripe products/prices
- [ ] Update environment variables with production keys
- [ ] Configure production webhook endpoint
- [ ] Test full checkout flow in production
- [ ] Set up Stripe email receipts
- [ ] Configure Stripe customer portal
- [ ] Set up billing alerts
- [ ] Test subscription cancellation
- [ ] Test failed payment flow
- [ ] Verify webhook signatures
- [ ] Add error monitoring (Sentry)
- [ ] Test with real cards (small amounts)
- [ ] Create refund policy
- [ ] Update terms of service
- [ ] Add GDPR data deletion

---

## 📚 Documentation Links

- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

---

## 🎯 Next Immediate Steps

1. **Create remaining API routes** (30 min)
   - portal/route.ts
   - subscription/route.ts
   - webhooks/route.ts
   - plans/route.ts

2. **Setup Stripe Dashboard** (20 min)
   - Create products
   - Create prices
   - Configure webhook

3. **Test integration** (30 min)
   - Test checkout
   - Test webhooks
   - Verify database records

4. **Create UI components** (2-3 hours)
   - Pricing table
   - Billing dashboard
   - Upgrade prompts

**Total estimated time to complete: 4-5 hours**

---

**Current Progress: 80%** 🎯

**Next Session:** Complete API routes and test full flow
