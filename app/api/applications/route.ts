import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/applications
 * Get all applications for the current user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await prisma.programApplication.findMany({
      where: { userId: user.id },
      include: {
        program: {
          include: {
            network: {
              select: {
                name: true,
                website: true,
              },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

/**
 * POST /api/applications
 * Track a new application
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { programId, applicationUrl, notes } = body;

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    // Check if already applied
    const existing = await prisma.programApplication.findUnique({
      where: {
        userId_programId: {
          userId: user.id,
          programId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already tracked an application to this program' },
        { status: 409 }
      );
    }

    // Create application
    const application = await prisma.programApplication.create({
      data: {
        userId: user.id,
        programId,
        applicationUrl,
        notes,
        status: 'pending',
        appliedAt: new Date(),
        statusUpdatedAt: new Date(),
      },
      include: {
        program: {
          include: {
            network: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error('Failed to create application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
