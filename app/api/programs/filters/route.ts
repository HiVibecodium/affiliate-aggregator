import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/programs/filters
 * Returns available filter options for categories and commission types
 */
export async function GET() {
  try {
    // Get unique categories (excluding null)
    const categories = await prisma.affiliateProgram.groupBy({
      by: ['category'],
      where: {
        active: true,
        category: { not: null }
      },
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    // Get unique commission types
    const commissionTypes = await prisma.affiliateProgram.groupBy({
      by: ['commissionType'],
      where: {
        active: true,
        commissionType: { not: null }
      },
      _count: {
        commissionType: true
      },
      orderBy: {
        _count: {
          commissionType: 'desc'
        }
      }
    });

    // Get commission rate range
    const commissionStats = await prisma.affiliateProgram.aggregate({
      where: { active: true },
      _min: { commissionRate: true },
      _max: { commissionRate: true }
    });

    return NextResponse.json({
      categories: categories.map(c => ({
        value: c.category,
        count: c._count.category
      })),
      commissionTypes: commissionTypes.map(ct => ({
        value: ct.commissionType,
        count: ct._count.commissionType
      })),
      commissionRange: {
        min: commissionStats._min.commissionRate || 0,
        max: commissionStats._max.commissionRate || 100
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch filters',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
