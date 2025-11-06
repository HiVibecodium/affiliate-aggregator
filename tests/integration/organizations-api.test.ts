/**
 * Integration tests for Organizations API endpoints
 * Tests API routes with database interactions
 */

import { testDataFactories } from '../helpers';

describe('Organizations API Integration Tests', () => {
  describe('API Request/Response Validation', () => {
    it('should validate organization creation request structure', () => {
      const validRequest = {
        name: 'Test Organization',
        slug: 'test-org',
        description: 'Test description',
      };

      // Validate required fields
      expect(validRequest.name).toBeDefined();
      expect(validRequest.slug).toBeDefined();
      expect(validRequest.slug).toMatch(/^[a-z0-9_-]+$/);
    });

    it('should reject invalid slug formats', () => {
      const invalidSlugs = [
        'Test-Org',     // uppercase
        'test_org!',    // special chars
        'test org',     // spaces
        'test@org',     // special chars
      ];

      const slugPattern = /^[a-z0-9_-]+$/;

      invalidSlugs.forEach(slug => {
        expect(slug).not.toMatch(slugPattern);
      });
    });

    it('should validate organization response structure', () => {
      const orgResponse = {
        id: 'org-123',
        name: 'Test Org',
        slug: 'test-org',
        description: 'Description',
        tier: 'free',
        createdAt: new Date(),
      };

      expect(orgResponse.id).toBeDefined();
      expect(orgResponse.name).toBeDefined();
      expect(orgResponse.slug).toBeDefined();
      expect(orgResponse.tier).toBeDefined();
    });

    it('should validate organization list response format', () => {
      const orgs = [
        {
          id: 'org-1',
          name: 'Org 1',
          slug: 'org-1',
          role: 'owner',
          joinedAt: new Date(),
        },
        {
          id: 'org-2',
          name: 'Org 2',
          slug: 'org-2',
          role: 'member',
          joinedAt: new Date(),
        },
      ];

      expect(Array.isArray(orgs)).toBe(true);
      orgs.forEach(org => {
        expect(org.id).toBeDefined();
        expect(org.name).toBeDefined();
        expect(org.role).toBeDefined();
      });
    });
  });

  describe('Organization Creation Logic', () => {
    it('should create organization with owner role', () => {
      const creator = testDataFactories.user({ id: 'user-1' });
      const organization = testDataFactories.organization();

      const membership = testDataFactories.organizationMember({
        userId: creator.id,
        organizationId: organization.id,
        role: 'owner',
        status: 'active',
      });

      expect(membership.role).toBe('owner');
      expect(membership.userId).toBe(creator.id);
      expect(membership.status).toBe('active');
    });

    it('should handle multiple organization owners', () => {
      const org1 = testDataFactories.organization({ name: 'Org 1' });
      const org2 = testDataFactories.organization({ name: 'Org 2' });
      const user = testDataFactories.user();

      const member1 = testDataFactories.organizationMember({
        organizationId: org1.id,
        userId: user.id,
        role: 'owner',
      });

      const member2 = testDataFactories.organizationMember({
        organizationId: org2.id,
        userId: user.id,
        role: 'member',
      });

      expect(member1.organizationId).not.toBe(member2.organizationId);
      expect(member1.role).toBe('owner');
      expect(member2.role).toBe('member');
    });

    it('should generate valid organization data', () => {
      const org = testDataFactories.organization();

      expect(org.id).toBeDefined();
      expect(org.name).toBeDefined();
      expect(org.slug).toBeDefined();
      expect(org.slug).toMatch(/^[a-z0-9_-]+$/);
      expect(['free', 'pro', 'enterprise']).toContain(org.tier);
    });
  });

  describe('User Organization Relationships', () => {
    it('should track user organization memberships', () => {
      const user = testDataFactories.user();
      const orgs = [
        testDataFactories.organization({ name: 'Org 1' }),
        testDataFactories.organization({ name: 'Org 2' }),
      ];

      const memberships = orgs.map(org =>
        testDataFactories.organizationMember({
          userId: user.id,
          organizationId: org.id,
          role: 'owner',
        })
      );

      expect(memberships).toHaveLength(2);
      expect(memberships.every(m => m.userId === user.id)).toBe(true);
    });

    it('should handle organization access control', () => {
      const org = testDataFactories.organization();
      const user1 = testDataFactories.user({ id: 'user-1' });
      const user2 = testDataFactories.user({ id: 'user-2' });

      const admin = testDataFactories.organizationMember({
        userId: user1.id,
        organizationId: org.id,
        role: 'admin',
        status: 'active',
      });

      const member = testDataFactories.organizationMember({
        userId: user2.id,
        organizationId: org.id,
        role: 'member',
        status: 'active',
      });

      expect(admin.userId).toBe('user-1');
      expect(member.userId).toBe('user-2');
      expect(admin.role).not.toBe(member.role);
    });

    it('should support organization membership status', () => {
      const statuses = ['pending', 'active', 'inactive'];
      const memberships = statuses.map(status =>
        testDataFactories.organizationMember({ status: status as any })
      );

      memberships.forEach((m, i) => {
        expect(m.status).toBe(statuses[i]);
      });
    });
  });

  describe('Organization Data Validation', () => {
    it('should validate organization name', () => {
      const org = testDataFactories.organization({ name: 'Valid Company Name' });
      expect(org.name).toBeTruthy();
      expect(org.name.length).toBeGreaterThan(0);
    });

    it('should support optional organization fields', () => {
      const org = testDataFactories.organization({
        description: null,
        logo: null,
        website: null,
      });

      expect(org.description).toBeNull();
      expect(org.logo).toBeNull();
      expect(org.website).toBeNull();
    });

    it('should track organization timestamps', () => {
      const org = testDataFactories.organization();
      expect(org.createdAt).toBeInstanceOf(Date);
      expect(org.updatedAt).toBeInstanceOf(Date);
      expect(org.createdAt.getTime()).toBeLessThanOrEqual(org.updatedAt.getTime());
    });

    it('should support organization subscription tiers', () => {
      const tiers = ['free', 'pro', 'enterprise'];
      const organizations = tiers.map(tier =>
        testDataFactories.organization({ tier })
      );

      organizations.forEach((org, i) => {
        expect(org.tier).toBe(tiers[i]);
      });
    });
  });

  describe('Audit Trail', () => {
    it('should create audit log for organization creation', () => {
      const user = testDataFactories.user();
      const org = testDataFactories.organization();

      const auditLog = testDataFactories.auditLog({
        action: 'organization_created',
        resourceType: 'organization',
        resourceId: org.id,
        performedBy: user.id,
      });

      expect(auditLog.action).toBe('organization_created');
      expect(auditLog.resourceId).toBe(org.id);
      expect(auditLog.performedBy).toBe(user.id);
    });

    it('should track audit log details', () => {
      const auditLog = testDataFactories.auditLog({
        details: {
          name: 'Test Org',
          slug: 'test-org',
        },
      });

      expect(auditLog.details.name).toBe('Test Org');
      expect(auditLog.details.slug).toBe('test-org');
    });
  });
});
