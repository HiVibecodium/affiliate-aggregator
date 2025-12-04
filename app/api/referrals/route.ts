import { logger } from '@/lib/logger';
/**
 * Referral System API
 *
 * GET /api/referrals?userId={id} - Get user's referral stats
 * POST /api/referrals - Create referral link
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/resend-client';
import { generateReferralInviteEmail } from '@/lib/email/templates/referral-invite';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'REF-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * GET - Get user's referral data
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get or create referral code
    let referral = await prisma.referral.findFirst({
      where: { referrerId: userId, status: 'pending' },
    });

    if (!referral) {
      // Create new referral code
      const code = generateReferralCode();
      referral = await prisma.referral.create({
        data: {
          referrerId: userId,
          referralCode: code,
          status: 'pending',
          referrerReward: '1_month_free',
          referredReward: '50_percent_off',
        },
      });
    }

    // Get referral stats
    const stats = await prisma.referral.aggregate({
      where: { referrerId: userId },
      _count: { id: true },
    });

    const completed = await prisma.referral.count({
      where: { referrerId: userId, status: 'completed' },
    });

    const rewarded = await prisma.referral.count({
      where: { referrerId: userId, status: 'rewarded' },
    });

    return NextResponse.json({
      referralCode: referral.referralCode,
      stats: {
        total: stats._count.id,
        completed,
        rewarded,
        pending: stats._count.id - completed - rewarded,
      },
    });
  } catch (error: unknown) {
    logger.error('Referral error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Invite via email
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Get user's referral code
    let referral = await prisma.referral.findFirst({
      where: { referrerId: userId, status: 'pending' },
    });

    if (!referral) {
      const code = generateReferralCode();
      referral = await prisma.referral.create({
        data: {
          referrerId: userId,
          referralCode: code,
          email,
          status: 'pending',
          referrerReward: '1_month_free',
          referredReward: '50_percent_off',
        },
      });
    } else {
      // Update with invited email
      referral = await prisma.referral.create({
        data: {
          referrerId: userId,
          referralCode: referral.referralCode,
          email,
          status: 'pending',
          referrerReward: '1_month_free',
          referredReward: '50_percent_off',
        },
      });
    }

    // Get referrer details for email
    const referrer = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    // Build signup URL with referral code
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const signupUrl = `${appUrl}/signup?ref=${referral.referralCode}`;

    // Send invitation email
    const emailTemplate = generateReferralInviteEmail({
      referrerName: referrer?.name || referrer?.email || 'Your friend',
      referralCode: referral.referralCode,
      signupUrl,
      referrerReward: referral.referrerReward || '1_month_free',
      referredReward: referral.referredReward || '50_percent_off',
      appUrl,
    });

    const emailResult = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (!emailResult.success) {
      logger.error('Failed to send referral invitation email:', {
        userId,
        email,
        reason: emailResult.reason || 'unknown',
        error: emailResult.error,
      });
    } else {
      logger.log('Referral invitation sent:', {
        userId,
        email,
        referralCode: referral.referralCode,
      });
    }

    return NextResponse.json({
      success: true,
      referral,
      emailSent: emailResult.success,
      message: emailResult.success
        ? `Invitation sent to ${email}`
        : 'Referral created but email not sent - check configuration',
    });
  } catch (error: unknown) {
    logger.error('Invite error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
