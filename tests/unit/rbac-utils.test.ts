/**
 * Unit tests for RBAC utility functions
 */

import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasMinimumRole,
  validateAction,
  createRBACContext,
  getAvailablePermissions,
  canManageUser,
  getGrantablePermissions,
  createAuditLogData,
  can,
  isRole,
  isOwner,
  isAdminOrAbove,
  Permission,
} from '@/lib/rbac/utils';
import { MOCK_ROLES } from '../helpers';

describe('RBAC Utils', () => {
  describe('hasPermission()', () => {
    it('should return allowed for explicit permission', () => {
      const context = createRBACContext('user1', 'org1', 'member', [Permission.EXPORT_DATA]);
      const result = hasPermission(context, Permission.EXPORT_DATA);

      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return allowed for role-based permission', () => {
      const context = createRBACContext('user1', 'org1', 'owner');
      const result = hasPermission(context, Permission.MANAGE_USERS);

      expect(result.allowed).toBe(true);
    });

    it('should return not allowed for missing permission', () => {
      const context = createRBACContext('user1', 'org1', 'viewer');
      const result = hasPermission(context, Permission.MANAGE_USERS);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('does not have permission');
    });

    it('should prioritize explicit permissions over role', () => {
      const context = createRBACContext('user1', 'org1', 'viewer', [Permission.MANAGE_USERS]);
      const result = hasPermission(context, Permission.MANAGE_USERS);

      expect(result.allowed).toBe(true);
    });

    it('should work with string permission', () => {
      const context = createRBACContext('user1', 'org1', 'owner');
      const result = hasPermission(context, 'manage_users');

      expect(result.allowed).toBe(true);
    });
  });

  describe('hasAnyPermission()', () => {
    it('should return allowed if user has any permission', () => {
      const context = createRBACContext('user1', 'org1', 'manager');
      const result = hasAnyPermission(context, [
        Permission.MANAGE_USERS,
        Permission.MANAGE_PROGRAMS,
      ]);

      expect(result.allowed).toBe(true);
    });

    it('should return not allowed if user has no permissions', () => {
      const context = createRBACContext('user1', 'org1', 'viewer');
      const result = hasAnyPermission(context, [
        Permission.MANAGE_USERS,
        Permission.DELETE_ORGANIZATION,
      ]);

      expect(result.allowed).toBe(false);
    });

    it('should check all permissions until finding one', () => {
      const context = createRBACContext('user1', 'org1', 'admin', [Permission.EXPORT_DATA]);
      const result = hasAnyPermission(context, [
        Permission.MANAGE_USERS,
        Permission.EXPORT_DATA,
      ]);

      expect(result.allowed).toBe(true);
    });
  });

  describe('hasAllPermissions()', () => {
    it('should return allowed if user has all permissions', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const result = hasAllPermissions(context, [
        Permission.MANAGE_USERS,
        Permission.MANAGE_PROGRAMS,
      ]);

      expect(result.allowed).toBe(true);
    });

    it('should return not allowed if user missing one permission', () => {
      const context = createRBACContext('user1', 'org1', 'manager');
      const result = hasAllPermissions(context, [
        Permission.MANAGE_PROGRAMS,
        Permission.MANAGE_USERS,
      ]);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('manage_users');
    });

    it('should return not allowed if user has no permissions', () => {
      const context = createRBACContext('user1', 'org1', 'viewer');
      const result = hasAllPermissions(context, [
        Permission.MANAGE_USERS,
        Permission.MANAGE_PROGRAMS,
      ]);

      expect(result.allowed).toBe(false);
    });

    it('should work with explicit permissions plus role permissions', () => {
      const context = createRBACContext('user1', 'org1', 'manager', [
        Permission.MANAGE_USERS,
      ]);
      const result = hasAllPermissions(context, [
        Permission.MANAGE_USERS,
        Permission.MANAGE_PROGRAMS,
      ]);

      expect(result.allowed).toBe(true);
    });
  });

  describe('hasMinimumRole()', () => {
    it('should return allowed for equal role', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const result = hasMinimumRole(context, 'admin');

      expect(result.allowed).toBe(true);
    });

    it('should return allowed for higher role', () => {
      const context = createRBACContext('user1', 'org1', 'owner');
      const result = hasMinimumRole(context, 'manager');

      expect(result.allowed).toBe(true);
    });

    it('should return not allowed for lower role', () => {
      const context = createRBACContext('user1', 'org1', 'member');
      const result = hasMinimumRole(context, 'admin');

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('below required role');
    });
  });

  describe('validateAction()', () => {
    it('should return allowed when no requirements specified', () => {
      const context = createRBACContext('user1', 'org1', 'viewer');
      const result = validateAction(context);

      expect(result.allowed).toBe(true);
    });

    it('should validate minimum role requirement', () => {
      const context = createRBACContext('user1', 'org1', 'member');
      const result = validateAction(context, undefined, 'admin');

      expect(result.allowed).toBe(false);
    });

    it('should validate permission requirements', () => {
      const context = createRBACContext('user1', 'org1', 'member');
      const result = validateAction(context, [Permission.MANAGE_USERS]);

      expect(result.allowed).toBe(false);
    });

    it('should validate both role and permissions', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const result = validateAction(context, [Permission.MANAGE_PROGRAMS], 'admin');

      expect(result.allowed).toBe(true);
    });

    it('should fail on role check first', () => {
      const context = createRBACContext('user1', 'org1', 'viewer');
      const result = validateAction(context, [Permission.MANAGE_USERS], 'admin');

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('role');
    });
  });

  describe('createRBACContext()', () => {
    it('should create context with provided values', () => {
      const context = createRBACContext('user1', 'org1', 'admin', [
        Permission.MANAGE_USERS,
      ]);

      expect(context.userId).toBe('user1');
      expect(context.organizationId).toBe('org1');
      expect(context.role).toBe('admin');
      expect(context.permissions).toContain(Permission.MANAGE_USERS);
    });

    it('should create context with empty permissions by default', () => {
      const context = createRBACContext('user1', 'org1', 'viewer');

      expect(context.permissions).toEqual([]);
    });
  });

  describe('getAvailablePermissions()', () => {
    it('should return all role permissions', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const permissions = getAvailablePermissions(context);

      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions).toContain(Permission.MANAGE_USERS);
    });

    it('should combine role and explicit permissions', () => {
      const context = createRBACContext('user1', 'org1', 'viewer', [
        Permission.MANAGE_PROGRAMS,
      ]);
      const permissions = getAvailablePermissions(context);

      expect(permissions).toContain(Permission.VIEW_ANALYTICS);
      expect(permissions).toContain(Permission.MANAGE_PROGRAMS);
    });

    it('should not duplicate permissions', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const permissions = getAvailablePermissions(context);
      const unique = new Set(permissions);

      expect(unique.size).toBe(permissions.length);
    });
  });

  describe('canManageUser()', () => {
    it('should return allowed for owner managing lower role', () => {
      const managerContext = createRBACContext('user1', 'org1', 'owner');
      const result = canManageUser(managerContext, 'member', 'org1');

      expect(result.allowed).toBe(true);
    });

    it('should return not allowed for different organization', () => {
      const managerContext = createRBACContext('user1', 'org1', 'owner');
      const result = canManageUser(managerContext, 'member', 'org2');

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('different organization');
    });

    it('should return not allowed for missing permission', () => {
      const managerContext = createRBACContext('user1', 'org1', 'viewer');
      const result = canManageUser(managerContext, 'member', 'org1');

      expect(result.allowed).toBe(false);
    });

    it('should return not allowed for managing higher role', () => {
      const managerContext = createRBACContext('user1', 'org1', 'admin');
      const result = canManageUser(managerContext, 'owner', 'org1');

      expect(result.allowed).toBe(false);
    });
  });

  describe('getGrantablePermissions()', () => {
    it('should return role permissions', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const permissions = getGrantablePermissions(context);

      expect(Array.isArray(permissions)).toBe(true);
      expect(permissions).toContain(Permission.MANAGE_USERS);
    });

    it('should not return permissions higher roles have', () => {
      const context = createRBACContext('user1', 'org1', 'member');
      const permissions = getGrantablePermissions(context);

      expect(permissions).not.toContain(Permission.MANAGE_USERS);
      expect(permissions).not.toContain(Permission.DELETE_ORGANIZATION);
    });
  });

  describe('createAuditLogData()', () => {
    it('should create audit log entry', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const logData = createAuditLogData('user_invited', context, 'user2');

      expect(logData.action).toBe('user_invited');
      expect(logData.performedBy).toBe('user1');
      expect(logData.resourceId).toBe('user2');
      expect(logData.resourceType).toBe('user');
    });

    it('should include additional details', () => {
      const context = createRBACContext('user1', 'org1', 'owner');
      const logData = createAuditLogData('role_changed', context, 'user2', {
        previousRole: 'member',
        newRole: 'admin',
      });

      expect(logData.details.previousRole).toBe('member');
      expect(logData.details.newRole).toBe('admin');
    });

    it('should include timestamp and role in details', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      const logData = createAuditLogData('test_action', context);

      expect(logData.details.role).toBe('admin');
      expect(logData.details.timestamp).toBeDefined();
    });
  });

  describe('can()', () => {
    it('should return true with no permissions', () => {
      const context = createRBACContext('user1', 'org1', 'viewer');
      expect(can(context)).toBe(true);
    });

    it('should check single permission', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      expect(can(context, Permission.MANAGE_USERS)).toBe(true);
      expect(can(context, Permission.DELETE_ORGANIZATION)).toBe(false);
    });

    it('should check all permissions when multiple specified', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      expect(
        can(
          context,
          Permission.MANAGE_USERS,
          Permission.MANAGE_PROGRAMS
        )
      ).toBe(true);

      expect(
        can(
          context,
          Permission.MANAGE_USERS,
          Permission.DELETE_ORGANIZATION
        )
      ).toBe(false);
    });
  });

  describe('isRole()', () => {
    it('should return true for matching role', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      expect(isRole(context, 'admin')).toBe(true);
    });

    it('should return false for non-matching role', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      expect(isRole(context, 'member')).toBe(false);
    });

    it('should check any role when multiple provided', () => {
      const context = createRBACContext('user1', 'org1', 'admin');
      expect(isRole(context, 'member', 'admin', 'owner')).toBe(true);
      expect(isRole(context, 'member', 'viewer')).toBe(false);
    });
  });

  describe('isOwner()', () => {
    it('should return true for owner role', () => {
      const context = createRBACContext('user1', 'org1', 'owner');
      expect(isOwner(context)).toBe(true);
    });

    it('should return false for non-owner roles', () => {
      expect(isOwner(MOCK_ROLES.admin)).toBe(false);
      expect(isOwner(MOCK_ROLES.member)).toBe(false);
    });
  });

  describe('isAdminOrAbove()', () => {
    it('should return true for admin and owner', () => {
      expect(isAdminOrAbove(MOCK_ROLES.admin)).toBe(true);
      expect(isAdminOrAbove(MOCK_ROLES.owner)).toBe(true);
    });

    it('should return false for lower roles', () => {
      expect(isAdminOrAbove(MOCK_ROLES.manager)).toBe(false);
      expect(isAdminOrAbove(MOCK_ROLES.member)).toBe(false);
      expect(isAdminOrAbove(MOCK_ROLES.viewer)).toBe(false);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complex permission validation', () => {
      const context = createRBACContext('user1', 'org1', 'admin', [
        Permission.EXPORT_DATA,
      ]);

      // Has all required permissions
      expect(
        hasAllPermissions(context, [
          Permission.MANAGE_PROGRAMS,
          Permission.EXPORT_DATA,
        ]).allowed
      ).toBe(true);

      // Missing billing permission
      expect(
        hasAllPermissions(context, [
          Permission.MANAGE_BILLING,
          Permission.MANAGE_USERS,
        ]).allowed
      ).toBe(false);
    });

    it('should validate complete access scenario', () => {
      const context = createRBACContext('user1', 'org1', 'manager');

      // Can view programs
      expect(hasPermission(context, Permission.MANAGE_PROGRAMS).allowed).toBe(
        true
      );

      // Cannot manage users
      expect(hasPermission(context, Permission.MANAGE_USERS).allowed).toBe(false);

      // Can view analytics
      expect(hasPermission(context, Permission.VIEW_ANALYTICS).allowed).toBe(true);

      // Cannot manage organization
      expect(hasPermission(context, Permission.MANAGE_ORGANIZATION).allowed).toBe(false);
    });
  });
});
