import { logger } from '@/lib/logger';
/**
 * API: Decline Team Invitation
 * POST /api/invite/decline
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, memberId } = body;

    if (!token || !memberId) {
      return NextResponse.json({ error: 'Missing token or member ID' }, { status: 400 });
    }

    // Find and delete invite
    const member = await prisma.organizationMember.findFirst({
      where: {
        id: memberId,
        // inviteToken: token, // TODO: Uncomment after migration
        status: 'pending',
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Delete the pending invite
    await prisma.organizationMember.delete({
      where: { id: memberId },
    });

    // Log decline
    await prisma.auditLog.create({
      data: {
        organizationId: member.organizationId,
        action: 'invite_declined',
        resourceType: 'invitation',
        performedBy: 'system',
        details: {
          email: member.invitedEmail,
          role: member.role,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation declined',
    });
  } catch (error) {
    logger.error('Invite decline error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
