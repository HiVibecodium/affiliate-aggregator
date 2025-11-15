# Stripe Dashboard Setup Guide

**Time Required:** 20 minutes
**Difficulty:** Easy - Step by step instructions

---

## Step 1: Get Stripe API Keys (3 minutes)

### 1.1 Go to Stripe Dashboard
👉 https://dashboard.stripe.com/

### 1.2 Make Sure You're in TEST MODE
- Look at top-left corner
- Should say **"Test mode"** with toggle
- ⚠️ IMPORTANT: Stay in test mode for now!

### 1.3 Get Your API Keys
1. Click **Developers** in left sidebar
2. Click **API keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

### 1.4 Copy Keys
Copy both keys - we'll add them to `.env.local` later

```
✅ Publishable key: pk_test_51...
✅ Secret key: sk_test_51...
```

---

## Step 2: Create Products (7 minutes)

### 2.1 Create PRO PLAN Product

1. Click **Products** in left sidebar
2. Click **+ Add product** button (top right)
3. Fill in:
   ```
   Name: Pro Plan
   Description: For serious affiliate marketers
   ```
4. **Don't click Save yet!** We'll add prices next

### 2.2 Add PRO Monthly Price

In the same form (Pricing section):

```
Price: $12.00
Billing period: Monthly
```

Click **Add another price** (don't save yet)

### 2.3 Add PRO Yearly Price

```
Price: $99.00
Billing period: Yearly
```

5. Now click **Save product**

### 2.4 Copy PRO Price IDs

After saving, you'll see the product page with 2 prices:
1. Click on **$12.00/month** price
   - Copy the Price ID (starts with `price_`)
   - Note: This is `STRIPE_PRO_MONTHLY_PRICE_ID`

2. Go back and click on **$99.00/year** price
   - Copy the Price ID
   - Note: This is `STRIPE_PRO_YEARLY_PRICE_ID`

```
✅ Pro Monthly Price ID: price_...
✅ Pro Yearly Price ID: price_...
```

---

### 2.5 Create BUSINESS PLAN Product

Repeat the same process:

1. Click **Products** → **+ Add product**
2. Fill in:
   ```
   Name: Business Plan
   Description: For teams and agencies
   ```

### 2.6 Add BUSINESS Prices

**Monthly:**
```
Price: $49.00
Billing period: Monthly
```

Click **Add another price**

**Yearly:**
```
Price: $399.00
Billing period: Yearly
```

3. Click **Save product**

### 2.7 Copy BUSINESS Price IDs

1. Click on **$49.00/month** price
   - Copy Price ID
   - Note: This is `STRIPE_BUSINESS_MONTHLY_PRICE_ID`

2. Click on **$399.00/year** price
   - Copy Price ID
   - Note: This is `STRIPE_BUSINESS_YEARLY_PRICE_ID`

```
✅ Business Monthly Price ID: price_...
✅ Business Yearly Price ID: price_...
```

---

## Step 3: Configure Webhook (5 minutes)

### 3.1 Add Webhook Endpoint

1. Click **Developers** in left sidebar
2. Click **Webhooks**
3. Click **+ Add endpoint** button

### 3.2 Configure Endpoint

**Endpoint URL:**
```
http://localhost:3000/api/billing/webhooks
```

⚠️ NOTE: For production, this will be `https://your-domain.com/api/billing/webhooks`

**Description:** (optional)
```
Billing webhook for subscription events
```

### 3.3 Select Events to Listen To

Click **+ Select events**

Find and check these events:

**Checkout:**
- ✅ `checkout.session.completed`

**Customer:**
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`

**Invoice:**
- ✅ `invoice.paid`
- ✅ `invoice.payment_failed`

**Payment Method:**
- ✅ `payment_method.attached`

Click **Add events** at bottom

### 3.4 Save Endpoint

Click **Add endpoint** button

### 3.5 Get Webhook Secret

After saving:
1. Click on your new webhook endpoint
2. Click **Reveal** under "Signing secret"
3. Copy the secret (starts with `whsec_`)

```
✅ Webhook Secret: whsec_...
```

---

## Step 4: Update Environment Variables (3 minutes)

Now we'll add all the keys to your `.env.local` file.

Open `affiliate-aggregator/.env.local` and add:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_51...  # From Step 1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...  # From Step 1
STRIPE_WEBHOOK_SECRET=whsec_...  # From Step 3

# Stripe Price IDs
STRIPE_PRO_MONTHLY_PRICE_ID=price_...  # From Step 2.4
STRIPE_PRO_YEARLY_PRICE_ID=price_...   # From Step 2.4
STRIPE_BUSINESS_MONTHLY_PRICE_ID=price_...  # From Step 2.7
STRIPE_BUSINESS_YEARLY_PRICE_ID=price_...   # From Step 2.7
```

Save the file.

---

## Step 5: Test Checkout Flow (2 minutes)

### 5.1 Start Dev Server

```bash
cd affiliate-aggregator
npm run dev
```

### 5.2 Test Checkout API

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/api/billing/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "email": "test@example.com",
    "tier": "pro",
    "interval": "month"
  }'
