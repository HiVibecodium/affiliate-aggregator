/**
 * Organization Context Middleware
 * Extracts and validates organization context from requests
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import type { Role } from '@/lib/rbac';

export interface OrganizationContext {
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
  role: Role | null;
  membership: {
    id: string;
    joinedAt: Date;
  } | null;
}

/**
 * Get organization context from request
 * Extracts user, organization, and role information
 */
export async function getOrganizationContext(request: NextRequest): Promise<OrganizationContext> {
  const emptyContext: OrganizationContext = {
    user: null,
    organization: null,
    role: null,
    membership: null,
  };

  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return emptyContext;
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        id: true,
        email: true,
        name: true,
        organizationMembers: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      return emptyContext;
    }

    // Check for org header/param
    const orgSlug =
      request.headers.get('x-organization-slug') || request.nextUrl.searchParams.get('org');

    let membership = dbUser.organizationMembers[0]; // Default to first org

    // If specific org requested, find that membership
    if (orgSlug) {
      const specificMembership = dbUser.organizationMembers.find(
        (m) => m.organization.slug === orgSlug
      );
      if (specificMembership) {
        membership = specificMembership;
      }
    }

    if (!membership) {
      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
        },
        organization: null,
        role: null,
        membership: null,
      };
    }

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
      },
      organization: {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
      },
      role: membership.role as Role,
      membership: {
        id: membership.id,
        joinedAt: membership.createdAt,
      },
    };
  } catch (error) {
    console.error('Error getting organization context:', error);
    return emptyContext;
  }
}

/**
 * Require organization context (throws if not authenticated)
 */
export async function requireOrganizationContext(
  request: NextRequest
): Promise<Required<OrganizationContext>> {
  const context = await getOrganizationContext(request);

  if (!context.user) {
    throw new Error('Authentication required');
  }

  if (!context.organization) {
    throw new Error('Organization not found');
  }

  return context as Required<OrganizationContext>;
}
