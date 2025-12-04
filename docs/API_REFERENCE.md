# API Reference

Complete API documentation for the Affiliate Aggregator platform.

**Base URL (Production):** `https://affiliate-aggregator-five.vercel.app/api`
**Base URL (Development):** `http://localhost:3000/api`

## Table of Contents

- [Authentication](#authentication)
- [Programs](#programs)
- [Analytics](#analytics)
- [Favorites](#favorites)
- [Saved Searches](#saved-searches)
- [Comparisons](#comparisons)
- [Reviews](#reviews)
- [Organizations](#organizations)
- [Billing](#billing)
- [Applications](#applications)
- [Referrals](#referrals)
- [Admin](#admin)
- [Health & Monitoring](#health--monitoring)

---

## Authentication

All authenticated endpoints require a valid Supabase session cookie. Authentication is handled automatically by the Supabase client.

### Session Management

**Headers Required:**

```
Cookie: sb-<project-id>-auth-token=<jwt-token>
```

---

## Programs

### GET /api/programs

Retrieve paginated list of affiliate programs with filtering.

**Query Parameters:**

| Parameter        | Type   | Default | Description                          |
| ---------------- | ------ | ------- | ------------------------------------ |
| `page`           | number | 1       | Page number                          |
| `limit`          | number | 20      | Items per page (max: 100)            |
| `search`         | string | -       | Search in name/description           |
| `network`        | string | -       | Filter by network                    |
| `category`       | string | -       | Filter by category                   |
| `commissionType` | string | -       | CPA, CPS, CPL, CPC, Hybrid           |
| `minCommission`  | number | -       | Minimum commission rate              |
| `maxCommission`  | number | -       | Maximum commission rate              |
| `minCookie`      | number | -       | Minimum cookie duration (days)       |
| `sort`           | string | name    | Sort field: name, commission, cookie |
| `order`          | string | asc     | Sort order: asc, desc                |

**Response:**

```json
{
  "programs": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "network": {
        "id": "string",
        "name": "string"
      },
      "category": "string",
      "commissionRate": 15.5,
      "commissionType": "CPS",
      "cookieDuration": 30,
      "paymentThreshold": 50,
      "paymentMethods": ["PayPal", "Wire Transfer"],
      "url": "string",
      "active": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 80010,
    "page": 1,
    "limit": 20,
    "totalPages": 4001
  }
}
```

**Rate Limit:** 100 requests/minute per IP

---

### GET /api/programs/:id

Get detailed information about a specific program.

**Response:**

```json
{
  "program": {
    "id": "string",
    "name": "string",
    "description": "string",
    "network": { "id": "string", "name": "string" },
    "category": "string",
    "commissionRate": 15.5,
    "commissionType": "CPS",
    "cookieDuration": 30,
    "paymentThreshold": 50,
    "paymentMethods": ["PayPal"],
    "url": "string",
    "active": true,
    "stats": {
      "views": 1234,
      "clicks": 567,
      "favorites": 89
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### GET /api/programs/stats

Get aggregate statistics for all programs.

**Response:**

```json
{
  "totalPrograms": 80010,
  "activePrograms": 75000,
  "totalNetworks": 6,
  "categories": 45,
  "avgCommissionRate": 12.5,
  "avgCookieDuration": 45
}
```

**Cache:** 5 minutes

---

### GET /api/programs/filters

Get available filter options (networks, categories, commission types).

**Response:**

```json
{
  "networks": [{ "id": "string", "name": "string", "count": 15000 }],
  "categories": ["Technology", "Finance", "E-commerce"],
  "commissionTypes": ["CPA", "CPS", "CPL", "CPC", "Hybrid"]
}
```

**Cache:** 1 hour

---

### GET /api/programs/suggestions

Get program suggestions based on user's favorites and history.

**Auth:** Required

**Response:**

```json
{
  "suggestions": [
    {
      "id": "string",
      "name": "string",
      "commissionRate": 15.5,
      "reason": "Similar to your favorites"
    }
  ]
}
```

---

## Analytics

### GET /api/analytics/popular

Get most popular programs by views/clicks.

**Query Parameters:**

- `period`: today, week, month (default: week)
- `limit`: number (default: 10, max: 50)

**Response:**

```json
{
  "programs": [
    {
      "id": "string",
      "name": "string",
      "views": 5000,
      "clicks": 1200,
      "conversionRate": 8.5
    }
  ],
  "period": "week"
}
```

**Cache:** 10 minutes

---

### GET /api/analytics/realtime

Get real-time platform metrics.

**Auth:** Required (Admin only)

**Response:**

```json
{
  "activeUsers": 150,
  "clicksToday": 450,
  "conversionsToday": 35,
  "revenueToday": 875,
  "topPrograms": [
    {
      "id": "string",
      "name": "string",
      "clicks": 120,
      "conversions": 8
    }
  ]
}
```

**Revalidate:** Never cached (force-dynamic)

---

### GET /api/analytics/advanced

Get advanced analytics with custom date ranges.

**Auth:** Required

**Query Parameters:**

- `startDate`: ISO date string
- `endDate`: ISO date string
- `groupBy`: day, week, month

**Response:**

```json
{
  "data": [
    {
      "date": "2024-01-01",
      "clicks": 450,
      "conversions": 35,
      "revenue": 875
    }
  ],
  "summary": {
    "totalClicks": 4500,
    "totalConversions": 350,
    "totalRevenue": 8750,
    "avgConversionRate": 7.8
  }
}
```

---

### POST /api/analytics/web-vitals

Track Core Web Vitals metrics.

**Body:**

```json
{
  "name": "CLS|FID|LCP|FCP|TTFB",
  "value": 123,
  "id": "unique-metric-id",
  "rating": "good|needs-improvement|poor"
}
```

**Response:** `{ "success": true }`

---

## Favorites

### GET /api/favorites

Get user's favorite programs.

**Auth:** Required

**Response:**

```json
{
  "favorites": [
    {
      "id": "string",
      "program": {
        "id": "string",
        "name": "string",
        "commissionRate": 15.5
      },
      "addedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 15
}
```

---

### POST /api/favorites

Add program to favorites.

**Auth:** Required

**Body:**

```json
{
  "programId": "string"
}
```

**Response:** `{ "success": true, "favorite": {...} }`

**Rate Limit:** 60 requests/minute per user

---

### DELETE /api/favorites/:id

Remove program from favorites.

**Auth:** Required

**Response:** `{ "success": true }`

---

## Saved Searches

### GET /api/saved-searches

Get user's saved searches.

**Auth:** Required

**Response:**

```json
{
  "searches": [
    {
      "id": "string",
      "name": "High Commission Tech Programs",
      "filters": {
        "category": "Technology",
        "minCommission": 15
      },
      "emailAlerts": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /api/saved-searches

Create a new saved search.

**Auth:** Required

**Body:**

```json
{
  "name": "string",
  "filters": {
    "category": "string",
    "network": "string",
    "minCommission": 10
  },
  "emailAlerts": true
}
```

**Response:** `{ "success": true, "search": {...} }`

---

### DELETE /api/saved-searches/:id

Delete a saved search.

**Auth:** Required

**Response:** `{ "success": true }`

---

### GET /api/saved-searches/unsubscribe

Unsubscribe from saved search email alerts.

**Query Parameters:**

- `token`: string (email unsubscribe token)

**Response:** HTML page confirming unsubscribe

---

## Comparisons

### GET /api/comparisons/check

Check if programs are already in comparison list.

**Query Parameters:**

- `ids`: comma-separated program IDs

**Response:**

```json
{
  "inComparison": ["id1", "id2"],
  "notInComparison": ["id3"]
}
```

---

## Reviews

### GET /api/reviews/:programId

Get reviews for a specific program.

**Query Parameters:**

- `page`: number (default: 1)
- `limit`: number (default: 10)
- `sort`: rating, helpful, recent (default: recent)

**Response:**

```json
{
  "reviews": [
    {
      "id": "string",
      "user": {
        "name": "string",
        "avatar": "string"
      },
      "rating": 4,
      "comment": "string",
      "pros": ["string"],
      "cons": ["string"],
      "helpfulCount": 15,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "average": 4.2,
    "total": 45,
    "distribution": {
      "5": 20,
      "4": 15,
      "3": 5,
      "2": 3,
      "1": 2
    }
  }
}
```

---

### POST /api/reviews/:programId

Submit a review for a program.

**Auth:** Required

**Body:**

```json
{
  "rating": 4,
  "comment": "string",
  "pros": ["High commission", "Good support"],
  "cons": ["High threshold"]
}
```

**Response:** `{ "success": true, "review": {...} }`

**Rate Limit:** 10 reviews/hour per user

---

### POST /api/reviews/:programId/:reviewId/helpful

Mark a review as helpful.

**Auth:** Required

**Response:** `{ "success": true, "helpfulCount": 16 }`

---

## Organizations

### GET /api/organizations

List user's organizations.

**Auth:** Required

**Response:**

```json
{
  "organizations": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "logo": "string",
      "tier": "free|pro|business|enterprise",
      "role": "viewer|member|manager|admin|owner",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /api/organizations

Create a new organization.

**Auth:** Required

**Body:**

```json
{
  "name": "string",
  "slug": "string",
  "description": "string"
}
```

**Response:** `{ "success": true, "organization": {...} }`

---

### GET /api/organizations/:orgId

Get organization details.

**Auth:** Required (member)

**Response:**

```json
{
  "organization": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "tier": "pro",
    "subscriptionStatus": "active",
    "memberCount": 5,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### PATCH /api/organizations/:orgId

Update organization details.

**Auth:** Required (admin/owner)

**Body:**

```json
{
  "name": "string",
  "description": "string",
  "settings": {}
}
```

**Response:** `{ "success": true, "organization": {...} }`

---

### DELETE /api/organizations/:orgId

Delete an organization.

**Auth:** Required (owner only)

**Response:** `{ "success": true }`

---

### GET /api/organizations/:orgId/members

List organization members.

**Auth:** Required (member)

**Response:**

```json
{
  "members": [
    {
      "id": "string",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      },
      "role": "admin",
      "status": "active",
      "joinedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /api/organizations/:orgId/members

Invite a member to organization.

**Auth:** Required (admin/owner)

**Body:**

```json
{
  "email": "user@example.com",
  "role": "member|manager|admin"
}
```

**Response:** `{ "success": true, "invitation": {...} }`

---

### PATCH /api/organizations/:orgId/members/:memberId

Update member role.

**Auth:** Required (admin/owner)

**Body:**

```json
{
  "role": "admin"
}
```

**Response:** `{ "success": true, "member": {...} }`

---

### DELETE /api/organizations/:orgId/members/:memberId

Remove member from organization.

**Auth:** Required (admin/owner)

**Response:** `{ "success": true }`

---

## Billing

### GET /api/billing/plans

Get available subscription plans.

**Response:**

```json
{
  "plans": [
    {
      "id": "pro",
      "name": "Pro",
      "price": {
        "monthly": 29,
        "yearly": 290
      },
      "features": ["Unlimited programs", "Advanced analytics", "Priority support"]
    }
  ]
}
```

---

### POST /api/billing/checkout

Create Stripe checkout session.

**Auth:** Required

**Body:**

```json
{
  "userId": "string",
  "email": "string",
  "tier": "pro|business",
  "interval": "month|year",
  "trialDays": 14,
  "couponCode": "PROMO2024"
}
```

**Response:**

```json
{
  "sessionId": "string",
  "url": "https://checkout.stripe.com/..."
}
```

---

### POST /api/billing/portal

Create Stripe customer portal session.

**Auth:** Required

**Response:**

```json
{
  "url": "https://billing.stripe.com/..."
}
```

---

### GET /api/billing/subscription

Get current subscription details.

**Auth:** Required

**Response:**

```json
{
  "subscription": {
    "id": "string",
    "tier": "pro",
    "status": "active|past_due|canceled",
    "currentPeriodEnd": "2024-12-31T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

---

### POST /api/billing/webhooks

Stripe webhook endpoint (internal use only).

**Headers Required:**

```
Stripe-Signature: <webhook-signature>
```

**Events Handled:**

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

---

## Applications

### GET /api/applications

List user's program applications.

**Auth:** Required

**Response:**

```json
{
  "applications": [
    {
      "id": "string",
      "program": {
        "id": "string",
        "name": "string"
      },
      "status": "pending|approved|rejected",
      "appliedAt": "2024-01-01T00:00:00Z",
      "notes": "string"
    }
  ]
}
```

---

### POST /api/applications

Submit application to join a program.

**Auth:** Required

**Body:**

```json
{
  "programId": "string",
  "website": "https://example.com",
  "description": "string",
  "monthlyTraffic": 10000
}
```

**Response:** `{ "success": true, "application": {...} }`

---

### GET /api/applications/:id

Get application details.

**Auth:** Required

**Response:**

```json
{
  "application": {
    "id": "string",
    "program": {...},
    "status": "pending",
    "website": "string",
    "description": "string",
    "appliedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Referrals

### GET /api/referrals

Get user's referral statistics.

**Auth:** Required

**Response:**

```json
{
  "code": "USER123",
  "stats": {
    "totalReferrals": 15,
    "activeReferrals": 10,
    "earnings": 150
  },
  "referrals": [
    {
      "id": "string",
      "name": "string",
      "status": "active",
      "signupDate": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /api/referrals

Send referral invitation.

**Auth:** Required

**Body:**

```json
{
  "email": "friend@example.com"
}
```

**Response:** `{ "success": true, "invitation": {...} }`

---

## Admin

### GET /api/admin/stats

Get admin dashboard statistics.

**Auth:** Required (Admin only)

**Response:**

```json
{
  "users": {
    "total": 1000,
    "new30Days": 150,
    "growth": "15%"
  },
  "subscriptions": {
    "active": 250,
    "byTier": {
      "free": 750,
      "pro": 200,
      "business": 50
    }
  },
  "revenue": {
    "total": 50000,
    "last30Days": 7500,
    "mrr": 7250,
    "arr": 87000
  }
}
```

---

### POST /api/admin/add-amazon-programs

Add Amazon affiliate programs to database.

**Auth:** Required (Admin only)

**Body:**

```json
{
  "programs": [...]
}
```

**Response:** `{ "success": true, "added": 100 }`

---

## Health & Monitoring

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "uptime": 123456,
  "checks": {
    "database": "healthy",
    "cache": "healthy"
  }
}
```

**Cache:** Never cached (revalidate: 0)

---

### GET /api/version

Get application version information.

**Response:**

```json
{
  "version": "1.0.0",
  "commit": "abc123",
  "buildDate": "2024-01-01T00:00:00Z",
  "environment": "production"
}
```

---

## Rate Limiting

Most endpoints are rate-limited to prevent abuse:

| Endpoint Category                  | Limit      |
| ---------------------------------- | ---------- |
| Public reads (programs, analytics) | 100/minute |
| User actions (favorites, reviews)  | 60/minute  |
| Write operations (create, update)  | 30/minute  |
| Admin endpoints                    | No limit   |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

**Exceeded Response:**

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Status Codes:**

| Code | Description                             |
| ---- | --------------------------------------- |
| 400  | Bad Request - Invalid parameters        |
| 401  | Unauthorized - Authentication required  |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource doesn't exist      |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error                   |
| 503  | Service Unavailable - Maintenance mode  |

---

## Webhooks

The platform supports webhooks for external integrations:

### Stripe Webhooks

**Endpoint:** `/api/billing/webhooks`

**Events:**

- Payment successful
- Payment failed
- Subscription updated
- Subscription canceled

### Cron Jobs

**Endpoint:** `/api/cron/check-saved-searches`

**Schedule:** Every 6 hours

**Security:** Requires `CRON_SECRET` header

---

## SDKs & Examples

### JavaScript/TypeScript

```typescript
// Example: Fetch programs
const response = await fetch('/api/programs?category=Technology&limit=10');
const data = await response.json();

// Example: Add to favorites
const response = await fetch('/api/favorites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ programId: 'abc123' }),
});
```

### cURL

```bash
# Fetch programs
curl "https://affiliate-aggregator-five.vercel.app/api/programs?limit=5"

# Health check
curl "https://affiliate-aggregator-five.vercel.app/api/health"
```

---

## Support

For API support and questions:

- GitHub Issues: https://github.com/Vibecodium/affiliate-aggregator/issues
- Documentation: https://affiliate-aggregator-five.vercel.app/docs

---

**Last Updated:** 2024-12-04
**Version:** 1.0.0
