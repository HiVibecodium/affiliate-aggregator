/**
 * API: Accept Team Invitation
 * POST /api/invite/accept
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isInviteExpired } from '@/lib/team/invite-tokens';

export async function POST(request: NextRequest) {
  try {
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

    // TODO: Get current user from session/auth
    // For now, we'll need to create a user if they don't exist
    const userEmail = member.invitedEmail;

    if (!userEmail) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      // Create new user (they'll need to set password through auth system)
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userEmail.split('@')[0], // Temporary name
        },
      });
    }

    // Update membership
    const updatedMember = await prisma.organizationMember.update({
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
    console.error('Invite acceptance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
