/**
 * Unit tests for Organization middleware functions
 */

import {
  createRBACContext,
  toRBACContext,
  getUserOrganizations,
  getUserCurrentOrganization,
  switchOrganization,
  validateUserPermission,
} from '@/lib/auth/org-middleware';
import { testDataFactories, createMockOrgContext } from '../helpers';
import { Permission } from '@/lib/rbac/utils';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    organizationMember: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('Organization Middleware', () => {
  let prismaMock;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = require('@/lib/prisma').prisma;
  });

  describe('toRBACContext()', () => {
    it('should convert OrgContext to RBACContext', () => {
      const orgContext = createMockOrgContext({
        role: 'admin',
        permissions: [Permission.MANAGE_USERS],
      });

      const rbacContext = toRBACContext(orgContext);

      expect(rbacContext.userId).toBe('test-user-id');
      expect(rbacContext.organizationId).toBe('test-org-id');
      expect(rbacContext.role).toBe('admin');
      expect(rbacContext.permissions).toContain(Permission.MANAGE_USERS);
    });

    it('should preserve all context properties', () => {
      const orgContext = createMockOrgContext({
        userId: 'user-abc',
        organizationId: 'org-xyz',
        role: 'owner',
        permissions: [],
      });

      const rbacContext = toRBACContext(orgContext);

      expect(rbacContext.userId).toBe('user-abc');
      expect(rbacContext.organizationId).toBe('org-xyz');
      expect(rbacContext.role).toBe('owner');
    });
  });

  describe('getUserOrganizations()', () => {
    it('should return all user organizations', async () => {
      const mockMemberships = [
        {
          organization: testDataFactories.organization({ name: 'Org 1', slug: 'org-1' }),
          role: 'owner',
        },
        {
          organization: testDataFactories.organization({ name: 'Org 2', slug: 'org-2' }),
          role: 'member',
        },
      ];

      prismaMock.organizationMember.findMany.mockResolvedValue(mockMemberships);

      const organizations = await getUserOrganizations('user-123');

      expect(organizations).toHaveLength(2);
      expect(organizations[0].name).toBe('Org 1');
      expect(organizations[0].role).toBe('owner');
      expect(organizations[1].name).toBe('Org 2');
      expect(organizations[1].role).toBe('member');
    });

    it('should filter only active memberships', async () => {
      prismaMock.organizationMember.findMany.mockImplementation((config) => {
        expect(config.where.status).toBe('active');
        return Promise.resolve([]);
      });

      await getUserOrganizations('user-123');

      expect(prismaMock.organizationMember.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'active',
          }),
        })
      );
    });

    it('should return empty array for user with no organizations', async () => {
      prismaMock.organizationMember.findMany.mockResolvedValue([]);

      const organizations = await getUserOrganizations('user-123');

      expect(organizations).toHaveLength(0);
    });

    it('should include organization tier information', async () => {
      const mockMemberships = [
        {
          organization: testDataFactories.organization({
            tier: 'pro',
          }),
          role: 'owner',
        },
      ];

      prismaMock.organizationMember.findMany.mockResolvedValue(mockMemberships);

      const organizations = await getUserOrganizations('user-123');

      expect(organizations[0].tier).toBe('pro');
    });
  });

  describe('getUserCurrentOrganization()', () => {
    it('should return most recent active organization', async () => {
      const mockOrganization = testDataFactories.organization({ name: 'Current Org' });
      const mockMembership = {
        organization: mockOrganization,
      };

      prismaMock.organizationMember.findFirst.mockResolvedValue(mockMembership);

      const org = await getUserCurrentOrganization('user-123');

      expect(org?.name).toBe('Current Org');
    });

    it('should filter only active memberships', async () => {
      prismaMock.organizationMember.findFirst.mockImplementation((config) => {
        expect(config.where.status).toBe('active');
        return Promise.resolve(null);
      });

      await getUserCurrentOrganization('user-123');

      expect(prismaMock.organizationMember.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'active',
          }),
        })
      );
    });

    it('should order by creation date descending', async () => {
      prismaMock.organizationMember.findFirst.mockImplementation((config) => {
        expect(config.orderBy).toEqual({ createdAt: 'desc' });
        return Promise.resolve(null);
      });

      await getUserCurrentOrganization('user-123');

      expect(prismaMock.organizationMember.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      );
    });

    it('should return null for user with no organizations', async () => {
      prismaMock.organizationMember.findFirst.mockResolvedValue(null);

      const org = await getUserCurrentOrganization('user-123');

      expect(org).toBeNull();
    });

    it('should return only required organization fields', async () => {
      const mockOrganization = {
        id: 'org-123',
        name: 'Test Org',
        slug: 'test-org',
        extraField: 'should not be here',
      };

      prismaMock.organizationMember.findFirst.mockResolvedValue({
        organization: mockOrganization,
      });

      const org = await getUserCurrentOrganization('user-123');

      expect(org?.id).toBe('org-123');
      expect(org?.name).toBe('Test Org');
      expect(org?.slug).toBe('test-org');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((org as any)?.extraField).toBeUndefined();
    });
  });

  describe('switchOrganization()', () => {
    it('should return success for active membership', async () => {
      const mockOrganization = testDataFactories.organization({ name: 'Target Org' });
      const mockMembership = {
        status: 'active',
        organization: mockOrganization,
      };

      prismaMock.organizationMember.findUnique.mockResolvedValue(mockMembership);

      const result = await switchOrganization('user-123', 'org-456');

      expect(result.success).toBe(true);
      expect(result.organization?.name).toBe('Target Org');
    });

    it('should return failure for inactive membership', async () => {
      const mockMembership = {
        status: 'pending',
        organization: testDataFactories.organization(),
      };

      prismaMock.organizationMember.findUnique.mockResolvedValue(mockMembership);

      const result = await switchOrganization('user-123', 'org-456');

      expect(result.success).toBe(false);
      expect(result.organization).toBeUndefined();
    });

    it('should return failure for non-existent membership', async () => {
      prismaMock.organizationMember.findUnique.mockResolvedValue(null);

      const result = await switchOrganization('user-123', 'org-456');

      expect(result.success).toBe(false);
    });

    it('should query with correct composite key', async () => {
      prismaMock.organizationMember.findUnique.mockResolvedValue(null);

      await switchOrganization('user-123', 'org-456');

      expect(prismaMock.organizationMember.findUnique).toHaveBeenCalledWith({
        where: {
          organizationId_userId: {
            organizationId: 'org-456',
            userId: 'user-123',
          },
        },
        include: expect.any(Object),
      });
    });
  });

  describe('validateUserPermission()', () => {
    it('should return true for explicit permission', async () => {
      const mockMembership = testDataFactories.organizationMember({
        status: 'active',
        permissions: [Permission.MANAGE_USERS],
      });

      prismaMock.organizationMember.findUnique.mockResolvedValue(mockMembership);

      const result = await validateUserPermission('user-123', 'org-456', Permission.MANAGE_USERS);

      expect(result).toBe(true);
    });

    it('should return true for role-based permission', async () => {
      const mockMembership = testDataFactories.organizationMember({
        status: 'active',
        role: 'owner',
        permissions: [],
      });

      prismaMock.organizationMember.findUnique.mockResolvedValue(mockMembership);

      const result = await validateUserPermission('user-123', 'org-456', Permission.MANAGE_USERS);

      expect(result).toBe(true);
    });

    it('should return false for missing permission', async () => {
      const mockMembership = testDataFactories.organizationMember({
        status: 'active',
        role: 'viewer',
        permissions: [],
      });

      prismaMock.organizationMember.findUnique.mockResolvedValue(mockMembership);

      const result = await validateUserPermission('user-123', 'org-456', Permission.MANAGE_USERS);

      expect(result).toBe(false);
    });

    it('should return false for inactive membership', async () => {
      const mockMembership = testDataFactories.organizationMember({
        status: 'pending',
      });

      prismaMock.organizationMember.findUnique.mockResolvedValue(mockMembership);

      const result = await validateUserPermission('user-123', 'org-456', Permission.MANAGE_USERS);

      expect(result).toBe(false);
    });

    it('should return false for non-existent membership', async () => {
      prismaMock.organizationMember.findUnique.mockResolvedValue(null);

      const result = await validateUserPermission('user-123', 'org-456', Permission.MANAGE_USERS);

      expect(result).toBe(false);
    });

    it('should check explicit permissions first', async () => {
      const mockMembership = testDataFactories.organizationMember({
        status: 'active',
        role: 'viewer', // doesn't have permission via role
        permissions: [Permission.EXPORT_DATA], // has it explicitly
      });

      prismaMock.organizationMember.findUnique.mockResolvedValue(mockMembership);

      const result = await validateUserPermission('user-123', 'org-456', Permission.EXPORT_DATA);

      expect(result).toBe(true);
    });
  });

  describe('Org context creation helpers', () => {
    it('should validate createRBACContext helper', () => {
      const context = createRBACContext('user-123', 'org-456', 'admin', [Permission.MANAGE_USERS]);

      expect(context.userId).toBe('user-123');
      expect(context.organizationId).toBe('org-456');
      expect(context.role).toBe('admin');
      expect(context.permissions).toContain(Permission.MANAGE_USERS);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle multi-organization user flow', async () => {
      const mockMemberships = [
        {
          organization: testDataFactories.organization({
            id: 'org-1',
            name: 'First Org',
          }),
          role: 'owner',
        },
        {
          organization: testDataFactories.organization({
            id: 'org-2',
            name: 'Second Org',
          }),
          role: 'member',
        },
      ];

      prismaMock.organizationMember.findMany.mockResolvedValue(mockMemberships);

      const orgs = await getUserOrganizations('user-123');

      expect(orgs).toHaveLength(2);
      expect(orgs[0].role).toBe('owner');
      expect(orgs[1].role).toBe('member');
    });

    it('should validate permission in correct organization', async () => {
      const mockMembership = testDataFactories.organizationMember({
        organizationId: 'org-123',
        userId: 'user-456',
        role: 'admin',
        status: 'active',
      });

      prismaMock.organizationMember.findUnique.mockImplementation((config) => {
        const where = config.where.organizationId_userId;
        expect(where.organizationId).toBe('org-123');
        expect(where.userId).toBe('user-456');
        return Promise.resolve(mockMembership);
      });

      const result = await validateUserPermission(
        'user-456',
        'org-123',
        Permission.MANAGE_PROGRAMS
      );

      expect(result).toBe(true);
    });
  });
});
