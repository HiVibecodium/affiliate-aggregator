# Billing API Usage Guide

**Created:** 2025-11-15
**Status:** Complete - Ready to Use

---

## API Endpoints

### 1. Create Checkout Session

**Endpoint:** `POST /api/billing/checkout`

**Description:** Create a Stripe checkout session for subscription purchase

**Request Body:**
```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "tier": "pro",           // "pro" or "business"
  "interval": "month",     // "month" or "year"
  "trialDays": 14,        // Optional: trial period
  "couponCode": "LAUNCH50" // Optional: discount code
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**Example Usage:**
```typescript
// Client-side
const response = await fetch('/api/billing/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    email: currentUser.email,
    tier: 'pro',
    interval: 'month',
  }),
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe checkout
```

---

### 2. Customer Portal

**Endpoint:** `POST /api/billing/portal`

**Description:** Create a Stripe customer portal session for managing subscription

**Request Body:**
```json
{
  "userId": "user_123"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/p/session/..."
}
```

**Example Usage:**
```typescript
const response = await fetch('/api/billing/portal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: currentUser.id }),
})

const { url } = await response.json()
window.location.href = url // Redirect to portal
```

---

### 3. Get Subscription

**Endpoint:** `GET /api/billing/subscription?userId={userId}`

**Description:** Get user's current subscription details

**Response:**
```json
{
  "tier": "pro",
  "status": "active",
  "subscription": {
    "id": "sub_123",
    "currentPeriodEnd": "2025-12-15T00:00:00.000Z",
    "cancelAtPeriodEnd": false,
    "trialEnd": null
  },
  "invoices": [
    {
      "id": "inv_123",
      "amount": 12.00,
      "status": "paid",
      "paidAt": "2025-11-15T00:00:00.000Z",
      "hostedInvoiceUrl": "https://...",
      "invoicePdf": "https://..."
    }
  ]
}
```

**Example Usage:**
```typescript
const response = await fetch(`/api/billing/subscription?userId=${userId}`)
const data = await response.json()

console.log(`Current tier: ${data.tier}`)
console.log(`Status: ${data.status}`)
```

---

### 4. Update Subscription

**Endpoint:** `PUT /api/billing/subscription`

**Description:** Upgrade or downgrade subscription

**Request Body:**
```json
{
  "userId": "user_123",
  "newTier": "business",   // New tier
  "newInterval": "year"    // New interval
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "tier": "business",
    "status": "active"
  }
}
```

**Example Usage:**
```typescript
const response = await fetch('/api/billing/subscription', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    newTier: 'business',
    newInterval: 'year',
  }),
})

const data = await response.json()
console.log('Upgraded to:', data.subscription.tier)
```

---

### 5. Cancel Subscription

**Endpoint:** `DELETE /api/billing/subscription?userId={userId}&immediately={true|false}`

**Description:** Cancel subscription (at period end or immediately)

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "status": "active",
    "cancelAtPeriodEnd": true,
    "canceledAt": null
  }
}
```

**Example Usage:**
```typescript
// Cancel at period end
const response = await fetch(
  `/api/billing/subscription?userId=${userId}&immediately=false`,
  { method: 'DELETE' }
)

// Cancel immediately
const response = await fetch(
  `/api/billing/subscription?userId=${userId}&immediately=true`,
  { method: 'DELETE' }
)
```

---

### 6. Reactivate Subscription

**Endpoint:** `PATCH /api/billing/subscription`

**Description:** Reactivate a canceled subscription

**Request Body:**
```json
{
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "status": "active",
    "cancelAtPeriodEnd": false
  }
}
```

**Example Usage:**
```typescript
const response = await fetch('/api/billing/subscription', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: currentUser.id }),
})
```

---

### 7. Get Plans

**Endpoint:** `GET /api/billing/plans`

**Description:** Get all available subscription plans with pricing

**Response:**
```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "description": "Perfect for getting started",
      "price": {
        "monthly": 0,
        "yearly": 0
      },
      "limits": [
        "5 favorites",
        "3 comparisons per day",
        "..."
      ],
      "cta": "Get Started",
      "popular": false
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": {
        "monthly": 1200,
        "yearly": 9900,
        "monthlyFormatted": "$12.00",
        "yearlyFormatted": "$99.00",
        "yearlyMonthly": "$8.25"
      },
      "priceIds": {
        "monthly": "price_...",
        "yearly": "price_..."
      },
      "limits": [
        "Unlimited favorites",
        "..."
      ],
      "popular": true,
      "savings": "30% off yearly"
    }
  ]
}
```

**Example Usage:**
```typescript
const response = await fetch('/api/billing/plans')
const { plans } = await response.json()

// Display pricing table
plans.forEach(plan => {
  console.log(`${plan.name}: ${plan.price.monthlyFormatted}/mo`)
})
```

