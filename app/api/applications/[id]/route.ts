import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/applications/[id]
 * Update application status or details
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const application = await prisma.programApplication.findUnique({
      where: { id },
    });

    if (!application || application.userId !== user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    // Parse updates
    const body = await request.json();
    const { status, notes, affiliateId, reminderDate, totalEarnings, totalClicks, totalSales } =
      body;

    // Update application
    const updated = await prisma.programApplication.update({
      where: { id },
      data: {
        ...(status && { status, statusUpdatedAt: new Date() }),
        ...(notes !== undefined && { notes }),
        ...(affiliateId !== undefined && { affiliateId }),
        ...(reminderDate !== undefined && {
          reminderDate: reminderDate ? new Date(reminderDate) : null,
        }),
        ...(totalEarnings !== undefined && { totalEarnings }),
        ...(totalClicks !== undefined && { totalClicks }),
        ...(totalSales !== undefined && { totalSales }),
        lastChecked: new Date(),
      },
      include: {
        program: {
          include: {
            network: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

/**
 * DELETE /api/applications/[id]
 * Delete application tracking
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check ownership
    const application = await prisma.programApplication.findUnique({
      where: { id },
    });

    if (!application || application.userId !== user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await prisma.programApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete application:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
