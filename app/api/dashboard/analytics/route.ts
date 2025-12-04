import { NextResponse } from 'next/server';
import { getDashboardAnalytics } from '@/lib/dashboard/get-analytics';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const analytics = await getDashboardAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    logger.error('Dashboard analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Legacy implementation (keeping for reference)
/*
export async function GET_OLD() {
  try {
    // Parallel queries for performance
    const [
      totalPrograms,
      totalNetworks,
      activeNetworks,
      programsByNetwork,
      programsByCategory,
      avgCommission,
      topCommissions,
      recentPrograms
    ] = await Promise.all([
      // Total programs count
      prisma.affiliateProgram.count({
        where: { active: true }
      }),

      // Total networks
      prisma.affiliateNetwork.count(),

      // Active networks
      prisma.affiliateNetwork.count({
        where: { active: true }
      }),

      // Programs grouped by network
      prisma.affiliateNetwork.findMany({
        select: {
          id: true,
          name: true,
          _count: {
            select: { programs: true }
          }
        },
        orderBy: {
          programs: {
            _count: 'desc'
          }
        },
        take: 10
      }),

      // Programs grouped by category (top 10)
      prisma.affiliateProgram.groupBy({
        by: ['category'],
        _count: {
          category: true
        },
        where: {
          active: true,
          category: {
            not: null
          }
        },
        orderBy: {
          _count: {
            category: 'desc'
          }
        },
        take: 10
      }),

      // Average commission rate
      prisma.affiliateProgram.aggregate({
        _avg: {
          commissionRate: true
        },
        where: {
          active: true
        }
      }),

      // Top commission programs
      prisma.affiliateProgram.findMany({
        select: {
          id: true,
          name: true,
          commissionRate: true,
          commissionType: true,
          category: true,
          network: {
            select: {
              name: true
            }
          }
        },
        where: {
          active: true
        },
        orderBy: {
          commissionRate: 'desc'
        },
        take: 10
      }),

      // Recent programs
      prisma.affiliateProgram.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          commissionRate: true,
          createdAt: true,
          network: {
            select: {
              name: true
            }
          }
        },
        where: {
          active: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    ]);

    return NextResponse.json({
      overview: {
        totalPrograms,
        totalNetworks,
        activeNetworks,
        avgCommission: avgCommission._avg.commissionRate?.toFixed(2) || '0',
      },
      programsByNetwork: programsByNetwork.map(n => ({
        network: n.name,
        programs: n._count.programs
      })),
      programsByCategory: programsByCategory.map(c => ({
        category: c.category,
        count: c._count.category
      })),
      topCommissions,
      recentPrograms
    });
  } catch (error) {
    logger.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
*/
