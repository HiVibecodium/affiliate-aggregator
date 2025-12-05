/**
 * Role-Based Access Control (RBAC) System
 * Manages permissions for different user roles
 */

// Available roles in order of privilege
export const Roles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

// Available permissions
export const Permissions = {
  // Organization management
  'org:read': 'Read organization details',
  'org:update': 'Update organization settings',
  'org:delete': 'Delete organization',
  'org:manage_members': 'Manage organization members',

  // User management
  'user:invite': 'Invite users',
  'user:remove': 'Remove users',
  'user:update_role': 'Update user roles',

  // Programs
  'program:read': 'View programs',
  'program:create': 'Create programs',
  'program:update': 'Update programs',
  'program:delete': 'Delete programs',

  // Favorites
  'favorites:read': 'View favorites',
  'favorites:write': 'Manage favorites',

  // Reviews
  'review:read': 'View reviews',
  'review:write': 'Write reviews',
  'review:moderate': 'Moderate reviews',

  // Data export
  'export:data': 'Export data',
  'import:data': 'Import data',

  // Audit
  'audit:read': 'View audit logs',

  // API Keys
  'api:manage': 'Manage API keys',

  // Billing
  'billing:read': 'View billing info',
  'billing:manage': 'Manage billing',
} as const;

export type Permission = keyof typeof Permissions;

// Role-permission mapping
const rolePermissions: Record<Role, Permission[]> = {
  owner: [
    'org:read',
    'org:update',
    'org:delete',
    'org:manage_members',
    'user:invite',
    'user:remove',
    'user:update_role',
    'program:read',
    'program:create',
    'program:update',
    'program:delete',
    'favorites:read',
    'favorites:write',
    'review:read',
    'review:write',
    'review:moderate',
    'export:data',
    'import:data',
    'audit:read',
    'api:manage',
    'billing:read',
    'billing:manage',
  ],
  admin: [
    'org:read',
    'org:update',
    'org:manage_members',
    'user:invite',
    'user:remove',
    'user:update_role',
    'program:read',
    'program:create',
    'program:update',
    'program:delete',
    'favorites:read',
    'favorites:write',
    'review:read',
    'review:write',
    'review:moderate',
    'export:data',
    'import:data',
    'audit:read',
    'api:manage',
    'billing:read',
  ],
  manager: [
    'org:read',
    'user:invite',
    'program:read',
    'program:create',
    'program:update',
    'favorites:read',
    'favorites:write',
    'review:read',
    'review:write',
    'review:moderate',
    'export:data',
  ],
  member: [
    'org:read',
    'program:read',
    'favorites:read',
    'favorites:write',
    'review:read',
    'review:write',
    'export:data',
  ],
  viewer: ['org:read', 'program:read', 'favorites:read', 'review:read'],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role | string, permission: Permission): boolean {
  const normalizedRole = role.toLowerCase() as Role;
  const permissions = rolePermissions[normalizedRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role | string): Permission[] {
  const normalizedRole = role.toLowerCase() as Role;
  return rolePermissions[normalizedRole] || [];
}

/**
 * Check if role1 can manage role2 (is higher in hierarchy)
 */
export function canManageRole(managerRole: Role | string, targetRole: Role | string): boolean {
  const hierarchy: Role[] = ['owner', 'admin', 'manager', 'member', 'viewer'];
  const managerIndex = hierarchy.indexOf(managerRole.toLowerCase() as Role);
  const targetIndex = hierarchy.indexOf(targetRole.toLowerCase() as Role);

  // Can't manage if not in hierarchy or trying to manage same/higher level
  if (managerIndex === -1 || targetIndex === -1) return false;
  return managerIndex < targetIndex;
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: Role | string): string {
  const displayNames: Record<string, string> = {
    owner: 'Owner',
    admin: 'Administrator',
    manager: 'Manager',
    member: 'Member',
    viewer: 'Viewer',
  };
  return displayNames[role.toLowerCase()] || role;
}

/**
 * Validate if string is a valid role
 */
export function isValidRole(role: string): role is Role {
  return Object.values(Roles).includes(role.toLowerCase() as Role);
}
