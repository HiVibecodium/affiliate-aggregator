import { logger } from '@/lib/logger';
/**
 * GET /api/billing/subscription
 * Get user's current subscription
 *
 * PUT /api/billing/subscription
 * Update subscription (upgrade/downgrade)
 *
 * DELETE /api/billing/subscription
 * Cancel subscription
 */

import { NextResponse } from 'next/server';
import {
  getActiveSubscription,
  cancelSubscription,
  reactivateSubscription,
  changeSubscriptionPlan,
} from '@/lib/billing/subscription';
import { getPriceId } from '@/lib/billing/stripe';
import { prisma } from '@/lib/prisma';

/**
 * GET - Get user's subscription details
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const subscription = await getActiveSubscription(userId);

    if (!subscription) {
      return NextResponse.json({
        tier: 'free',
        status: 'active',
        subscription: null,
      });
    }

    // Get recent invoices
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      tier: subscription.tier,
      status: subscription.status,
      subscription: {
        id: subscription.id,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        trialEnd: subscription.trialEnd,
      },
      invoices,
    });
  } catch (error: unknown) {
    logger.error('Get subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get subscription' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update subscription (upgrade/downgrade)
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, newTier, newInterval } = body;

    if (!userId || !newTier || !newInterval) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['pro', 'business'].includes(newTier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    if (!['month', 'year'].includes(newInterval)) {
      return NextResponse.json({ error: 'Invalid interval' }, { status: 400 });
    }

    const subscription = await getActiveSubscription(userId);

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const newPriceId = getPriceId(newTier, newInterval);

    if (!newPriceId) {
      return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 });
    }

    // Change subscription plan
    const updated = await changeSubscriptionPlan(subscription.id, newPriceId, newTier);

    return NextResponse.json({
      success: true,
      subscription: {
        id: updated.id,
        tier: updated.tier,
        status: updated.status,
      },
    });
  } catch (error: unknown) {
    logger.error('Update subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Cancel subscription
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const immediately = searchParams.get('immediately') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const subscription = await getActiveSubscription(userId);

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Cancel subscription
    const updated = await cancelSubscription(subscription.id, immediately);

    return NextResponse.json({
      success: true,
      subscription: {
        id: updated.id,
        status: updated.status,
        cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
        canceledAt: updated.canceledAt,
      },
    });
  } catch (error: unknown) {
    logger.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Reactivate canceled subscription
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const subscription = await getActiveSubscription(userId);

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    if (!subscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        { error: 'Subscription is not scheduled for cancellation' },
        { status: 400 }
      );
    }

    // Reactivate subscription
    const updated = await reactivateSubscription(subscription.id);

    return NextResponse.json({
      success: true,
      subscription: {
        id: updated.id,
        status: updated.status,
        cancelAtPeriodEnd: updated.cancelAtPeriodEnd,
      },
    });
  } catch (error: unknown) {
    logger.error('Reactivate subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reactivate subscription' },
      { status: 500 }
    );
  }
}
