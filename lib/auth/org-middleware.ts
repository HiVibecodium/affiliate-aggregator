/**
 * Organization context middleware for Next.js API routes
 * Extracts organization context from request and validates user access
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { RBACContext, createRBACContext } from '@/lib/rbac/utils';

// Re-export for convenience
export { createRBACContext };

export interface OrgContextRequest extends NextRequest {
  orgContext?: OrgContext;
}

export interface OrgContext {
  userId: string;
  organizationId: string;
  organizationSlug?: string;
  role: string;
  permissions: string[];
  member: {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    permissions: string[];
  };
}

/**
 * Get or create organization context from request
 * Validates user is authenticated and has access to organization
 */
export async function getOrgContext(
  request: NextRequest,
  orgId?: string | null
): Promise<OrgContext | null> {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Silently fail during middleware
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Get organization ID from various sources
    const organizationId = orgId ||
      request.nextUrl.searchParams.get('org') ||
      request.headers.get('x-organization-id');

    if (!organizationId) {
      return null;
    }

    // Get user's database record
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // Create user record if doesn't exist
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0],
        },
      });
    }

    // Get organization membership
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
    });

    if (!membership || membership.status !== 'active') {
      return null;
    }

    // Get organization details
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || organization.deletedAt) {
      return null;
    }

    return {
      userId: user.id,
      organizationId,
      organizationSlug: organization.slug,
      role: membership.role,
      permissions: membership.permissions,
      member: {
        id: membership.id,
        organizationId: membership.organizationId,
        userId: membership.userId,
        role: membership.role,
        permissions: membership.permissions,
      },
    };
  } catch (error) {
    console.error('Error getting organization context:', error);
    return null;
  }
}

/**
 * Middleware to validate organization context for API routes
 */
export async function withOrgContext(
  handler: (
    request: NextRequest,
    context: OrgContext,
    params?: Record<string, string>
  ) => Promise<Response>,
  options?: {
    optional?: boolean;
  }
) {
  return async (
    request: NextRequest,
    { params }: { params: Record<string, string> }
  ): Promise<Response> => {
    const orgContext = await getOrgContext(request);

    if (!orgContext && !options?.optional) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Organization context not found or user does not have access',
        },
        { status: 401 }
      );
    }

    if (orgContext) {
      return handler(request, orgContext, params);
    }

    return handler(request, {} as OrgContext, params);
  };
}

/**
 * Create RBAC context from organization context
 */
export function toRBACContext(orgContext: OrgContext): RBACContext {
  return createRBACContext(
    orgContext.userId,
    orgContext.organizationId,
    orgContext.role,
    orgContext.permissions
  );
}

/**
 * Get user's organizations with membership details
 */
export async function getUserOrganizations(
  userId: string
): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
    tier: string;
  }>
> {
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId,
      status: 'active',
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          tier: true,
        },
      },
    },
  });

  return memberships.map(m => ({
    id: m.organization.id,
    name: m.organization.name,
    slug: m.organization.slug,
    role: m.role,
    tier: m.organization.tier,
  }));
}

/**
 * Get user's current organization (most recent or first)
 */
export async function getUserCurrentOrganization(
  userId: string
): Promise<{ id: string; name: string; slug: string } | null> {
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      status: 'active',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!membership) return null;

  // Explicitly return only the required fields to prevent leaking extra fields
  const { id, name, slug } = membership.organization;
  return { id, name, slug };
}

/**
 * Switch user's current organization context
 * Used for organization switcher in UI
 */
export async function switchOrganization(
  userId: string,
  organizationId: string
): Promise<{ success: boolean; organization?: { id: string; name: string } }> {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!membership || membership.status !== 'active') {
    return { success: false };
  }

  return {
    success: true,
    organization: membership.organization,
  };
}

/**
 * Validate user has permission in specific organization
 */
export async function validateUserPermission(
  userId: string,
  organizationId: string,
  permission: string
): Promise<boolean> {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  });

  if (!membership || membership.status !== 'active') {
    return false;
  }

  // Check explicit permissions
  if (membership.permissions.includes(permission)) {
    return true;
  }

  // Check role-based permissions
  const rolePermissions = require('@/lib/rbac/permissions').getRolePermissions(membership.role);
  return rolePermissions.includes(permission);
}

/**
 * Middleware response creators for common authorization patterns
 */
export const OrgAuth = {
  unauthorized: (message = 'Unauthorized access to organization') =>
    NextResponse.json({ error: message }, { status: 401 }),

  forbidden: (message = 'You do not have permission to perform this action') =>
    NextResponse.json({ error: message }, { status: 403 }),

  notFound: (message = 'Organization not found') =>
    NextResponse.json({ error: message }, { status: 404 }),
};
