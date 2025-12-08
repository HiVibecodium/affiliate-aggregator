import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 10);

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const programs = await prisma.affiliateProgram.findMany({
      where: {
        active: true,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            network: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        commissionRate: true,
        network: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
      orderBy: {
        commissionRate: 'desc',
      },
    });

    const suggestions = programs.map((p) => ({
      id: p.id,
      name: p.name,
      network: p.network.name,
      commissionRate: p.commissionRate,
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
