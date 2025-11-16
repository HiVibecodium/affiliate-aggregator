/**
 * API: Verify Invite Token
 * GET /api/invite/verify?token=xxx&member=yyy
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isInviteExpired, getDaysRemaining } from '@/lib/team/invite-tokens';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const memberId = searchParams.get('member');

    if (!token || !memberId) {
      return NextResponse.json(
        { error: 'Missing token or member ID', valid: false },
        { status: 400 }
      );
    }

    // Find invite
    const member = await prisma.organizationMember.findFirst({
      where: {
        id: memberId,
        // inviteToken: token, // TODO: Uncomment after migration
        status: 'pending',
      },
      include: {
        organization: {
          select: { name: true },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Invitation not found or already used', valid: false },
        { status: 404 }
      );
    }

    // Check expiry
    if (!member.invitedAt || isInviteExpired(member.invitedAt)) {
      return NextResponse.json({ error: 'Invitation has expired', valid: false }, { status: 410 });
    }

    // Get inviter info
    const inviter = await prisma.organizationMember.findFirst({
      where: {
        organizationId: member.organizationId,
        role: { in: ['owner', 'admin'] },
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'asc' }, // Get earliest (likely owner)
    });

    return NextResponse.json({
      valid: true,
      organizationName: member.organization.name,
      role: member.role,
      inviterName: inviter?.user.name || inviter?.user.email || 'Team member',
      expiresIn: getDaysRemaining(member.invitedAt),
    });
  } catch (error) {
    console.error('Invite verification error:', error);
    return NextResponse.json({ error: 'Internal server error', valid: false }, { status: 500 });
  }
}
