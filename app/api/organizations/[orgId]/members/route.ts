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
      members: members.map(m => ({
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidRole(role)) {
      return NextResponse.json(
        { error: `Invalid role: ${role}` },
        { status: 400 }
      );
    }

    // Check if user can assign this role
    if (!canManageUser(rbacContext, role, orgId).allowed) {
      return OrgAuth.forbidden('You cannot assign users to this role');
    }

    // Check if user already exists as member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: orgId,
        OR: [
          { user: { email } },
          { invitedEmail: email },
        ],
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 409 }
      );
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
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
        data: createAuditLogData(
          'member_added',
          rbacContext,
          user.id,
          { email, role }
        ) as any,
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
      // Create invitation for new user
      const member = await prisma.organizationMember.create({
        data: {
          organizationId: orgId,
          userId: '', // Temporary, will be set when user accepts invitation
          role,
          status: 'pending',
          invitedEmail: email,
          invitedAt: new Date(),
        },
      });

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
          message: `Invitation sent to ${email}. User will need to create an account to join.`,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
