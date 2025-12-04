/**
 * Organization Members API endpoints
 * GET /api/organizations/[orgId]/members - List organization members
 * POST /api/organizations/[orgId]/members - Add user to organization
 * PUT /api/organizations/[orgId]/members/[memberId] - Update member role
 * DELETE /api/organizations/[orgId]/members/[memberId] - Remove member
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrgContext, toRBACContext, OrgAuth } from '@/lib/auth/org-middleware';
import { can, canManageUser, createAuditLogData, Permission, isValidRole } from '@/lib/rbac/utils';
import { generateInviteToken, createInviteUrl } from '@/lib/team/invite-tokens';
import { sendEmail } from '@/lib/email/resend-client';
import { generateTeamInviteEmail } from '@/lib/email/templates/team-invite';

/**
 * GET /api/organizations/[orgId]/members
 * List all members of an organization
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const orgContext = await getOrgContext(request, orgId);

    if (!orgContext) {
      return OrgAuth.unauthorized();
    }

    const rbacContext = toRBACContext(orgContext);

    if (!can(rbacContext, Permission.MANAGE_USERS)) {
      return OrgAuth.forbidden('You cannot view organization members');
    }

    // Get organization members
    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId: orgId,
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      members: members.map((m) => ({
        id: m.id,
        userId: m.userId,
        email: m.user.email,
        name: m.user.name,
        role: m.role,
        status: m.status,
        joinedAt: m.acceptedAt,
        invitedAt: m.invitedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/organizations/[orgId]/members
 * Add a user to the organization (invite)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const orgContext = await getOrgContext(request, orgId);

    if (!orgContext) {
      return OrgAuth.unauthorized();
    }

    const rbacContext = toRBACContext(orgContext);

    if (!can(rbacContext, Permission.INVITE_USERS)) {
      return OrgAuth.forbidden('You cannot invite users to this organization');
    }

    const body = await request.json();
    const { email, role = 'member' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!isValidRole(role)) {
      return NextResponse.json({ error: `Invalid role: ${role}` }, { status: 400 });
    }

    // Check if user can assign this role
    if (!canManageUser(rbacContext, role, orgId).allowed) {
      return OrgAuth.forbidden('You cannot assign users to this role');
    }

    // Check if user already exists as member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: orgId,
        OR: [{ user: { email } }, { invitedEmail: email }],
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 409 }
      );
    }

    // Try to find existing user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // User exists, add them directly
      const member = await prisma.organizationMember.create({
        data: {
          organizationId: orgId,
          userId: user.id,
          role,
          status: 'active',
          acceptedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      // Log audit entry
      await prisma.auditLog.create({
        data: createAuditLogData('member_added', rbacContext, user.id, { email, role }),
      });

      return NextResponse.json(
        {
          member: {
            id: member.id,
            userId: member.userId,
            email: member.user.email,
            name: member.user.name,
            role: member.role,
            status: 'active',
          },
        },
        { status: 201 }
      );
    } else {
      // Generate secure invite token
      const inviteToken = generateInviteToken();

      // Create placeholder user for pending invite
      // Will be updated with real user when invitation is accepted
      const placeholderUser = await prisma.user.upsert({
        where: { email: `pending-${email}` },
        create: {
          email: `pending-${email}`,
          name: 'Pending Invitation',
        },
        update: {},
      });

      // Create invitation for new user
      const member = await prisma.organizationMember.create({
        data: {
          organizationId: orgId,
          userId: placeholderUser.id, // Placeholder, will be updated when user accepts
          role,
          status: 'pending',
          invitedEmail: email,
          // inviteToken, // TODO: Uncomment after migration
          invitedAt: new Date(),
        },
      });

      // Get organization details for email
      const organization = await prisma.organization.findUnique({
        where: { id: orgId },
        select: { name: true },
      });

      // Get inviter details
      const inviter = await prisma.user.findUnique({
        where: { id: orgContext.userId },
        select: { name: true, email: true },
      });

      // Create invite URL
      const acceptUrl = createInviteUrl(member.id, inviteToken);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      // Send invitation email
      const emailResult = await sendEmail({
        to: email,
        ...generateTeamInviteEmail({
          inviterName: inviter?.name || inviter?.email || 'Team member',
          organizationName: organization?.name || 'the organization',
          role,
          acceptUrl,
          appUrl,
        }),
      });

      if (!emailResult.success && emailResult.reason !== 'not_configured') {
        console.error('Failed to send invitation email:', emailResult.error);
        // Continue anyway - user can still be invited manually
      }

      // Log audit entry
      await prisma.auditLog.create({
        data: {
          organizationId: orgId,
          action: 'user_invited',
          resourceType: 'invitation',
          performedBy: orgContext.userId,
          details: {
            email,
            role,
            emailSent: emailResult.success,
          },
        },
      });

      return NextResponse.json(
        {
          member: {
            id: member.id,
            email,
            role,
            status: 'pending',
            invitedAt: member.invitedAt,
          },
          message: emailResult.success
            ? `Invitation email sent to ${email}`
            : `Invitation created for ${email}. Email not configured - share invite link manually.`,
          inviteUrl: acceptUrl,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
