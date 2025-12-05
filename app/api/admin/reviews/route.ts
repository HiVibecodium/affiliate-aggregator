/**
 * Admin Reviews API
 * List and moderate reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const verified = searchParams.get('verified');

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (verified !== null && verified !== undefined && verified !== '') {
      where.isVerified = verified === 'true';
    }

    const [reviews, total] = await Promise.all([
      prisma.programReview.findMany({
        where,
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          isVerified: true,
          helpfulCount: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
          program: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.programReview.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin reviews API error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
