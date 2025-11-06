/**
 * RBAC System Unit Tests
 * Tests role-based access control, permission checking, and role hierarchy
 */

import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasMinimumRole,
  validateAction,
  can,
  isRole,
  isOwner,
  isAdminOrAbove,
  canManageUser,
  createRBACContext,
  getAvailablePermissions,
} from '@/lib/rbac/utils';
import {
  Permission,
  ROLES,
  getRolePermissions,
  getRole,
  getRoleName,
  isValidRole,
  hasHigherOrEqualRole,
  canManageRole,
} from '@/lib/rbac/permissions';
import { RBACContext } from '@/lib/rbac/utils';

describe('RBAC Permissions', () => {
  describe('Permission Management', () => {
    test('should get all permissions for owner role', () => {
      const permissions = getRolePermissions('owner');
      expect(permissions.length).toBeGreaterThan(0);
      expect(permissions).toContain(Permission.MANAGE_USERS);
      expect(permissions).toContain(Permission.MANAGE_ORGANIZATION);
    });

    test('should get permissions for viewer role', () => {
      const permissions = getRolePermissions('viewer');
      expect(permissions).toContain(Permission.VIEW_ANALYTICS);
      expect(permissions).not.toContain(Permission.MANAGE_USERS);
    });

    test('should get role by ID', () => {
      const role = getRole('owner');
      expect(role).not.toBeNull();
      expect(role?.id).toBe('owner');
      expect(role?.name).toBe('Owner');
    });

    test('should validate role IDs', () => {
      expect(isValidRole('owner')).toBe(true);
      expect(isValidRole('admin')).toBe(true);
      expect(isValidRole('invalid')).toBe(false);
    });

    test('should get role name', () => {
      expect(getRoleName('owner')).toBe('Owner');
      expect(getRoleName('admin')).toBe('Administrator');
      expect(getRoleName('viewer')).toBe('Viewer');
    });
  });

  describe('Role Hierarchy', () => {
    test('owner should have higher role than all others', () => {
      expect(hasHigherOrEqualRole('owner', 'admin')).toBe(true);
      expect(hasHigherOrEqualRole('owner', 'manager')).toBe(true);
      expect(hasHigherOrEqualRole('owner', 'member')).toBe(true);
      expect(hasHigherOrEqualRole('owner', 'viewer')).toBe(true);
    });

    test('admin should not have higher role than owner', () => {
      expect(hasHigherOrEqualRole('admin', 'owner')).toBe(false);
    });

    test('manager should be able to manage lower roles', () => {
      expect(canManageRole('manager', 'member')).toBe(true);
      expect(canManageRole('manager', 'viewer')).toBe(true);
    });

    test('manager should not be able to manage higher roles', () => {
      expect(canManageRole('manager', 'admin')).toBe(false);
      expect(canManageRole('manager', 'owner')).toBe(false);
    });

    test('viewer should not be able to manage any role', () => {
      expect(canManageRole('viewer', 'member')).toBe(false);
      expect(canManageRole('viewer', 'manager')).toBe(false);
    });
  });
});

