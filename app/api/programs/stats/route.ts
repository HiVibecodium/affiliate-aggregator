import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCached, CacheKeys } from '@/lib/cache';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Use cache with 5 minute TTL
    const stats = await getCached(
      CacheKeys.PROGRAMS_STATS,
      async () => {
        const [totalPrograms, totalNetworks, programsByNetwork] = await Promise.all([
          prisma.affiliateProgram.count(),
          prisma.affiliateNetwork.count(),
          prisma.affiliateNetwork.findMany({
            include: {
              _count: {
                select: { programs: true },
              },
            },
          }),
        ]);

        return {
          totalPrograms,
          totalNetworks,
          networks: programsByNetwork.map((n) => ({
            name: n.name,
            programs: n._count.programs,
          })),
        };
      },
      300
    ); // 5 minutes

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
