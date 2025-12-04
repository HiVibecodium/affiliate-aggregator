/**
 * Individual organization member management endpoints
 * PUT /api/organizations/[orgId]/members/[memberId] - Update member role
 * DELETE /api/organizations/[orgId]/members/[memberId] - Remove member
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrgContext, toRBACContext, OrgAuth } from '@/lib/auth/org-middleware';
import { can, canManageUser, createAuditLogData, Permission, isValidRole } from '@/lib/rbac/utils';

/**
 * PUT /api/organizations/[orgId]/members/[memberId]
 * Update member role or permissions
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; memberId: string }> }
) {
  try {
    const { orgId, memberId } = await params;
    const orgContext = await getOrgContext(request, orgId);

    if (!orgContext) {
      return OrgAuth.unauthorized();
    }

    const rbacContext = toRBACContext(orgContext);

    if (!can(rbacContext, Permission.CHANGE_USER_ROLE)) {
      return OrgAuth.forbidden('You cannot change user roles');
    }

    // Get the member to update
    const targetMember = await prisma.organizationMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!targetMember || targetMember.organizationId !== orgId) {
      return OrgAuth.notFound('Member not found');
    }

    const body = await request.json();
    const { role, permissions } = body;

    if (role && !isValidRole(role)) {
      return NextResponse.json({ error: `Invalid role: ${role}` }, { status: 400 });
    }

    // Check if user can manage target role
    if (role && !canManageUser(rbacContext, role, orgId).allowed) {
      return OrgAuth.forbidden('You cannot assign users to this role');
    }

    // Cannot demote owner
    if (targetMember.role === 'owner' && role && role !== 'owner') {
      return OrgAuth.forbidden('Cannot demote organization owner');
    }

    // Update member
    const updatedMember = await prisma.organizationMember.update({
      where: { id: memberId },
      data: {
        ...(role && { role }),
        ...(permissions && { permissions }),
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
      data: createAuditLogData('member_updated', rbacContext, targetMember.userId, {
        email: targetMember.user.email,
        oldRole: targetMember.role,
        newRole: role,
      }),
    });

    return NextResponse.json({
      member: {
        id: updatedMember.id,
        userId: updatedMember.userId,
        email: updatedMember.user.email,
        name: updatedMember.user.name,
        role: updatedMember.role,
        permissions: updatedMember.permissions,
      },
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/organizations/[orgId]/members/[memberId]
 * Remove member from organization
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; memberId: string }> }
) {
  try {
    const { orgId, memberId } = await params;
    const orgContext = await getOrgContext(request, orgId);

    if (!orgContext) {
      return OrgAuth.unauthorized();
    }

    const rbacContext = toRBACContext(orgContext);

    if (!can(rbacContext, Permission.REMOVE_USERS)) {
      return OrgAuth.forbidden('You cannot remove users from this organization');
    }

    // Get the member to delete
    const targetMember = await prisma.organizationMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!targetMember || targetMember.organizationId !== orgId) {
      return OrgAuth.notFound('Member not found');
    }

    // Cannot remove owner (except self)
    if (targetMember.role === 'owner' && targetMember.userId !== orgContext.userId) {
      return OrgAuth.forbidden('Cannot remove organization owner');
    }

    // Check if user can manage this member
    if (!canManageUser(rbacContext, targetMember.role, orgId).allowed) {
      return OrgAuth.forbidden('You cannot remove users with equal or higher roles');
    }

    // Delete member
    await prisma.organizationMember.delete({
      where: { id: memberId },
    });

    // Log audit entry
    await prisma.auditLog.create({
      data: createAuditLogData('member_removed', rbacContext, targetMember.userId, {
        email: targetMember.user.email,
        role: targetMember.role,
      }),
    });

    return NextResponse.json({
      message: `Member ${targetMember.user.email} has been removed from the organization`,
    });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