```

You should get a response like:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### 5.3 Open Checkout in Browser

Copy the `url` from the response and open it in your browser.

You should see Stripe's checkout page! 🎉

### 5.4 Test with Test Card

Use Stripe's test card:

```
Card number: 4242 4242 4242 4242
Expiry: 12/34 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

Complete the checkout!

### 5.5 Verify in Stripe Dashboard

1. Go back to Stripe Dashboard
2. Click **Payments** in sidebar
3. You should see your test payment! ✅

---

## Step 6: Test Webhooks Locally (Optional but Recommended)

### 6.1 Install Stripe CLI

**Windows:**
```bash
choco install stripe-cli
```

**macOS:**
```bash
brew install stripe/stripe-brew/stripe
```

**Linux:**
```bash
# Download from https://github.com/stripe/stripe-cli/releases
```

### 6.2 Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authorize.

### 6.3 Forward Webhooks to Local

```bash
stripe listen --forward-to localhost:3000/api/billing/webhooks
```

Keep this terminal open. You'll see webhook events appear here!

### 6.4 Trigger Test Events

In another terminal:

```bash
# Test checkout completed
stripe trigger checkout.session.completed

# Test subscription created
stripe trigger customer.subscription.created

# Test invoice paid
stripe trigger invoice.paid
```

You should see:
1. Events in the `stripe listen` terminal
2. Logs in your `npm run dev` terminal
3. New records in your database!

---

## Step 7: Verify Database Records

### 7.1 Check Subscription Created

After completing a test checkout, check your database:

```bash
cd affiliate-aggregator
npx dotenv -e .env.local -- prisma studio
```

Navigate to **Subscription** table - you should see a new record! ✅

Check these tables:
- ✅ `Subscription` - Your test subscription
- ✅ `Invoice` - Payment record
- ✅ `BillingEvent` - Webhook events

---

## Troubleshooting

### Issue: "Price ID not configured" error

**Solution:**
- Make sure all price IDs are in `.env.local`
- Restart dev server after adding env variables

### Issue: Webhook not receiving events

**Solution:**
1. Make sure `stripe listen` is running
2. Check webhook secret is correct in `.env.local`
3. Restart dev server

### Issue: "Customer not found" error

**Solution:**
- This is normal for first test
- Webhook will create customer automatically

### Issue: Can't find Price IDs in Stripe

**Solution:**
1. Go to **Products**
2. Click on product name
3. Click on individual price (e.g., "$12.00/month")
4. Price ID is at the top

---

## Production Setup (When Ready)

When you're ready for production:

### 1. Switch to Live Mode
- Toggle "Test mode" OFF in Stripe Dashboard
- Create products/prices again in Live mode
- Get Live API keys

### 2. Update Webhook URL
```
https://affiliate-aggregator-five.vercel.app/api/billing/webhooks
```

### 3. Update .env.production
Replace all `test` keys with `live` keys:
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From live webhook
# ... live price IDs
```

---

## Summary Checklist

After completing this guide, you should have:

- [x] Stripe account with API keys
- [x] Pro Plan product with monthly/yearly prices
- [x] Business Plan product with monthly/yearly prices
- [x] Webhook endpoint configured
- [x] Environment variables updated
- [x] Test checkout completed successfully
- [x] Webhook events verified
- [x] Database records created

---

## What's Next?

Now you have a **fully functional billing system**! 🎉

You can:
1. ✅ Accept payments through Stripe Checkout
2. ✅ Manage subscriptions automatically
3. ✅ Track usage and enforce limits
4. ✅ Handle webhooks for all events

**Optional:**
- Build custom pricing page UI
- Build billing dashboard UI
- Add upgrade prompts to your app

**But you can already sell subscriptions right now!** 🚀

---

## Quick Reference

**Stripe Dashboard:** https://dashboard.stripe.com/
**API Keys:** Developers → API keys
**Products:** Products
**Webhooks:** Developers → Webhooks
**Payments:** Payments (see all transactions)

**Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

---

**Need help?** Check `BILLING_API_USAGE.md` for code examples!
