import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Filters
    const network = searchParams.get('network');
    const category = searchParams.get('category');
    const commissionType = searchParams.get('commissionType');
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const minCommission = searchParams.get('minCommission');
    const maxCommission = searchParams.get('maxCommission');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.AffiliateProgramWhereInput = { active: true };

    if (network || country) {
      where.network = {
        ...(network ? { name: network } : {}),
        ...(country ? { country: country } : {}),
      };
    }

    if (category) {
      where.category = category;
    }

    if (commissionType) {
      where.commissionType = commissionType;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive' as Prisma.QueryMode,
      };
    }

    if (minCommission || maxCommission) {
      where.commissionRate = {
        ...(minCommission ? { gte: parseFloat(minCommission) } : {}),
        ...(maxCommission ? { lte: parseFloat(maxCommission) } : {}),
      };
    }

    // Build orderBy clause
    const orderBy: Prisma.AffiliateProgramOrderByWithRelationInput = {};
    if (sortBy === 'commission') {
      orderBy.commissionRate = sortOrder as Prisma.SortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder as Prisma.SortOrder;
    } else {
      orderBy.createdAt = sortOrder as Prisma.SortOrder;
    }

    const [programs, total] = await Promise.all([
      prisma.affiliateProgram.findMany({
        where,
        include: {
          network: {
            select: {
              name: true,
              website: true,
            },
          },
          _count: {
            select: {
              reviews: {
                where: { status: 'approved' },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.affiliateProgram.count({ where }),
    ]);

    // Get average ratings for programs (in parallel)
    const programIds = programs.map((p) => p.id);
    const ratings = await prisma.programReview.groupBy({
      by: ['programId'],
      where: {
        programId: { in: programIds },
        status: 'approved',
      },
      _avg: {
        rating: true,
      },
    });

    // Create rating map
    const ratingMap = new Map(ratings.map((r) => [r.programId, r._avg.rating || 0]));

    // Add rating to each program
    const programsWithRatings = programs.map((p) => ({
      ...p,
      averageRating: ratingMap.get(p.id) || null,
      reviewCount: p._count.reviews,
    }));

    return NextResponse.json({
      programs: programsWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch programs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
