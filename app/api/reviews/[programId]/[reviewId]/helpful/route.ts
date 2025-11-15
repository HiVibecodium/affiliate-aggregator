import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/reviews/[programId]/[reviewId]/helpful
 * Vote on review helpfulness
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ programId: string; reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const supabase = await createClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { helpful } = body; // true = helpful, false = not helpful

    if (typeof helpful !== 'boolean') {
      return NextResponse.json({ error: 'helpful must be a boolean' }, { status: 400 });
    }

    // Check if user already voted
    const existingVote = await prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId: user.id,
        },
      },
    });

    if (existingVote) {
      // Update existing vote
      if (existingVote.helpful !== helpful) {
        await prisma.$transaction([
          // Update vote
          prisma.reviewHelpful.update({
            where: { id: existingVote.id },
            data: { helpful },
          }),
          // Update counters
          prisma.programReview.update({
            where: { id: reviewId },
            data: {
              helpfulCount: existingVote.helpful ? { decrement: 1 } : { increment: 1 },
              notHelpfulCount: existingVote.helpful ? { increment: 1 } : { decrement: 1 },
            },
          }),
        ]);
      }

      return NextResponse.json({ success: true, action: 'updated' });
    }

    // Create new vote
    await prisma.$transaction([
      prisma.reviewHelpful.create({
        data: {
          reviewId,
          userId: user.id,
          helpful,
        },
      }),
      prisma.programReview.update({
        where: { id: reviewId },
        data: {
          [helpful ? 'helpfulCount' : 'notHelpfulCount']: { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({ success: true, action: 'created' }, { status: 201 });
  } catch (error) {
    console.error('Failed to vote on review:', error);
    return NextResponse.json(
      {
        error: 'Failed to vote',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
