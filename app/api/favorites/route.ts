import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@/lib/supabase/server';
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit';

const prisma = new PrismaClient();

/**
 * GET /api/favorites
 * Get all favorite programs for the current user
 */
async function getFavoritesHandler(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!.split('@')[0]
        }
      });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: dbUser.id },
      include: {
        program: {
          include: {
            network: {
              select: {
                name: true,
                website: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      favorites: favorites.map(fav => ({
        id: fav.id,
        programId: fav.programId,
        createdAt: fav.createdAt,
        program: fav.program
      }))
    });
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch favorites',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Add a program to favorites
 */
async function postFavoriteHandler(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { programId } = body;

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Get or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email!.split('@')[0]
        }
      });
    }

    // Check if program exists
    const program = await prisma.affiliateProgram.findUnique({
      where: { id: programId }
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_programId: {
          userId: dbUser.id,
          programId: programId
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Program already in favorites' },
        { status: 409 }
      );
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: dbUser.id,
        programId: programId
      },
      include: {
        program: {
          include: {
            network: {
              select: {
                name: true,
                website: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      favorite: {
        id: favorite.id,
        programId: favorite.programId,
        createdAt: favorite.createdAt,
        program: favorite.program
      }
    });
  } catch (error) {
    console.error('Failed to add favorite:', error);
    return NextResponse.json(
      {
        error: 'Failed to add favorite',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites
 * Remove a program from favorites by programId
 */
async function deleteFavoriteHandler(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        userId_programId: {
          userId: dbUser.id,
          programId: programId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Favorite removed successfully'
    });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return NextResponse.json(
      {
        error: 'Failed to remove favorite',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Apply rate limiting
export const GET = withRateLimit(getFavoritesHandler, RateLimitPresets.standard);
export const POST = withRateLimit(postFavoriteHandler, RateLimitPresets.standard);
export const DELETE = withRateLimit(deleteFavoriteHandler, RateLimitPresets.standard);