---

### 8. Webhooks

**Endpoint:** `POST /api/billing/webhooks`

**Description:** Stripe webhook endpoint (Stripe calls this, not you)

**Important:** This endpoint is called by Stripe, not by your frontend

**Setup in Stripe Dashboard:**
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

**Webhook signature verification:** Automatically handled by the endpoint

---

## Feature Gating Examples

### Check if User Can Access Feature

```typescript
import { checkFeatureAccess } from '@/lib/billing/feature-gates'

// In your API route or server component
const access = await checkFeatureAccess(userId, 'can_write_reviews')

if (!access.allowed) {
  return { error: 'Writing reviews requires a Pro subscription' }
}

// User can access feature
```

### Check and Record Usage

```typescript
import { checkAndRecordUsage } from '@/lib/billing/feature-gates'

// When user adds a favorite
const result = await checkAndRecordUsage(userId, 'favorites')

if (!result.allowed) {
  return NextResponse.json({
    error: result.message,
    upgradeUrl: result.upgradeUrl
  }, { status: 403 })
}

// Add favorite...
```

### Decrement Usage (Undo)

```typescript
import { decrementUsage } from '@/lib/billing/feature-gates'

// When user removes a favorite
await decrementUsage(userId, 'favorites', 1)
```

### Get Usage Summary

```typescript
import { getUsageSummary } from '@/lib/billing/feature-gates'

const summary = await getUsageSummary(userId)

// Returns:
// {
//   tier: 'pro',
//   usage: {
//     favorites: { current: 12, limit: Infinity },
//     comparisons_daily: { current: 5, limit: Infinity },
//     saved_searches: { current: 3, limit: 10, percentage: 30 }
//   }
// }
```

---

## Complete Integration Example

### React Component: Upgrade Button

```typescript
'use client'

import { useState } from 'react'

export function UpgradeButton({ userId, email }: { userId: string; email: string }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          tier: 'pro',
          interval: 'month',
        }),
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Upgrade failed:', error)
      setLoading(false)
    }
  }

  return (
    <button onClick={handleUpgrade} disabled={loading}>
      {loading ? 'Loading...' : 'Upgrade to Pro'}
    </button>
  )
}
```

### Server Component: Display Subscription

```typescript
import { getActiveSubscription } from '@/lib/billing/subscription'

export async function SubscriptionCard({ userId }: { userId: string }) {
  const subscription = await getActiveSubscription(userId)

  if (!subscription) {
    return <div>Free Plan</div>
  }

  return (
    <div>
      <h3>{subscription.tier} Plan</h3>
      <p>Status: {subscription.status}</p>
      <p>Renews: {subscription.currentPeriodEnd.toLocaleDateString()}</p>
    </div>
  )
}
```

### API Route: Protected Feature

```typescript
import { checkAndRecordUsage } from '@/lib/billing/feature-gates'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { userId, programId } = await request.json()

  // Check if user can add favorite
  const access = await checkAndRecordUsage(userId, 'favorites')

  if (!access.allowed) {
    return NextResponse.json({
      error: access.message,
      upgrade: {
        url: access.upgradeUrl,
        tier: 'pro'
      }
    }, { status: 403 })
  }

  // Add favorite to database
  await prisma.favorite.create({
    data: { userId, programId }
  })

  return NextResponse.json({ success: true })
}
```

---

## Testing

### Test Checkout (Development)

```bash
curl -X POST http://localhost:3000/api/billing/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "email": "test@example.com",
    "tier": "pro",
    "interval": "month"
  }'
```

### Test Cards (Stripe Test Mode)

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

**Decline:**
- Card: `4000 0000 0000 0002`

**Requires Authentication:**
- Card: `4000 0025 0000 3155`

### Test Webhooks Locally

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/billing/webhooks

# Trigger events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
stripe trigger invoice.paid
```

---

## Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Error message",
  "code": "error_code" // Optional
}
```

**Common Error Codes:**
- `400` - Bad Request (missing/invalid parameters)
- `403` - Forbidden (feature requires upgrade)
- `404` - Not Found (subscription not found)
- `500` - Internal Server Error

**Example:**
```typescript
const response = await fetch('/api/billing/checkout', { ... })

if (!response.ok) {
  const error = await response.json()
  console.error('Checkout failed:', error.error)
  return
}

const data = await response.json()
// Success
```

---

## Next Steps

1. **Setup Stripe Dashboard** - Create products and prices
2. **Add Environment Variables** - Configure Stripe keys
3. **Test Integration** - Use test cards to verify flow
4. **Build UI Components** - Pricing table, billing dashboard
5. **Deploy** - Configure production webhook

---

**All API routes are ready to use!** ✅
