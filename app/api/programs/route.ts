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
    const paymentMethod = searchParams.get('paymentMethod');
    const minCookieDuration = searchParams.get('minCookieDuration');
    const maxCookieDuration = searchParams.get('maxCookieDuration');
    const minPaymentThreshold = searchParams.get('minPaymentThreshold');
    const maxPaymentThreshold = searchParams.get('maxPaymentThreshold');
    const minRating = searchParams.get('minRating');
    const since = searchParams.get('since'); // Number of days (e.g., "7" for last 7 days)
    const hasReviews = searchParams.get('hasReviews') === 'true';
    const paymentFrequency = searchParams.get('paymentFrequency');

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
      // Enhanced search: search in name, description, and network name
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
        {
          network: {
            name: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        },
      ];
    }

    if (minCommission || maxCommission) {
      where.commissionRate = {
        ...(minCommission ? { gte: parseFloat(minCommission) } : {}),
        ...(maxCommission ? { lte: parseFloat(maxCommission) } : {}),
      };
    }

    // New filters
    if (paymentMethod) {
      where.paymentMethods = {
        has: paymentMethod,
      };
    }

    if (minCookieDuration) {
      where.cookieDuration = {
        gte: parseInt(minCookieDuration),
      };
    }

    // Payment threshold filter
    if (minPaymentThreshold || maxPaymentThreshold) {
      where.paymentThreshold = {
        ...(minPaymentThreshold ? { gte: parseFloat(minPaymentThreshold) } : {}),
        ...(maxPaymentThreshold ? { lte: parseFloat(maxPaymentThreshold) } : {}),
      };
    }

    // Date filter for "New Programs" page
    if (since) {
      const daysAgo = parseInt(since);
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - daysAgo);

      where.createdAt = {
        gte: sinceDate,
      };
    }

    // Has Reviews filter
    if (hasReviews) {
      where.reviews = {
        some: {
          status: 'approved',
        },
      };
    }

    // Payment Frequency filter
    if (paymentFrequency) {
      where.paymentFrequency = paymentFrequency;
    }

    // Note: Rating filter requires join with reviews - handled client-side for now

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
