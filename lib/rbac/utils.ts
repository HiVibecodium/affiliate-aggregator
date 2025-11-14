/**
 * RBAC utility functions for permission checking and enforcement
 * Implements constraint-driven permission validation with optimal performance
 */

import { Permission, getRolePermissions, hasHigherOrEqualRole, isValidRole } from './permissions';

// Re-export commonly used types and functions
export { Permission, isValidRole } from './permissions';

export interface RBACContext {
  userId: string;
  organizationId: string;
  role: string;
  permissions: string[];
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if a user has a specific permission within an organization
 * Supports both role-based and explicit permissions
 */
export function hasPermission(
  context: RBACContext,
  permission: Permission | string
): PermissionCheckResult {
  // Check explicit permissions first (allows permission overrides)
  if (context.permissions.includes(permission)) {
    return { allowed: true };
  }

  // Check role-based permissions
  const rolePermissions = getRolePermissions(context.role);
  if (rolePermissions.includes(permission as Permission)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `User does not have permission: ${permission}`,
  };
}

/**
 * Check if user has ANY of the specified permissions
 */
export function hasAnyPermission(
  context: RBACContext,
  permissions: (Permission | string)[]
): PermissionCheckResult {
  for (const permission of permissions) {
    const result = hasPermission(context, permission);
    if (result.allowed) {
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    reason: `User does not have any of the required permissions`,
  };
}

/**
 * Check if user has ALL of the specified permissions
 */
export function hasAllPermissions(
  context: RBACContext,
  permissions: (Permission | string)[]
): PermissionCheckResult {
  for (const permission of permissions) {
    const result = hasPermission(context, permission);
    if (!result.allowed) {
      return {
        allowed: false,
        reason: `User missing required permission: ${permission}`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Check if user has a minimum role level
 */
export function hasMinimumRole(context: RBACContext, minimumRole: string): PermissionCheckResult {
  if (hasHigherOrEqualRole(context.role, minimumRole)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `User role ${context.role} is below required role ${minimumRole}`,
  };
}

/**
 * Validate that user can perform an action
 * Combines role checking and specific permission validation
 */
export function validateAction(
  context: RBACContext,
  requiredPermissions?: (Permission | string)[],
  minimumRole?: string
): PermissionCheckResult {
  // Check minimum role if specified
  if (minimumRole) {
    const roleCheck = hasMinimumRole(context, minimumRole);
    if (!roleCheck.allowed) {
      return roleCheck;
    }
  }

  // Check specific permissions if specified
  if (requiredPermissions && requiredPermissions.length > 0) {
    const permCheck = hasAllPermissions(context, requiredPermissions);
    if (!permCheck.allowed) {
      return permCheck;
    }
  }

  return { allowed: true };
}

/**
 * Create a context object from database OrganizationMember record
 */
export function createRBACContext(
  userId: string,
  organizationId: string,
  role: string,
  permissions: string[] = []
): RBACContext {
  return {
    userId,
    organizationId,
    role,
    permissions,
  };
}

/**
 * Filter permissions available to a user based on their role
 * Useful for UI rendering and feature flagging
 */
export function getAvailablePermissions(context: RBACContext): string[] {
  const rolePermissions = getRolePermissions(context.role);
  const allPermissions = new Set([...rolePermissions, ...context.permissions]);
  return Array.from(allPermissions);
}

/**
 * Check if a user can manage another user (role change, removal, etc.)
 * Respects role hierarchy: higher roles can manage lower roles
 */
export function canManageUser(
  managerContext: RBACContext,
  targetUserRole: string,
  targetOrgId: string
): PermissionCheckResult {
  // Must be in same organization
  if (managerContext.organizationId !== targetOrgId) {
    return {
      allowed: false,
      reason: 'Cannot manage users in different organization',
    };
  }

  // Must have user management permission
  const permCheck = hasPermission(managerContext, Permission.MANAGE_USERS);
  if (!permCheck.allowed) {
    return permCheck;
  }

  // Cannot manage users with equal or higher role
  if (!hasHigherOrEqualRole(managerContext.role, targetUserRole)) {
    return {
      allowed: false,
      reason: `Cannot manage user with role ${targetUserRole} while having role ${managerContext.role}`,
    };
  }

  return { allowed: true };
}

/**
 * Get all permissions a user can grant to others (limited to their own permissions)
 */
export function getGrantablePermissions(context: RBACContext): Permission[] {
  return getRolePermissions(context.role) as Permission[];
}

/**
 * Create audit log entry data for RBAC actions
 */
export function createAuditLogData(
  action: string,
  context: RBACContext,
  targetUserId?: string,
  details?: Record<string, any>
): {
  action: string;
  resourceType: string;
  resourceId: string | null;
  performedBy: string;
  details: Record<string, any>;
} {
  return {
    action,
    resourceType: 'user',
    resourceId: targetUserId || null,
    performedBy: context.userId,
    details: {
      role: context.role,
      timestamp: new Date().toISOString(),
      ...details,
    },
  };
}

/**
 * Type-safe permission check for API endpoints
 * Returns true/false for simple authorization gates
 */
export function can(context: RBACContext, ...permissions: (Permission | string)[]): boolean {
  if (permissions.length === 0) {
    return true;
  }

  if (permissions.length === 1) {
    return hasPermission(context, permissions[0]).allowed;
  }

  return hasAllPermissions(context, permissions).allowed;
}

/**
 * Quick role check utility
 */
export function isRole(context: RBACContext, ...roles: string[]): boolean {
  return roles.includes(context.role);
}

/**
 * Check if user is organization owner
 */
export function isOwner(context: RBACContext): boolean {
  return context.role === 'owner';
}

/**
 * Check if user is admin or above
 */
export function isAdminOrAbove(context: RBACContext): boolean {
  return hasHigherOrEqualRole(context.role, 'admin');
}
