import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get active users (simulated - in production you'd track actual sessions)
    const activeUsers = Math.floor(Math.random() * 100) + 50;

    // Get today's clicks
    const clicksToday = await prisma.click.count({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    });

    // Get today's conversions (applications)
    const conversionsToday = await prisma.application.count({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    });

    // Calculate estimated revenue (this would come from actual conversion data)
    const revenueToday = conversionsToday * 25; // Assuming $25 avg commission

    // Get top performing programs today
    const topProgramsData = await prisma.click.groupBy({
      by: ['programId'],
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    // Fetch program details
    const topPrograms = await Promise.all(
      topProgramsData.map(async (item) => {
        const program = await prisma.program.findUnique({
          where: { id: item.programId },
          select: { id: true, name: true },
        });

        const conversions = await prisma.application.count({
          where: {
            programId: item.programId,
            createdAt: {
              gte: startOfDay,
            },
          },
        });

        return {
          id: item.programId,
          name: program?.name || 'Unknown Program',
          clicks: item._count.id,
          conversions,
        };
      })
    );

    return NextResponse.json({
      activeUsers,
      clicksToday,
      conversionsToday,
      revenueToday,
      topPrograms,
    });
  } catch (error) {
    console.error('Error fetching realtime analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch realtime analytics' }, { status: 500 });
  }
}
