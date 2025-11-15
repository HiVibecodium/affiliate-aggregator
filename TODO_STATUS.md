# Remaining TODO Items - Full Audit

## Found TODO Comments (4 total):

### 1. app/api/billing/checkout/route.ts:56

```typescript
couponId: couponCode, // TODO: Validate coupon code
```

**Status:** Import added, validation NOT added
**Action Needed:** Add validation before line 46

### 2. app/api/referrals/route.ts:123

```typescript
// TODO: Send invitation email
```

**Status:** NOT done
**Action Needed:** Add Resend email integration

### 3. app/billing/page.tsx:10

```typescript
// Mock data for demo - TODO: Replace with actual auth
```

**Status:** NOT done
**Action Needed:** Replace with real Supabase auth

### 4. lib/billing/webhooks.ts:241

```typescript
// TODO: Send notification to user about failed payment
```

**Status:** NOT done
**Action Needed:** Add Resend email notification

---

## Priority Classification:

### HIGH Priority (Functional):

1. ✅ Coupon validation - NEEDS FIX (code not applied)

### MEDIUM Priority (UX):

2. ⏸️ Billing page auth - Nice to have
3. ⏸️ Payment failed emails - Requires Resend

### LOW Priority (Optional):

4. ⏸️ Referral emails - Requires Resend

---

## Recommendation:

Fix coupon validation NOW (high priority functional fix)
Others can wait for Resend setup
