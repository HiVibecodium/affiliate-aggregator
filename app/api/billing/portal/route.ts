import { logger } from '@/lib/logger';
/**
 * POST /api/billing/portal
 *
 * Create Stripe customer portal session
 * Allows users to manage subscription, payment methods, and view invoices
 */

import { NextResponse } from 'next/server';
import { createPortalSession } from '@/lib/billing/subscription';
import { getActiveSubscription } from '@/lib/billing/subscription';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user's active subscription to find customer ID
    const subscription = await getActiveSubscription(userId);

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/billing`;

    // Create portal session
    const session = await createPortalSession(subscription.stripeCustomerId, returnUrl);

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    logger.error('Portal session error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
