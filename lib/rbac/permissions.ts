/**
 * Permission and Role definitions for RBAC system
 * Implements industry-standard role-based access control with granular permissions
 */

export enum Permission {
  // User Management
  MANAGE_USERS = 'manage_users',
  INVITE_USERS = 'invite_users',
  REMOVE_USERS = 'remove_users',
  CHANGE_USER_ROLE = 'change_user_role',

  // Program Management
  MANAGE_PROGRAMS = 'manage_programs',
  CREATE_PROGRAMS = 'create_programs',
  EDIT_PROGRAMS = 'edit_programs',
  DELETE_PROGRAMS = 'delete_programs',

  // Network Management
  MANAGE_NETWORKS = 'manage_networks',
  CREATE_NETWORKS = 'create_networks',
  EDIT_NETWORKS = 'edit_networks',
  DELETE_NETWORKS = 'delete_networks',

  // Analytics and Reporting
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',

  // Organization Management
  MANAGE_ORGANIZATION = 'manage_organization',
  EDIT_ORGANIZATION = 'edit_organization',
  DELETE_ORGANIZATION = 'delete_organization',
  MANAGE_BILLING = 'manage_billing',

  // Audit and Compliance
  VIEW_AUDIT_LOG = 'view_audit_log',
}

export type PermissionString = keyof typeof Permission;

/**
 * Role definitions with associated permissions
 * Implements standard SaaS role hierarchy: Owner > Admin > Manager > Member > Viewer
 */
export const ROLES = {
  OWNER: {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to organization and all resources',
    permissions: [
      Permission.MANAGE_USERS,
      Permission.INVITE_USERS,
      Permission.REMOVE_USERS,
      Permission.CHANGE_USER_ROLE,
      Permission.MANAGE_PROGRAMS,
      Permission.CREATE_PROGRAMS,
      Permission.EDIT_PROGRAMS,
      Permission.DELETE_PROGRAMS,
      Permission.MANAGE_NETWORKS,
      Permission.CREATE_NETWORKS,
      Permission.EDIT_NETWORKS,
      Permission.DELETE_NETWORKS,
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_DATA,
      Permission.MANAGE_ORGANIZATION,
      Permission.EDIT_ORGANIZATION,
      Permission.DELETE_ORGANIZATION,
      Permission.MANAGE_BILLING,
      Permission.VIEW_AUDIT_LOG,
    ],
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    description: 'High-level access to manage users and resources',
    permissions: [
      Permission.MANAGE_USERS,
      Permission.INVITE_USERS,
      Permission.REMOVE_USERS,
      Permission.CHANGE_USER_ROLE,
      Permission.MANAGE_PROGRAMS,
      Permission.CREATE_PROGRAMS,
      Permission.EDIT_PROGRAMS,
      Permission.DELETE_PROGRAMS,
      Permission.MANAGE_NETWORKS,
      Permission.CREATE_NETWORKS,
      Permission.EDIT_NETWORKS,
      Permission.DELETE_NETWORKS,
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_DATA,
      Permission.EDIT_ORGANIZATION,
      Permission.VIEW_AUDIT_LOG,
    ],
  },
  MANAGER: {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage programs and networks, view analytics',
    permissions: [
      Permission.MANAGE_PROGRAMS,
      Permission.CREATE_PROGRAMS,
      Permission.EDIT_PROGRAMS,
      Permission.MANAGE_NETWORKS,
      Permission.CREATE_NETWORKS,
      Permission.EDIT_NETWORKS,
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_DATA,
      Permission.VIEW_AUDIT_LOG,
    ],
  },
  MEMBER: {
    id: 'member',
    name: 'Member',
    description: 'Can view and edit programs and networks',
    permissions: [
      Permission.MANAGE_PROGRAMS,
      Permission.EDIT_PROGRAMS,
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_DATA,
    ],
  },
  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to programs and analytics',
    permissions: [
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_REPORTS,
    ],
  },
} as const;

export type RoleId = keyof typeof ROLES;
export type RoleIdValue = (typeof ROLES)[RoleId]['id'];

/**
 * Get role definition by ID
 */
export function getRole(roleId: string): (typeof ROLES)[RoleId] | null {
  const role = Object.values(ROLES).find(r => r.id === roleId);
  return role || null;
}

/**
 * Get all available roles
 */
export function getAllRoles(): (typeof ROLES)[RoleId][] {
  return Object.values(ROLES);
}

/**
 * Check if a string is a valid role ID
 */
export function isValidRole(roleId: string): roleId is RoleIdValue {
  return Object.values(ROLES).some(r => r.id === roleId);
}

/**
 * Get permissions for a role
 */
export function getRolePermissions(roleId: string): Permission[] {
  const role = getRole(roleId);
  return role?.permissions || [];
}

/**
 * Get readable role name
 */
export function getRoleName(roleId: string): string {
  const role = getRole(roleId);
  return role?.name || 'Unknown Role';
}

/**
 * Get role description
 */
export function getRoleDescription(roleId: string): string {
  const role = getRole(roleId);
  return role?.description || '';
}

/**
 * Permission level hierarchy for access control
 * Higher number = more access
 */
export const ROLE_HIERARCHY: Record<RoleIdValue, number> = {
  viewer: 0,
  member: 1,
  manager: 2,
  admin: 3,
  owner: 4,
};

/**
 * Check if one role has equal or higher level than another
 */
export function hasHigherOrEqualRole(userRoleId: string, requiredRoleId: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRoleId as RoleIdValue] ?? -1;
  const requiredLevel = ROLE_HIERARCHY[requiredRoleId as RoleIdValue] ?? -1;
  return userLevel >= requiredLevel;
}

/**
 * Check if a role can perform an action on another role
 * Lower roles cannot manage higher roles
 */
export function canManageRole(managerRoleId: string, targetRoleId: string): boolean {
  return hasHigherOrEqualRole(managerRoleId, targetRoleId) && managerRoleId !== 'viewer';
}
