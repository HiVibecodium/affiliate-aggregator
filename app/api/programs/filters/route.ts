import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/programs/filters
 * Returns available filter options for categories and commission types
 * Supports cascading filters - returns only options available for current filter selection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get current filter values for cascading
    const network = searchParams.get('network');
    const category = searchParams.get('category');
    const commissionType = searchParams.get('commissionType');

    // Build base where clause for cascading filters
    const baseWhere: any = { active: true };

    if (network) {
      baseWhere.network = { name: network };
    }

    // Get unique categories (excluding null) with cascading
    const categoriesWhere = { ...baseWhere, category: { not: null } };
    if (commissionType) {
      categoriesWhere.commissionType = commissionType;
    }

    const categories = await prisma.affiliateProgram.groupBy({
      by: ['category'],
      where: categoriesWhere,
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    // Get unique commission types with cascading
    const commissionTypesWhere = { ...baseWhere, commissionType: { not: null } };
    if (category) {
      commissionTypesWhere.category = category;
    }

    const commissionTypes = await prisma.affiliateProgram.groupBy({
      by: ['commissionType'],
      where: commissionTypesWhere,
      _count: {
        commissionType: true,
      },
      orderBy: {
        _count: {
          commissionType: 'desc',
        },
      },
    });

    // Get commission rate range with cascading
    const commissionStatsWhere = { ...baseWhere };
    if (category) {
      commissionStatsWhere.category = category;
    }
    if (commissionType) {
      commissionStatsWhere.commissionType = commissionType;
    }

    const commissionStats = await prisma.affiliateProgram.aggregate({
      where: commissionStatsWhere,
      _min: { commissionRate: true },
      _max: { commissionRate: true },
    });

    return NextResponse.json({
      categories: categories.map((c) => ({
        value: c.category,
        count: c._count.category,
      })),
      commissionTypes: commissionTypes.map((ct) => ({
        value: ct.commissionType,
        count: ct._count.commissionType,
      })),
      commissionRange: {
        min: commissionStats._min.commissionRate || 0,
        max: commissionStats._max.commissionRate || 100,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch filters',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
