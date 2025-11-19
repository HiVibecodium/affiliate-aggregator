/**
 * Advanced Analytics API
 *
 * GET /api/analytics/advanced
 * Returns comprehensive analytics data for charts and visualizations
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Commission Rate Distribution
    const commissionDistribution = await prisma.affiliateProgram.groupBy({
      by: ['commissionType'],
      where: { active: true, commissionType: { not: null } },
      _count: { id: true },
      _avg: { commissionRate: true },
    });

    // 2. Programs by Category (Top 10)
    const categoryStats = await prisma.affiliateProgram.groupBy({
      by: ['category'],
      where: { active: true, category: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // 3. Programs by Network
    const networkStats = await prisma.affiliateNetwork.findMany({
      where: { active: true },
      select: {
        name: true,
        _count: {
          select: {
            programs: {
              where: { active: true },
            },
          },
        },
      },
      orderBy: {
        programs: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // 4. New Programs Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newProgramsTrend = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("createdAt") as date, COUNT(*)::bigint as count
      FROM "AffiliateProgram"
      WHERE "createdAt" >= ${thirtyDaysAgo} AND "active" = true
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // 5. Cookie Duration Distribution
    const cookieDistribution = await prisma.$queryRaw<{ range: string; count: bigint }[]>`
      SELECT
        CASE
          WHEN "cookieDuration" < 7 THEN '<7 days'
          WHEN "cookieDuration" < 30 THEN '7-30 days'
          WHEN "cookieDuration" < 60 THEN '30-60 days'
          WHEN "cookieDuration" < 90 THEN '60-90 days'
          ELSE '90+ days'
        END as range,
        COUNT(*)::bigint as count
      FROM "AffiliateProgram"
      WHERE "active" = true AND "cookieDuration" IS NOT NULL
      GROUP BY range
      ORDER BY
        CASE range
          WHEN '<7 days' THEN 1
          WHEN '7-30 days' THEN 2
          WHEN '30-60 days' THEN 3
          WHEN '60-90 days' THEN 4
          ELSE 5
        END
    `;

    // 6. Payment Threshold Distribution
    const thresholdDistribution = await prisma.$queryRaw<{ range: string; count: bigint }[]>`
      SELECT
        CASE
          WHEN "paymentThreshold" < 50 THEN '<$50'
          WHEN "paymentThreshold" < 100 THEN '$50-100'
          WHEN "paymentThreshold" < 200 THEN '$100-200'
          WHEN "paymentThreshold" < 500 THEN '$200-500'
          ELSE '$500+'
        END as range,
        COUNT(*)::bigint as count
      FROM "AffiliateProgram"
      WHERE "active" = true AND "paymentThreshold" IS NOT NULL
      GROUP BY range
      ORDER BY
        CASE range
          WHEN '<$50' THEN 1
          WHEN '$50-100' THEN 2
          WHEN '$100-200' THEN 3
          WHEN '$200-500' THEN 4
          ELSE 5
        END
    `;

    // 7. Top Programs by Views (using clicks as proxy)
    const topPrograms = await prisma.affiliateProgram.findMany({
      where: { active: true },
      include: {
        network: { select: { name: true } },
        _count: {
          select: {
            clicks: true,
            reviews: true,
            applications: true,
          },
        },
      },
      orderBy: {
        clicks: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // 8. Overall Stats
    const totalPrograms = await prisma.affiliateProgram.count({ where: { active: true } });
    const totalNetworks = await prisma.affiliateNetwork.count({ where: { active: true } });
    const totalClicks = await prisma.programClick.count();
    const totalReviews = await prisma.programReview.count({ where: { status: 'approved' } });

    const avgCommission = await prisma.affiliateProgram.aggregate({
      where: { active: true, commissionRate: { not: null } },
      _avg: { commissionRate: true },
    });

    return NextResponse.json({
      overview: {
        totalPrograms,
        totalNetworks,
        totalClicks,
        totalReviews,
        avgCommission: avgCommission._avg.commissionRate?.toFixed(2) || 0,
      },
      commissionDistribution: commissionDistribution.map((item) => ({
        type: item.commissionType,
        count: item._count.id,
        avgRate: item._avg.commissionRate?.toFixed(2) || 0,
      })),
      categoryStats: categoryStats.map((item) => ({
        category: item.category,
        count: item._count.id,
      })),
      networkStats: networkStats.map((network) => ({
        name: network.name,
        count: network._count.programs,
      })),
      newProgramsTrend: newProgramsTrend.map((item) => ({
        date: item.date.toISOString().split('T')[0],
        count: Number(item.count),
      })),
      cookieDistribution: cookieDistribution.map((item) => ({
        range: item.range,
        count: Number(item.count),
      })),
      thresholdDistribution: thresholdDistribution.map((item) => ({
        range: item.range,
        count: Number(item.count),
      })),
      topPrograms: topPrograms.map((program) => ({
        id: program.id,
        name: program.name,
        network: program.network.name,
        commissionRate: program.commissionRate,
        clicks: program._count.clicks,
        reviews: program._count.reviews,
        applications: program._count.applications,
      })),
    });
  } catch (error: unknown) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
