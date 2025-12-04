import { logger } from '@/lib/logger';
/**
 * Organization API - Individual organization operations
 * GET /api/organizations/[orgId] - Get organization details
 * PUT /api/organizations/[orgId] - Update organization
 * DELETE /api/organizations/[orgId] - Delete organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrgContext, toRBACContext, OrgAuth } from '@/lib/auth/org-middleware';
import { can, Permission } from '@/lib/rbac/utils';

/**
 * GET /api/organizations/[orgId]
 * Get organization details
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

    // Get organization with member count
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        _count: {
          select: {
            members: {
              where: { status: 'active' },
            },
          },
        },
      },
    });

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      website: organization.website,
      logo: organization.logo,
      tier: organization.tier,
      subscriptionStatus: organization.subscriptionStatus,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      memberCount: organization._count.members,
    });
  } catch (error) {
    logger.error('Error fetching organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/organizations/[orgId]
 * Update organization settings
 */
export async function PUT(
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

    // Only owners/admins can update organization
    if (!can(rbacContext, Permission.MANAGE_BILLING)) {
      return OrgAuth.forbidden('Only owners and admins can update organization settings');
    }

    const body = await request.json();
    const { name, slug, description, website } = body;

    // Validate slug format if provided
    if (slug && !/^[a-z0-9_-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Invalid slug format. Use lowercase letters, numbers, hyphens, or underscores.' },
        { status: 400 }
      );
    }

    // Update organization
    const organization = await prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(website !== undefined && { website }),
      },
    });

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        organizationId: orgId,
        action: 'organization_updated',
        resourceType: 'organization',
        resourceId: orgId,
        performedBy: orgContext.userId,
        details: {
          changes: { name, slug, description, website },
        },
      },
    });

    return NextResponse.json({
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        website: organization.website,
      },
    });
  } catch (error: unknown) {
    logger.error('Error updating organization:', error);

    // Handle unique constraint error (slug)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Slug already exists. Please choose a different one.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/organizations/[orgId]
 * Delete organization (owner only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const orgContext = await getOrgContext(request, orgId);

    if (!orgContext) {
      return OrgAuth.unauthorized();
    }

    // Only owner can delete organization
    if (orgContext.role !== 'owner') {
      return OrgAuth.forbidden('Only the owner can delete the organization');
    }

    // Delete organization (cascade will handle related records)
    await prisma.organization.delete({
      where: { id: orgId },
    });

    // Note: Audit log will be cascade deleted
    // Could log to separate system-wide audit table if needed

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
