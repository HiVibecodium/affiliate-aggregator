import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/analytics/popular
 * Get most clicked programs
 * Gracefully handles missing ProgramClick table
 */
export async function GET() {
  try {
    // Try to get programs with click counts
    let popularPrograms = [];

    try {
      popularPrograms = await prisma.affiliateProgram.findMany({
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
    } catch (dbError) {
      // ProgramClick table doesn't exist yet - return empty gracefully
      console.warn('Click tracking not initialized:', dbError);
      return NextResponse.json({
        popular: [],
        info: 'Click tracking table not initialized. Run prisma migrate to enable analytics.',
      });
    }

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
    // Return empty array instead of error to prevent page crash
    return NextResponse.json({
      popular: [],
      error: 'Analytics temporarily unavailable',
    });
  }
}