describe('RBAC Context and Permission Checking', () => {
  let ownerContext: RBACContext;
  let adminContext: RBACContext;
  let managerContext: RBACContext;
  let memberContext: RBACContext;
  let viewerContext: RBACContext;

  beforeEach(() => {
    ownerContext = createRBACContext('user1', 'org1', 'owner');
    adminContext = createRBACContext('user2', 'org1', 'admin');
    managerContext = createRBACContext('user3', 'org1', 'manager');
    memberContext = createRBACContext('user4', 'org1', 'member');
    viewerContext = createRBACContext('user5', 'org1', 'viewer');
  });

  describe('hasPermission', () => {
    test('owner should have all permissions', () => {
      expect(hasPermission(ownerContext, Permission.MANAGE_USERS).allowed).toBe(
        true
      );
      expect(hasPermission(ownerContext, Permission.EXPORT_DATA).allowed).toBe(
        true
      );
      expect(hasPermission(ownerContext, Permission.DELETE_ORGANIZATION).allowed).toBe(
        true
      );
    });

    test('viewer should only have view permissions', () => {
      expect(hasPermission(viewerContext, Permission.VIEW_ANALYTICS).allowed).toBe(
        true
      );
      expect(hasPermission(viewerContext, Permission.MANAGE_USERS).allowed).toBe(
        false
      );
      expect(hasPermission(viewerContext, Permission.EDIT_PROGRAMS).allowed).toBe(
        false
      );
    });

    test('admin should not have delete organization permission', () => {
      expect(hasPermission(adminContext, Permission.DELETE_ORGANIZATION).allowed).toBe(
        false
      );
    });

    test('manager should have program management permissions', () => {
      expect(hasPermission(managerContext, Permission.MANAGE_PROGRAMS).allowed).toBe(
        true
      );
      expect(hasPermission(managerContext, Permission.CREATE_PROGRAMS).allowed).toBe(
        true
      );
    });
  });

  describe('hasAnyPermission', () => {
    test('should return true if user has any of the permissions', () => {
      const result = hasAnyPermission(memberContext, [
        Permission.MANAGE_USERS,
        Permission.MANAGE_PROGRAMS,
      ]);
      expect(result.allowed).toBe(true);
    });

    test('should return false if user has none of the permissions', () => {
      const result = hasAnyPermission(viewerContext, [
        Permission.MANAGE_USERS,
        Permission.DELETE_ORGANIZATION,
      ]);
      expect(result.allowed).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    test('owner should have all permissions', () => {
      const result = hasAllPermissions(ownerContext, [
        Permission.MANAGE_USERS,
        Permission.MANAGE_PROGRAMS,
        Permission.EXPORT_DATA,
      ]);
      expect(result.allowed).toBe(true);
    });

    test('viewer should not have all permissions', () => {
      const result = hasAllPermissions(viewerContext, [
        Permission.VIEW_ANALYTICS,
        Permission.MANAGE_PROGRAMS,
      ]);
      expect(result.allowed).toBe(false);
    });
  });

  describe('hasMinimumRole', () => {
    test('owner should meet minimum role requirements', () => {
      expect(hasMinimumRole(ownerContext, 'admin').allowed).toBe(true);
      expect(hasMinimumRole(ownerContext, 'owner').allowed).toBe(true);
    });

    test('manager should not meet admin minimum', () => {
      expect(hasMinimumRole(managerContext, 'admin').allowed).toBe(false);
    });

    test('member should only meet member and viewer minimums', () => {
      expect(hasMinimumRole(memberContext, 'member').allowed).toBe(true);
      expect(hasMinimumRole(memberContext, 'viewer').allowed).toBe(true);
      expect(hasMinimumRole(memberContext, 'admin').allowed).toBe(false);
    });
  });

  describe('validateAction', () => {
    test('should validate both role and permissions', () => {
      const result = validateAction(
        managerContext,
        [Permission.MANAGE_PROGRAMS],
        'manager'
      );
      expect(result.allowed).toBe(true);
    });

    test('should fail if minimum role not met', () => {
      const result = validateAction(
        managerContext,
        [Permission.MANAGE_PROGRAMS],
        'admin'
      );
      expect(result.allowed).toBe(false);
    });

    test('should fail if required permission missing', () => {
      const result = validateAction(
        viewerContext,
        [Permission.MANAGE_USERS],
        'viewer'
      );
      expect(result.allowed).toBe(false);
    });
  });

  describe('Convenience functions', () => {
    test('can() should work for simple permission checks', () => {
      expect(can(ownerContext, Permission.MANAGE_USERS)).toBe(true);
      expect(can(viewerContext, Permission.MANAGE_USERS)).toBe(false);
    });

    test('isRole() should check role membership', () => {
      expect(isRole(ownerContext, 'owner')).toBe(true);
      expect(isRole(ownerContext, 'admin')).toBe(false);
      expect(isRole(memberContext, 'member', 'admin')).toBe(true);
    });

    test('isOwner() should identify owners', () => {
      expect(isOwner(ownerContext)).toBe(true);
      expect(isOwner(adminContext)).toBe(false);
    });

    test('isAdminOrAbove() should work correctly', () => {
      expect(isAdminOrAbove(ownerContext)).toBe(true);
      expect(isAdminOrAbove(adminContext)).toBe(true);
      expect(isAdminOrAbove(managerContext)).toBe(false);
    });
  });

  describe('canManageUser', () => {
    test('owner should be able to manage all users', () => {
      expect(
        canManageUser(ownerContext, 'admin', 'org1').allowed
      ).toBe(true);
      expect(canManageUser(ownerContext, 'owner', 'org1').allowed).toBe(true);
    });

    test('admin should be able to manage lower roles', () => {
      expect(
        canManageUser(adminContext, 'manager', 'org1').allowed
      ).toBe(true);
      expect(canManageUser(adminContext, 'member', 'org1').allowed).toBe(true);
    });

    test('admin should not be able to manage owner', () => {
      expect(canManageUser(adminContext, 'owner', 'org1').allowed).toBe(false);
    });

    test('should fail if user is in different organization', () => {
      const differentOrgContext = createRBACContext('user1', 'org2', 'owner');
      expect(
        canManageUser(ownerContext, 'member', 'org2').allowed
      ).toBe(false);
    });

    test('viewer should not be able to manage users', () => {
      expect(canManageUser(viewerContext, 'member', 'org1').allowed).toBe(
        false
      );
    });
  });

  describe('getAvailablePermissions', () => {
    test('owner should have all permissions available', () => {
      const permissions = getAvailablePermissions(ownerContext);
      expect(permissions).toContain(Permission.MANAGE_USERS);
      expect(permissions).toContain(Permission.DELETE_ORGANIZATION);
      expect(permissions.length).toBeGreaterThan(10);
    });

    test('viewer should have limited permissions', () => {
      const permissions = getAvailablePermissions(viewerContext);
      expect(permissions).toContain(Permission.VIEW_ANALYTICS);
      expect(permissions).not.toContain(Permission.MANAGE_USERS);
    });

    test('explicit permissions should be included', () => {
      const contextWithExtraPermission = createRBACContext(
        'user1',
        'org1',
        'member',
        ['custom_permission']
      );
      const permissions = getAvailablePermissions(contextWithExtraPermission);
      expect(permissions).toContain('custom_permission');
    });
  });

  describe('createRBACContext', () => {
    test('should create context with default empty permissions', () => {
      const context = createRBACContext('user1', 'org1', 'member');
      expect(context.permissions).toEqual([]);
    });

    test('should create context with explicit permissions', () => {
      const context = createRBACContext('user1', 'org1', 'member', [
        'custom_perm1',
        'custom_perm2',
      ]);
      expect(context.permissions).toEqual(['custom_perm1', 'custom_perm2']);
    });
  });

  describe('Role-based access patterns', () => {
    test('owner flow: should have full access', () => {
      expect(can(ownerContext, Permission.MANAGE_USERS)).toBe(true);
      expect(can(ownerContext, Permission.MANAGE_PROGRAMS)).toBe(true);
      expect(can(ownerContext, Permission.DELETE_ORGANIZATION)).toBe(true);
      expect(can(ownerContext, Permission.MANAGE_BILLING)).toBe(true);
    });

    test('admin flow: should have operational access', () => {
      expect(can(adminContext, Permission.MANAGE_USERS)).toBe(true);
      expect(can(adminContext, Permission.MANAGE_PROGRAMS)).toBe(true);
      expect(can(adminContext, Permission.DELETE_ORGANIZATION)).toBe(false);
      expect(can(adminContext, Permission.MANAGE_BILLING)).toBe(false);
    });

    test('manager flow: should have team management access', () => {
      expect(can(managerContext, Permission.MANAGE_USERS)).toBe(false);
      expect(can(managerContext, Permission.MANAGE_PROGRAMS)).toBe(true);
      expect(can(managerContext, Permission.VIEW_ANALYTICS)).toBe(true);
    });

    test('member flow: should have collaborative access', () => {
      expect(can(memberContext, Permission.MANAGE_PROGRAMS)).toBe(true);
      expect(can(memberContext, Permission.EDIT_PROGRAMS)).toBe(true);
      expect(can(memberContext, Permission.MANAGE_USERS)).toBe(false);
      expect(can(memberContext, Permission.VIEW_ANALYTICS)).toBe(true);
    });

    test('viewer flow: should have read-only access', () => {
      expect(can(viewerContext, Permission.VIEW_ANALYTICS)).toBe(true);
      expect(can(viewerContext, Permission.VIEW_REPORTS)).toBe(true);
      expect(can(viewerContext, Permission.MANAGE_PROGRAMS)).toBe(false);
      expect(can(viewerContext, Permission.MANAGE_USERS)).toBe(false);
    });
  });
});
