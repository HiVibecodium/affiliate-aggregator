import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const where: any = { active: true };

    if (network) {
      where.network = { name: network };
    }

    if (country) {
      where.network = {
        ...where.network,
        country: country,
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
        mode: 'insensitive',
      };
    }

    if (minCommission || maxCommission) {
      where.commissionRate = {};
      if (minCommission) where.commissionRate.gte = parseFloat(minCommission);
      if (maxCommission) where.commissionRate.lte = parseFloat(maxCommission);
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'commission') {
      orderBy.commissionRate = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
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
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.affiliateProgram.count({ where }),
    ]);

    return NextResponse.json({
      programs,
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
