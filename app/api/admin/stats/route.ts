/**
 * Admin Stats API
 * Comprehensive business metrics for admin dashboard
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // User Stats
    const totalUsers = await prisma.user.count();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const newUsersLast30Days = await prisma.user.count({
      where: { createdAt: { gte: last30Days } },
    });

    // Subscription Stats
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: { in: ['active', 'trialing'] } },
    });

    const subscriptionsByTier = await prisma.subscription.groupBy({
      by: ['tier'],
      where: { status: { in: ['active', 'trialing'] } },
      _count: { id: true },
    });

    // Revenue (from invoices)
    const totalRevenue = await prisma.invoice.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true },
    });

    const last30DaysRevenue = await prisma.invoice.aggregate({
      where: {
        status: 'paid',
        paidAt: { gte: last30Days },
      },
      _sum: { amount: true },
    });

    // MRR calculation
    const mrr = await prisma.subscription.findMany({
      where: { status: { in: ['active', 'trialing'] } },
      select: { tier: true },
    });

    const mrrValue = mrr.reduce((sum, sub) => {
      const prices: Record<string, number> = {
        pro: 12,
        business: 49,
        enterprise: 500, // average
        free: 0,
      };
      return sum + (prices[sub.tier] || 0);
    }, 0);

    // Program Stats
    const totalPrograms = await prisma.affiliateProgram.count({ where: { active: true } });
    const totalNetworks = await prisma.affiliateNetwork.count({ where: { active: true } });

    // Engagement Stats
    const totalClicks = await prisma.programClick.count();
    const totalReviews = await prisma.programReview.count();
    const totalApplications = await prisma.programApplication.count();
    const totalFavorites = await prisma.favorite.count();

    // Saved Searches
    const totalSavedSearches = await prisma.savedSearch.count({ where: { active: true } });
    const alertsEnabled = await prisma.savedSearch.count({
      where: { active: true, alertsEnabled: true },
    });

    // Referrals
    const totalReferrals = await prisma.referral.count();
    const completedReferrals = await prisma.referral.count({ where: { status: 'completed' } });

    // Recent Activity
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { email: true, createdAt: true },
    });

    const recentSubscriptions = await prisma.subscription.findMany({
      where: { status: { in: ['active', 'trialing'] } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { tier: true, status: true, createdAt: true, userId: true },
    });

    return NextResponse.json({
      users: {
        total: totalUsers,
        new30Days: newUsersLast30Days,
        growth: totalUsers > 0 ? ((newUsersLast30Days / totalUsers) * 100).toFixed(1) : 0,
      },
      subscriptions: {
        active: activeSubscriptions,
        byTier: subscriptionsByTier.map((s) => ({
          tier: s.tier,
          count: s._count.id,
        })),
        conversionRate: totalUsers > 0 ? ((activeSubscriptions / totalUsers) * 100).toFixed(1) : 0,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        last30Days: last30DaysRevenue._sum.amount || 0,
        mrr: mrrValue,
        arr: mrrValue * 12,
      },
      programs: {
        total: totalPrograms,
        networks: totalNetworks,
      },
      engagement: {
        clicks: totalClicks,
        reviews: totalReviews,
        applications: totalApplications,
        favorites: totalFavorites,
        savedSearches: totalSavedSearches,
        alertsEnabled,
      },
      referrals: {
        total: totalReferrals,
        completed: completedReferrals,
        conversionRate:
          totalReferrals > 0 ? ((completedReferrals / totalReferrals) * 100).toFixed(1) : 0,
      },
      recent: {
        users: recentUsers,
        subscriptions: recentSubscriptions,
      },
    });
  } catch (error: unknown) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
