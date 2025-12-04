import { logger } from '@/lib/logger';
/**
 * API: Accept Team Invitation
 * POST /api/invite/accept
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isInviteExpired } from '@/lib/team/invite-tokens';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized - Please login first' }, { status: 401 });
    }

    const body = await request.json();
    const { token, memberId } = body;

    if (!token || !memberId) {
      return NextResponse.json({ error: 'Missing token or member ID' }, { status: 400 });
    }

    // Find invite
    const member = await prisma.organizationMember.findFirst({
      where: {
        id: memberId,
        // inviteToken: token, // TODO: Uncomment after migration
        status: 'pending',
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Invitation not found or already used' }, { status: 404 });
    }

    // Check expiry
    if (!member.invitedAt || isInviteExpired(member.invitedAt)) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    // Verify that invited email matches authenticated user
    const userEmail = authUser.email;
    if (!userEmail || userEmail !== member.invitedEmail) {
      return NextResponse.json(
        { error: 'This invitation was sent to a different email address' },
        { status: 403 }
      );
    }

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      // Create new user with data from Supabase auth
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: authUser.user_metadata?.full_name || userEmail.split('@')[0],
        },
      });
    }

    // Update membership
    await prisma.organizationMember.update({
      where: { id: memberId },
      data: {
        userId: user.id,
        status: 'active',
        acceptedAt: new Date(),
        // inviteToken: null, // TODO: Uncomment after migration
      },
    });

    // Log acceptance
    await prisma.auditLog.create({
      data: {
        organizationId: member.organizationId,
        action: 'invite_accepted',
        resourceType: 'membership',
        performedBy: user.id,
        details: {
          memberId: member.id,
          role: member.role,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation accepted successfully',
      organizationId: member.organizationId,
    });
  } catch (error) {
    logger.error('Invite acceptance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
