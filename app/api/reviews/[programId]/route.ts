import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * GET /api/reviews/[programId]
 * Get all approved reviews for a program
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;

    // Get reviews with user info
    const reviews = await prisma.programReview.findMany({
      where: {
        programId,
        status: 'approved', // Only show approved reviews
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: false, // Don't expose email
          },
        },
      },
      orderBy: [
        { helpfulCount: 'desc' }, // Most helpful first
        { createdAt: 'desc' }, // Then newest
      ],
    });

    // Calculate aggregated rating
    const aggregateRating = await prisma.programReview.aggregate({
      where: {
        programId,
        status: 'approved',
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // Rating distribution
    const ratingDistribution = await prisma.programReview.groupBy({
      by: ['rating'],
      where: {
        programId,
        status: 'approved',
      },
      _count: { rating: true },
    });

    return NextResponse.json({
      reviews,
      stats: {
        averageRating: aggregateRating._avg.rating || 0,
        totalReviews: aggregateRating._count.rating || 0,
        distribution: ratingDistribution.map((d) => ({
          stars: d.rating,
          count: d._count.rating,
        })),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch reviews',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews/[programId]
 * Submit a new review for a program
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params;
    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0],
        },
      });
    }

    // Parse request body
    const body = await request.json();
    const {
      rating,
      title,
      content,
      pros = [],
      cons = [],
      experience,
      monthsUsed,
      earningsRange,
      trafficSource,
    } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (!title || title.trim().length < 5) {
      return NextResponse.json({ error: 'Title must be at least 5 characters' }, { status: 400 });
    }

    if (!content || content.trim().length < 20) {
      return NextResponse.json(
        { error: 'Review content must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this program
    const existingReview = await prisma.programReview.findUnique({
      where: {
        userId_programId: {
          userId: dbUser.id,
          programId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this program' },
        { status: 409 }
      );
    }

    // Create review
    const review = await prisma.programReview.create({
      data: {
        programId,
        userId: dbUser.id,
        rating,
        title: title.trim(),
        content: content.trim(),
        pros: Array.isArray(pros) ? pros.filter((p: string) => p.trim()) : [],
        cons: Array.isArray(cons) ? cons.filter((c: string) => c.trim()) : [],
        experience,
        monthsUsed: monthsUsed ? parseInt(monthsUsed) : null,
        earningsRange,
        trafficSource,
        status: 'approved', // Auto-approve for MVP (add moderation later)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Failed to create review:', error);
    return NextResponse.json(
      {
        error: 'Failed to create review',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
