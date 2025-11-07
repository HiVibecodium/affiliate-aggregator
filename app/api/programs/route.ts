import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const network = searchParams.get('network');

    const skip = (page - 1) * limit;

    const where = network ? { network: { name: network } } : {};

    const [programs, total] = await Promise.all([
      prisma.affiliateProgram.findMany({
        where,
        include: {
          network: {
            select: {
              name: true,
              website: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.affiliateProgram.count({ where })
    ]);

    return NextResponse.json({
      programs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch programs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
