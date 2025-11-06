# RBAC System Quick Start Guide

## Overview

The RBAC system enables multi-tenant organizations with role-based access control. This guide shows how to use it.

## 1. Getting Organization Context

### In API Routes

```typescript
import { getOrgContext, toRBACContext } from '@/lib/auth/org-middleware';
import { can, Permission } from '@/lib/rbac/utils';

export async function GET(request, { params }) {
  // Get organization context from request
  const orgContext = await getOrgContext(request, params.orgId);

  if (!orgContext) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Convert to RBAC context for permission checks
  const rbacContext = toRBACContext(orgContext);

  // Check if user has permission
  if (!can(rbacContext, Permission.VIEW_ANALYTICS)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Safe to proceed - user has permission
}
```

## 2. Permission Checking Patterns

### Single Permission
```typescript
if (can(context, Permission.MANAGE_USERS)) {
  // User can manage users
}
```

### Multiple Permissions (ALL)
```typescript
const result = hasAllPermissions(context, [
  Permission.MANAGE_USERS,
  Permission.MANAGE_PROGRAMS,
]);

if (result.allowed) {
  // User has both permissions
}
```

### Multiple Permissions (ANY)
```typescript
const result = hasAnyPermission(context, [
  Permission.EDIT_PROGRAMS,
  Permission.MANAGE_PROGRAMS,
]);

if (result.allowed) {
  // User has at least one permission
}
```

### Role Level
```typescript
if (hasMinimumRole(context, 'manager').allowed) {
  // User is manager or higher
}
```

### Quick Checks
```typescript
isOwner(context)           // Is organization owner
isAdminOrAbove(context)    // Is admin or owner
isRole(context, 'manager') // Is specific role
```

## 3. User Management

### Checking if Can Manage User
```typescript
const canManage = canManageUser(
  managerContext,
  'member',           // Target user's role
  organizationId
);

if (!canManage.allowed) {
  console.error(canManage.reason);
}
```

### Validate Specific Action
```typescript
const result = validateAction(
  context,
  [Permission.MANAGE_PROGRAMS],  // Required permissions
  'manager'                       // Minimum role
);

if (!result.allowed) {
  console.error(result.reason);
}
```

## 4. Available Permissions

### User Management
- `manage_users` - Full user management
- `invite_users` - Invite new users
- `remove_users` - Remove members
- `change_user_role` - Change user roles

### Program Management
- `manage_programs` - Full program operations
- `create_programs` - Create programs
- `edit_programs` - Edit program details
- `delete_programs` - Delete programs

### Network Management
- `manage_networks` - Full network operations
- `create_networks` - Create networks
- `edit_networks` - Edit network details
- `delete_networks` - Delete networks

### Analytics
- `view_analytics` - View analytics dashboard
- `view_reports` - View reports
- `export_data` - Export data

### Organization
- `manage_organization` - Full organization management
- `edit_organization` - Edit organization details
- `delete_organization` - Delete organization
- `manage_billing` - Manage billing/subscription

### Compliance
- `view_audit_log` - View audit logs

## 5. Role Permissions Summary

### Owner
- All 20 permissions
- Can manage all users and resources
- Can delete organization

### Admin
- 18 permissions (no billing/org deletion)
- Can manage users and resources
- Cannot access billing or delete org

### Manager
- 10 permissions
- Can manage programs/networks
- Can view analytics and export data
- Cannot manage users

### Member
- 5 permissions
- Can edit programs/networks
- Can view analytics
- Cannot manage users or create new items

### Viewer
- 2 permissions
- Can view analytics and reports
- Can export data
- Read-only access

## 6. API Examples

### List Organizations
```bash
GET /api/organizations
```

```json
{
  "organizations": [
    {
      "id": "org_123",
      "name": "My Company",
      "slug": "my-company",
      "role": "owner",
      "tier": "pro"
    }
  ]
}
```

### Create Organization
```bash
POST /api/organizations
Content-Type: application/json

{
  "name": "New Company",
  "slug": "new-company",
  "description": "Company description"
}
```

