/**
 * Test Billing Schema
 *
 * Quick test script to verify billing models work correctly
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testBillingSchema() {
  console.log('🧪 Testing Billing Schema...\n')

  try {
    // First, create a test user
    console.log('0️⃣  Creating test user...')
    const testUser = await prisma.user.create({
      data: {
        email: 'test-' + Date.now() + '@billing.test',
        name: 'Test User',
      }
    })
    console.log('   ✅ Test user created:', testUser.id)

    const testUserId = testUser.id

    // 1. Test Subscription model
    console.log('\n1️⃣  Testing Subscription model...')
    const subscription = await prisma.subscription.create({
      data: {
        userId: testUserId,
        stripeCustomerId: 'cus_test_' + Date.now(),
        tier: 'pro',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    })
    console.log('   ✅ Subscription created:', subscription.id)

    // 2. Test PaymentMethod model
    console.log('\n2️⃣  Testing PaymentMethod model...')
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: testUserId,
        stripePaymentMethodId: 'pm_test_' + Date.now(),
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      }
    })
    console.log('   ✅ Payment method created:', paymentMethod.id)

    // 3. Test Invoice model
    console.log('\n3️⃣  Testing Invoice model...')
    const invoice = await prisma.invoice.create({
      data: {
        userId: testUserId,
        subscriptionId: subscription.id,
        stripeInvoiceId: 'in_test_' + Date.now(),
        amount: 12.00,
        currency: 'usd',
        status: 'paid',
        paidAt: new Date(),
      }
    })
    console.log('   ✅ Invoice created:', invoice.id)

    // 4. Test UsageMetric model
    console.log('\n4️⃣  Testing UsageMetric model...')
    const today = new Date().toISOString().split('T')[0]
    const usageMetric = await prisma.usageMetric.create({
      data: {
        userId: testUserId,
        metric: 'favorites_count',
        value: 3,
        period: 'lifetime',
        date: new Date(today),
      }
    })
    console.log('   ✅ Usage metric created:', usageMetric.id)

    // 5. Test Coupon model
    console.log('\n5️⃣  Testing Coupon model...')
    const coupon = await prisma.coupon.create({
      data: {
        code: 'TEST_' + Date.now(),
        name: 'Test Coupon',
        percentOff: 50,
        maxRedemptions: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        applicableTiers: ['pro', 'business'],
        active: true,
      }
    })
    console.log('   ✅ Coupon created:', coupon.id)

    // 6. Test CouponRedemption model
    console.log('\n6️⃣  Testing CouponRedemption model...')
    const redemption = await prisma.couponRedemption.create({
      data: {
        couponId: coupon.id,
        userId: testUserId,
        discountAmount: 6.00,
        appliedTo: subscription.id,
      }
    })
    console.log('   ✅ Coupon redemption created:', redemption.id)

    // 7. Test BillingEvent model
    console.log('\n7️⃣  Testing BillingEvent model...')
    const billingEvent = await prisma.billingEvent.create({
      data: {
        userId: testUserId,
        type: 'subscription_created',
        description: 'Test subscription created',
        status: 'success',
        subscriptionId: subscription.id,
        eventData: { test: true },
      }
    })
    console.log('   ✅ Billing event created:', billingEvent.id)

    // 8. Test Referral model
    console.log('\n8️⃣  Testing Referral model...')
    const referral = await prisma.referral.create({
      data: {
        referrerId: testUserId,
        referralCode: 'REF_' + Date.now(),
        email: 'test@example.com',
        status: 'pending',
        referrerReward: '1_month_free',
        referredReward: '50_percent_off',
      }
    })
    console.log('   ✅ Referral created:', referral.id)

    // 9. Test Credit model
    console.log('\n9️⃣  Testing Credit model...')
    const credit = await prisma.credit.create({
      data: {
        userId: testUserId,
        amount: 10.00,
        currency: 'usd',
        description: 'Referral bonus',
        source: 'referral',
        applied: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      }
    })
    console.log('   ✅ Credit created:', credit.id)

    // Test queries
    console.log('\n📊 Testing Queries...')

    // Get user's subscription with invoices
    const userPlan = await prisma.subscription.findFirst({
      where: {
        userId: testUserId,
        status: 'active',
      },
      include: {
        invoices: true,
      }
    })
    console.log('   ✅ User plan query:', {
      tier: userPlan?.tier,
      invoiceCount: userPlan?.invoices.length,
    })

    // Get available credits
    const credits = await prisma.credit.findMany({
      where: {
        userId: testUserId,
        applied: false,
      }
    })
    const totalCredits = credits.reduce((sum, c) => sum + c.amount, 0)
    console.log('   ✅ Available credits:', totalCredits)

    // Get usage metrics
    const metrics = await prisma.usageMetric.findMany({
      where: { userId: testUserId }
    })
    console.log('   ✅ Usage metrics count:', metrics.length)

    // Cleanup
    console.log('\n🧹 Cleaning up test data...')
    await prisma.credit.deleteMany({ where: { userId: testUserId } })
    await prisma.referral.deleteMany({ where: { referrerId: testUserId } })
    await prisma.billingEvent.deleteMany({ where: { userId: testUserId } })
    await prisma.couponRedemption.deleteMany({ where: { userId: testUserId } })
    await prisma.coupon.deleteMany({ where: { id: coupon.id } })
    await prisma.usageMetric.deleteMany({ where: { userId: testUserId } })
    await prisma.invoice.deleteMany({ where: { userId: testUserId } })
    await prisma.paymentMethod.deleteMany({ where: { userId: testUserId } })
    await prisma.subscription.deleteMany({ where: { userId: testUserId } })
    await prisma.user.delete({ where: { id: testUserId } })
    console.log('   ✅ Cleanup complete')

    console.log('\n✅ All tests passed! Billing schema is working correctly.\n')

  } catch (error) {
    console.error('\n❌ Test failed:', error)
    throw error
  }
}

// Run tests
testBillingSchema()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
