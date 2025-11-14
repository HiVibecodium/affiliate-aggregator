import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit';

/**
 * POST /api/auth/sync
 * Synchronizes Supabase user with Prisma database
 * Creates User record and default Organization on first signup
 */
async function syncHandler(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Check if user already exists in Prisma
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });

    // Create user if doesn't exist
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        },
        include: {
          organizationMembers: {
            include: {
              organization: true,
            },
          },
        },
      });
    }

    // Check if user has any organization
    if (dbUser.organizationMembers.length === 0) {
      // Create default organization for new user
      const orgName = `${dbUser.name}'s Organization`;
      const orgSlug = `${user.id.substring(0, 8)}-org`;

      const organization = await prisma.organization.create({
        data: {
          name: orgName,
          slug: orgSlug,
          tier: 'free',
          subscriptionStatus: 'active',
          members: {
            create: {
              userId: user.id,
              role: 'owner',
              permissions: ['*'], // Owner has all permissions
              status: 'active',
            },
          },
        },
      });

      // Refetch user with new organization
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          organizationMembers: {
            include: {
              organization: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser!.id,
        email: dbUser!.email,
        name: dbUser!.name,
      },
      organizations: dbUser!.organizationMembers.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        role: m.role,
        tier: m.organization.tier,
      })),
    });
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Apply strict rate limiting for auth endpoints (5 req/min)
export const POST = withRateLimit(syncHandler, RateLimitPresets.strict);
