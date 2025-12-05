/**
 * Admin Programs API
 * List and manage programs with pagination and filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const active = searchParams.get('active');

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (active !== null && active !== undefined && active !== '') {
      where.active = active === 'true';
    }

    const [programs, total] = await Promise.all([
      prisma.affiliateProgram.findMany({
        where,
        select: {
          id: true,
          name: true,
          category: true,
          commissionRate: true,
          active: true,
          createdAt: true,
          network: {
            select: { name: true },
          },
          _count: {
            select: {
              favoredBy: true,
              reviews: true,
              clicks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.affiliateProgram.count({ where }),
    ]);

    return NextResponse.json({
      programs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin programs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}
