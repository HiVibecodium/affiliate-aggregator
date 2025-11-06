/**
 * Test helper utilities for unit and integration tests
 */

import { RBACContext } from '@/lib/rbac/utils';
import { OrgContext } from '@/lib/auth/org-middleware';

/**
 * Create mock RBAC context for testing
 */
export function createMockRBACContext(overrides?: Partial<RBACContext>): RBACContext {
  return {
    userId: 'test-user-id',
    organizationId: 'test-org-id',
    role: 'member',
    permissions: [],
    ...overrides,
  };
}

/**
 * Create mock organization context for testing
 */
export function createMockOrgContext(overrides?: Partial<OrgContext>): OrgContext {
  return {
    userId: 'test-user-id',
    organizationId: 'test-org-id',
    organizationSlug: 'test-org',
    role: 'member',
    permissions: [],
    member: {
      id: 'test-member-id',
      organizationId: 'test-org-id',
      userId: 'test-user-id',
      role: 'member',
      permissions: [],
    },
    ...overrides,
  };
}

/**
 * Create mock roles for testing all role types
 */
export const MOCK_ROLES = {
  owner: createMockRBACContext({ role: 'owner' }),
  admin: createMockRBACContext({ role: 'admin' }),
  manager: createMockRBACContext({ role: 'manager' }),
  member: createMockRBACContext({ role: 'member' }),
  viewer: createMockRBACContext({ role: 'viewer' }),
};

/**
 * Sleep utility for async tests
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a NextRequest mock for testing API routes
 */
export function createMockNextRequest(
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    url?: string;
  }
) {
  const url = options?.url || 'http://localhost:3000/api/test';

  return {
    method: options?.method || 'GET',
    url: new URL(url),
    headers: new Map(Object.entries(options?.headers || {})),
    nextUrl: new URL(url),
    json: async () => options?.body || {},
    text: async () => JSON.stringify(options?.body || {}),
  } as any;
}

/**
 * Test data factories for common entities
 */
export const testDataFactories = {
  user: (overrides?: any) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  organization: (overrides?: any) => ({
    id: 'test-org-id',
    name: 'Test Organization',
    slug: 'test-org',
    description: 'Test organization description',
    logo: null,
    website: null,
    tier: 'free',
    subscriptionStatus: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  }),

  organizationMember: (overrides?: any) => ({
    id: 'test-member-id',
    organizationId: 'test-org-id',
    userId: 'test-user-id',
    role: 'member',
    permissions: [],
    status: 'active',
    invitedAt: null,
    acceptedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  affiliateNetwork: (overrides?: any) => ({
    id: 'test-network-id',
    name: 'Test Network',
    description: 'Test network description',
    website: 'https://testnetwork.com',
    country: 'US',
    commission: 5.0,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  affiliateProgram: (overrides?: any) => ({
    id: 'test-program-id',
    networkId: 'test-network-id',
    externalId: 'ext-program-123',
    name: 'Test Program',
    description: 'Test program description',
    category: 'Technology',
    commissionRate: 10.0,
    commissionType: 'CPA',
    cookieDuration: 30,
    paymentThreshold: 100.0,
    paymentMethods: ['bank_transfer', 'paypal'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  auditLog: (overrides?: any) => ({
    id: 'test-log-id',
    organizationId: 'test-org-id',
    action: 'test_action',
    resourceType: 'user',
    resourceId: 'test-user-id',
    performedBy: 'test-user-id',
    details: {},
    createdAt: new Date(),
    ...overrides,
  }),
};

/**
 * Assertion helpers
 */
export const assertions = {
  /**
   * Assert RBAC context has expected properties
   */
  assertRBACContext: (context: RBACContext, expected: Partial<RBACContext>) => {
    Object.entries(expected).forEach(([key, value]) => {
      expect(context[key as keyof RBACContext]).toBe(value);
    });
  },

  /**
   * Assert organization context has expected properties
   */
  assertOrgContext: (context: OrgContext, expected: Partial<OrgContext>) => {
    Object.entries(expected).forEach(([key, value]) => {
      expect(context[key as keyof OrgContext]).toEqual(value);
    });
  },

  /**
   * Assert permission result allowed status
   */
  assertPermissionResult: (result: any, allowed: boolean) => {
    expect(result.allowed).toBe(allowed);
    if (!allowed) {
      expect(result.reason).toBeDefined();
    }
  },
};
