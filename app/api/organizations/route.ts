/**
 * Organization API endpoints
 * GET /api/organizations - List user's organizations
 * POST /api/organizations - Create new organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/organizations
 * List all organizations for the authenticated user
 */
export async function GET() {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organizations
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId: user.id,
        status: 'active',
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            logo: true,
            tier: true,
            subscriptionStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      organizations: memberships.map((m) => ({
        ...m.organization,
        role: m.role,
        joinedAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/organizations
 * Create a new organization
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { name, slug, description } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing required fields: name, slug' }, { status: 400 });
    }

    // Validate slug format (alphanumeric, hyphens, underscores)
    if (!/^[a-z0-9_-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use lowercase letters, numbers, hyphens, or underscores.' },
        { status: 400 }
      );
    }

    // Ensure user record exists
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

    // Create organization and add user as owner
    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        description,
        tier: 'free',
        subscriptionStatus: 'active',
        members: {
          create: {
            userId: user.id,
            role: 'owner',
            status: 'active',
            acceptedAt: new Date(),
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        organizationId: organization.id,
        action: 'organization_created',
        resourceType: 'organization',
        resourceId: organization.id,
        performedBy: user.id,
        details: {
          name,
          slug,
        },
      },
    });

    return NextResponse.json(
      {
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          description: organization.description,
          tier: organization.tier,
          createdAt: organization.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating organization:', error);

    // Handle unique constraint error (Prisma error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug already exists. Please choose a different one.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