### List Members
```bash
GET /api/organizations/org_123/members
```

```json
{
  "members": [
    {
      "id": "member_123",
      "userId": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    }
  ]
}
```

### Invite Member
```bash
POST /api/organizations/org_123/members
Content-Type: application/json

{
  "email": "newuser@example.com",
  "role": "manager"
}
```

### Update Member Role
```bash
PUT /api/organizations/org_123/members/member_123
Content-Type: application/json

{
  "role": "admin"
}
```

### Remove Member
```bash
DELETE /api/organizations/org_123/members/member_123
```

## 7. UI Components

### Organization Switcher
```tsx
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';

export function Header() {
  const currentOrg = {
    id: 'org_123',
    name: 'My Company',
    slug: 'my-company',
    role: 'owner'
  };

  return (
    <header>
      <OrganizationSwitcher currentOrg={currentOrg} />
    </header>
  );
}
```

## 8. Type Definitions

### OrgContext
```typescript
interface OrgContext {
  userId: string;
  organizationId: string;
  organizationSlug: string;
  role: string;
  permissions: string[];
  member: {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    permissions: string[];
  };
}
```

### RBACContext
```typescript
interface RBACContext {
  userId: string;
  organizationId: string;
  role: string;
  permissions: string[];
}
```

### PermissionCheckResult
```typescript
interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}
```

## 9. Common Patterns

### Protected API Endpoint
```typescript
export async function POST(request, { params }) {
  const orgContext = await getOrgContext(request, params.orgId);

  if (!orgContext) {
    return OrgAuth.unauthorized();
  }

  const rbacContext = toRBACContext(orgContext);

  if (!can(rbacContext, Permission.MANAGE_PROGRAMS)) {
    return OrgAuth.forbidden('Cannot manage programs');
  }

  // Safe to proceed
  const data = await request.json();
  // ... handle request
}
```

### Conditional UI Rendering
```tsx
import { can, Permission } from '@/lib/rbac/utils';

export function UserList({ context }) {
  if (!can(context, Permission.MANAGE_USERS)) {
    return <div>You don't have permission to view users</div>;
  }

  return <UserListComponent />;
}
```

### Audit Logging
```typescript
import { createAuditLogData } from '@/lib/rbac/utils';

const auditEntry = createAuditLogData(
  'member_added',
  rbacContext,
  newUserId,
  { email: 'user@example.com', role: 'manager' }
);

await prisma.auditLog.create({ data: auditEntry });
```

## 10. Testing RBAC

See `tests/unit/rbac.test.ts` for comprehensive test examples.

```bash
npm run test:unit -- rbac.test.ts
```

## 11. Troubleshooting

### "Organization context not found"
- Check that organization ID is provided (params.orgId, query ?org=, or header x-organization-id)
- Verify user is an active member of the organization

### "You do not have permission"
- Check user's role: `context.role`
- Check required permission: `getAvailablePermissions(context)`
- Check if role has permission: `getRolePermissions(context.role)`

### "Cannot manage user with this role"
- Cannot assign role equal to or higher than your role
- Owners can manage other owners
- Admins cannot manage owners

## 12. Next Steps

1. **Deploy Schema**: Run Prisma migration
   ```bash
   npm run db:migrate
   ```

2. **Test API**: Use API endpoints to create organizations and manage members

3. **Integrate UI**: Add OrganizationSwitcher to your app header

4. **Build Features**: Use RBAC context to control features based on permissions

## Resources

- Full documentation: `docs/MULTI_TENANT_ARCHITECTURE.md`
- Implementation details: `docs/IMPLEMENTATION_SUMMARY.md`
- Test examples: `tests/unit/rbac.test.ts`
- Permission definitions: `lib/rbac/permissions.ts`
- Utility functions: `lib/rbac/utils.ts`
- Middleware: `lib/auth/org-middleware.ts`

## Support

For questions or issues:
1. Check the comprehensive architecture documentation
2. Review test examples for usage patterns
3. Verify Prisma schema relationships
4. Check API endpoint implementations
