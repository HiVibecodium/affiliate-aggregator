import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/programs/suggestions
 *
 * Search suggestions for autocomplete
 * Returns top 5 matching programs based on query
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Get top 5 matching programs
    const suggestions = await prisma.affiliateProgram.findMany({
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
          {
            category: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        category: true,
        network: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('[SUGGESTIONS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
