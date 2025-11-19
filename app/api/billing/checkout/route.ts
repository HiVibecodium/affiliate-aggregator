/**
 * POST /api/billing/checkout
 *
 * Create Stripe checkout session for subscription
 */

import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/billing/subscription';
import { getPriceId, isStripeConfigured } from '@/lib/billing/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Billing system not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { userId, email, tier, interval, trialDays, couponCode } = body;

    if (!userId || !email || !tier || !interval) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['pro', 'business'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    if (!['month', 'year'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
    }

    const priceId = getPriceId(tier, interval);

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured. Please set Stripe price IDs in environment variables.' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Validate coupon code if provided
    let validatedCouponId = couponCode;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode, active: true },
      });

      if (!coupon) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
      }

      if (coupon.validUntil && new Date() > coupon.validUntil) {
        return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
      }

      validatedCouponId = coupon.stripeCouponId || couponCode;
    }

    const session = await createCheckoutSession({
      userId,
      email,
      priceId,
      tier,
      successUrl: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/billing/upgrade`,
      trialDays,
      couponId: validatedCouponId,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
