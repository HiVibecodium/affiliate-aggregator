import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/analytics/popular
 * Get most clicked programs
 */
export async function GET() {
  try {
    // Get programs with click counts
    const popularPrograms = await prisma.affiliateProgram.findMany({
      where: { active: true },
      include: {
        network: {
          select: { name: true },
        },
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: {
        clicks: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return NextResponse.json({
      popular: popularPrograms.map((p) => ({
        id: p.id,
        name: p.name,
        network: p.network.name,
        category: p.category,
        commissionRate: p.commissionRate,
        clicks: p._count.clicks,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch popular programs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
