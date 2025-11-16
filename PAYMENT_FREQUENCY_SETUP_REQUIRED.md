# ⚠️ Payment Frequency Setup Required

## TypeScript Error

You're seeing this because the payment frequency feature code is committed, but the database migration hasn't been executed yet.

**Error:**

```
Property 'paymentFrequency' does not exist on type 'AffiliateProgramWhereInput'
```

## Solution

Execute the SQL migration to enable the payment frequency feature:

### Step 1: Execute SQL Migration

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Add paymentFrequency column
ALTER TABLE "AffiliateProgram"
ADD COLUMN "paymentFrequency" TEXT;

-- Add index
CREATE INDEX "AffiliateProgram_paymentFrequency_idx"
ON "AffiliateProgram"("paymentFrequency");
```

**If column already exists:**

```sql
-- Just create index
CREATE INDEX IF NOT EXISTS "AffiliateProgram_paymentFrequency_idx"
ON "AffiliateProgram"("paymentFrequency");
```

### Step 2: Update Prisma

```bash
# Pull schema from database
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

### Step 3: Verify

```bash
# TypeScript should compile
npm run build

# Tests should pass
npm test

# Push should work
git push
```

## Full Instructions

See `PAYMENT_FREQUENCY_MIGRATION.md` for complete guide.

## Quick Fix (Temporary)

If you need to push NOW without setting up the feature, you can:

**Option 1: Skip the hook (not recommended)**

```bash
git push --no-verify
```

**Option 2: Complete the setup (5 min)**
Follow steps above ↑

---

🤖 The payment frequency feature is fully implemented and ready to use once migration is executed!
