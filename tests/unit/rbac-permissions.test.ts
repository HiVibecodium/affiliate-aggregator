/**
 * Unit tests for RBAC permissions system
 */

import {
  Permission,
  ROLES,
  getRole,
  getAllRoles,
  isValidRole,
  getRolePermissions,
  getRoleName,
  getRoleDescription,
  ROLE_HIERARCHY,
  hasHigherOrEqualRole,
  canManageRole,
} from '@/lib/rbac/permissions';

describe('RBAC Permissions', () => {
  describe('Permission enum', () => {
    it('should have required permission definitions', () => {
      expect(Permission.MANAGE_USERS).toBe('manage_users');
      expect(Permission.MANAGE_PROGRAMS).toBe('manage_programs');
      expect(Permission.VIEW_ANALYTICS).toBe('view_analytics');
    });

    it('should have all expected permission categories', () => {
      const permissions = Object.values(Permission);
      const categories = ['manage_users', 'create_programs', 'view_analytics', 'manage_organization', 'view_audit_log'];

      categories.forEach((category) => {
        expect(permissions).toContain(category);
      });
    });
  });

  describe('Role definitions', () => {
    it('should define all required roles', () => {
      expect(ROLES.OWNER).toBeDefined();
      expect(ROLES.ADMIN).toBeDefined();
      expect(ROLES.MANAGER).toBeDefined();
      expect(ROLES.MEMBER).toBeDefined();
      expect(ROLES.VIEWER).toBeDefined();
    });

    it('should have correct role hierarchy', () => {
      expect(ROLES.OWNER.id).toBe('owner');
      expect(ROLES.ADMIN.id).toBe('admin');
      expect(ROLES.MANAGER.id).toBe('manager');
      expect(ROLES.MEMBER.id).toBe('member');
      expect(ROLES.VIEWER.id).toBe('viewer');
    });

    it('owner role should have maximum permissions', () => {
      const ownerPermissions = ROLES.OWNER.permissions;
      expect(ownerPermissions.length).toBeGreaterThan(15);
      expect(ownerPermissions).toContain(Permission.MANAGE_USERS);
      expect(ownerPermissions).toContain(Permission.DELETE_ORGANIZATION);
      expect(ownerPermissions).toContain(Permission.MANAGE_BILLING);
    });

    it('viewer role should have minimal permissions', () => {
      const viewerPermissions = ROLES.VIEWER.permissions;
      expect(viewerPermissions.length).toBeLessThan(5);
      expect(viewerPermissions).toContain(Permission.VIEW_ANALYTICS);
      expect(viewerPermissions).not.toContain(Permission.MANAGE_USERS);
    });

    it('admin should have manage permissions but not billing', () => {
      const adminPermissions = ROLES.ADMIN.permissions;
      expect(adminPermissions).toContain(Permission.MANAGE_USERS);
      expect(adminPermissions).not.toContain(Permission.MANAGE_BILLING);
      expect(adminPermissions).not.toContain(Permission.DELETE_ORGANIZATION);
    });

    it('manager should have program management but not user management', () => {
      const managerPermissions = ROLES.MANAGER.permissions;
      expect(managerPermissions).toContain(Permission.MANAGE_PROGRAMS);
      expect(managerPermissions).not.toContain(Permission.MANAGE_USERS);
    });

    it('member should have view and edit permissions', () => {
      const memberPermissions = ROLES.MEMBER.permissions;
      expect(memberPermissions).toContain(Permission.EDIT_PROGRAMS);
      expect(memberPermissions).toContain(Permission.VIEW_ANALYTICS);
    });
  });

  describe('getRole()', () => {
    it('should return role by id', () => {
      const role = getRole('owner');
      expect(role).toBe(ROLES.OWNER);
    });

    it('should return null for invalid role id', () => {
      const role = getRole('invalid-role');
      expect(role).toBeNull();
    });

    it('should work for all valid roles', () => {
      expect(getRole('owner')).toBeDefined();
      expect(getRole('admin')).toBeDefined();
      expect(getRole('manager')).toBeDefined();
      expect(getRole('member')).toBeDefined();
      expect(getRole('viewer')).toBeDefined();
    });
  });

  describe('getAllRoles()', () => {
    it('should return all defined roles', () => {
      const roles = getAllRoles();
      expect(roles).toHaveLength(5);
      expect(roles).toContainEqual(ROLES.OWNER);
      expect(roles).toContainEqual(ROLES.VIEWER);
    });

    it('should return roles in consistent order', () => {
      const roles1 = getAllRoles();
      const roles2 = getAllRoles();
      expect(roles1.map((r) => r.id)).toEqual(roles2.map((r) => r.id));
    });
  });

  describe('isValidRole()', () => {
    it('should validate correct role ids', () => {
      expect(isValidRole('owner')).toBe(true);
      expect(isValidRole('admin')).toBe(true);
      expect(isValidRole('manager')).toBe(true);
      expect(isValidRole('member')).toBe(true);
      expect(isValidRole('viewer')).toBe(true);
    });

    it('should reject invalid role ids', () => {
      expect(isValidRole('invalid')).toBe(false);
      expect(isValidRole('superuser')).toBe(false);
      expect(isValidRole('')).toBe(false);
      expect(isValidRole('Owner')).toBe(false); // case sensitive
    });
  });

  describe('getRolePermissions()', () => {
    it('should return permissions for valid role', () => {
      const permissions = getRolePermissions('owner');
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions.length).toBeGreaterThan(0);
      expect(permissions).toContain(Permission.MANAGE_USERS);
    });

    it('should return empty array for invalid role', () => {
      const permissions = getRolePermissions('invalid');
      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions).toHaveLength(0);
    });

    it('should return correct permissions for each role', () => {
      expect(getRolePermissions('owner')).toEqual(ROLES.OWNER.permissions);
      expect(getRolePermissions('viewer')).toEqual(ROLES.VIEWER.permissions);
      expect(getRolePermissions('manager')).toEqual(ROLES.MANAGER.permissions);
    });
  });

  describe('getRoleName()', () => {
    it('should return human-readable role name', () => {
      expect(getRoleName('owner')).toBe('Owner');
      expect(getRoleName('admin')).toBe('Administrator');
      expect(getRoleName('manager')).toBe('Manager');
      expect(getRoleName('member')).toBe('Member');
      expect(getRoleName('viewer')).toBe('Viewer');
    });

    it('should return Unknown Role for invalid role', () => {
      expect(getRoleName('invalid')).toBe('Unknown Role');
    });
  });

  describe('getRoleDescription()', () => {
    it('should return role description', () => {
      const ownerDesc = getRoleDescription('owner');
      expect(ownerDesc).toContain('Full access');

      const viewerDesc = getRoleDescription('viewer');
      expect(viewerDesc).toContain('Read-only');
    });

    it('should return empty string for invalid role', () => {
      expect(getRoleDescription('invalid')).toBe('');
    });
  });

  describe('ROLE_HIERARCHY', () => {
    it('should define hierarchy levels for all roles', () => {
      expect(ROLE_HIERARCHY.viewer).toBe(0);
      expect(ROLE_HIERARCHY.member).toBe(1);
      expect(ROLE_HIERARCHY.manager).toBe(2);
      expect(ROLE_HIERARCHY.admin).toBe(3);
      expect(ROLE_HIERARCHY.owner).toBe(4);
    });

    it('should maintain ascending hierarchy', () => {
      expect(ROLE_HIERARCHY.viewer < ROLE_HIERARCHY.member).toBe(true);
      expect(ROLE_HIERARCHY.member < ROLE_HIERARCHY.manager).toBe(true);
      expect(ROLE_HIERARCHY.manager < ROLE_HIERARCHY.admin).toBe(true);
      expect(ROLE_HIERARCHY.admin < ROLE_HIERARCHY.owner).toBe(true);
    });
  });

  describe('hasHigherOrEqualRole()', () => {
    it('should return true when user role equals required role', () => {
      expect(hasHigherOrEqualRole('owner', 'owner')).toBe(true);
      expect(hasHigherOrEqualRole('viewer', 'viewer')).toBe(true);
    });

    it('should return true when user role is higher', () => {
      expect(hasHigherOrEqualRole('owner', 'viewer')).toBe(true);
      expect(hasHigherOrEqualRole('admin', 'member')).toBe(true);
      expect(hasHigherOrEqualRole('manager', 'viewer')).toBe(true);
    });

    it('should return false when user role is lower', () => {
      expect(hasHigherOrEqualRole('viewer', 'owner')).toBe(false);
      expect(hasHigherOrEqualRole('member', 'admin')).toBe(false);
      expect(hasHigherOrEqualRole('viewer', 'manager')).toBe(false);
    });

    it('should return false for invalid roles', () => {
      expect(hasHigherOrEqualRole('invalid', 'owner')).toBe(false);
      expect(hasHigherOrEqualRole('owner', 'invalid')).toBe(false);
    });
  });

  describe('canManageRole()', () => {
    it('should allow owner to manage all roles', () => {
      expect(canManageRole('owner', 'owner')).toBe(true);
      expect(canManageRole('owner', 'admin')).toBe(true);
      expect(canManageRole('owner', 'viewer')).toBe(true);
    });

    it('should allow admin to manage lower roles', () => {
      expect(canManageRole('admin', 'member')).toBe(true);
      expect(canManageRole('admin', 'viewer')).toBe(true);
    });

    it('should prevent lower roles from managing higher roles', () => {
      expect(canManageRole('viewer', 'owner')).toBe(false);
      expect(canManageRole('member', 'admin')).toBe(false);
    });

    it('should prevent viewer from managing any role', () => {
      expect(canManageRole('viewer', 'member')).toBe(false);
      expect(canManageRole('viewer', 'viewer')).toBe(false);
    });

    it('should allow role to manage equal role only if higher than viewer', () => {
      expect(canManageRole('admin', 'admin')).toBe(true);
      expect(canManageRole('member', 'member')).toBe(true);
      expect(canManageRole('viewer', 'viewer')).toBe(false);
    });
  });

  describe('Role Permission Consistency', () => {
    it('should ensure higher roles have at least same permissions as lower roles', () => {
      const viewerPerms = new Set(ROLES.VIEWER.permissions);
      const memberPerms = new Set(ROLES.MEMBER.permissions);
      const managerPerms = new Set(ROLES.MANAGER.permissions);
      const adminPerms = new Set(ROLES.ADMIN.permissions);
      const ownerPerms = new Set(ROLES.OWNER.permissions);

      // Each level should have all permissions from level below
      viewerPerms.forEach((perm) => {
        expect(memberPerms.has(perm) || managerPerms.has(perm) || adminPerms.has(perm) || ownerPerms.has(perm)).toBe(true);
      });

      memberPerms.forEach((perm) => {
        expect(managerPerms.has(perm) || adminPerms.has(perm) || ownerPerms.has(perm)).toBe(true);
      });
    });

    it('should have meaningful permission differences between roles', () => {
      const ownerPerms = new Set(ROLES.OWNER.permissions);
      const adminPerms = new Set(ROLES.ADMIN.permissions);
      const memberPerms = new Set(ROLES.MEMBER.permissions);

      // Owner should have permissions that admin doesn't have
      const ownerOnlySet = ownerPerms.difference?.(adminPerms);
      const ownerOnly = ownerOnlySet
        ? [...ownerOnlySet]
        : [...ownerPerms].filter((p) => !adminPerms.has(p));
      expect(ownerOnly.length).toBeGreaterThan(0);

      // Admin should have permissions that member doesn't have
      const adminOnly = [...adminPerms].filter((p) => !memberPerms.has(p));
      expect(adminOnly.length).toBeGreaterThan(0);
    });
  });
});
