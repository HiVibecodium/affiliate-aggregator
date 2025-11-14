/**
 * Dashboard Analytics Data Fetcher
 * Server-side data fetching for dashboard analytics
 */

import { prisma } from '@/lib/prisma';

export interface DashboardAnalytics {
  overview: {
    totalPrograms: number;
    totalNetworks: number;
    activeNetworks: number;
    avgCommission: string;
  };
  programsByNetwork: Array<{ network: string; programs: number }>;
  programsByCategory: Array<{ category: string; count: number }>;
  topCommissions: Array<{
    id: string;
    name: string;
    commissionRate: number | null;
    commissionType: string | null;
    category: string | null;
    network: { name: string };
  }>;
  recentPrograms: Array<{
    id: string;
    name: string;
    category: string | null;
    commissionRate: number | null;
    createdAt: Date;
    network: { name: string };
  }>;
}

/**
 * Fetch dashboard analytics data
 * This function can be called directly from Server Components
 */
export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  // Parallel queries for optimal performance
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

  return {
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
      category: c.category!,
      count: c._count.category
    })),
    topCommissions,
    recentPrograms
  };
}
