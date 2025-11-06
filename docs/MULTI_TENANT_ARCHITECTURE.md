# Multi-Tenant Architecture & RBAC System

## Overview

The Affiliate Aggregator implements a comprehensive multi-tenant architecture with Role-Based Access Control (RBAC) to support organizations with multiple users, granular permissions, and complete data isolation.

**Key Features:**
- Multi-tenant data isolation between organizations
- Five-tier role hierarchy with granular permissions
- Complete audit logging for compliance
- Invitation-based user management
- Flexible permission overrides for advanced use cases

## Database Schema

### Core Models

#### Organization
Represents a tenant/workspace
```prisma
- id: String (primary key)
- name: String
- slug: String (unique, URL-friendly identifier)
- description: String?
- logo: String?
- website: String?
- tier: String (free, pro, enterprise)
- subscriptionStatus: String (active, paused, cancelled)
- settings: Json? (flexible settings storage)
- createdAt: DateTime
- updatedAt: DateTime
- deletedAt: DateTime?
```

#### User
Base user record (Supabase auth backed)
```prisma
- id: String (matches Supabase auth.users.id)
- email: String (unique)
- name: String?
- createdAt: DateTime
- updatedAt: DateTime

Relations:
- organizationMembers: OrganizationMember[]
```

#### OrganizationMember
Defines user's role and permissions within an organization
```prisma
- id: String (primary key)
- organizationId: String (foreign key)
- userId: String (foreign key)
- role: String (owner, admin, manager, member, viewer)
- permissions: String[] (explicit permission overrides)
- status: String (active, pending, inactive)
- invitedEmail: String? (for pending invites)
- invitedAt: DateTime?
- acceptedAt: DateTime?
- createdAt: DateTime
- updatedAt: DateTime

Unique Constraints:
- (organizationId, userId)
- (organizationId, invitedEmail)
```

#### NetworkAccess & ProgramAccess
Data isolation controls - define which organizations can access which affiliate networks and programs
```prisma
- organizationId: String
- networkId/programId: String
- accessLevel: String (viewer, manager, admin)

Ensures:
- Organizations only see networks/programs they have explicit access to
- Prevents cross-tenant data leakage
```

#### Role
System role definitions with permission mappings
```prisma
- id: String
- name: String (unique)
- description: String?
- permissions: String[] (array of permission keys)
- isSystem: Boolean (true for built-in roles)
```

#### AuditLog
Complete audit trail for compliance
```prisma
- id: String
- organizationId: String
- action: String (e.g., user_added, role_changed)
- resourceType: String (user, program, network)
- resourceId: String?
- performedBy: String (user ID)
- details: Json? (action details)
- createdAt: DateTime
```

## Role Hierarchy

### Five-Tier Role System

```
Owner (Level 4)
  └─ Full access to organization and all resources
  └─ Can manage users, billing, and settings
  └─ Can delete organization (cascading deletion)

Admin (Level 3)
  └─ High-level operational access
  └─ Can manage users and all content
  └─ Cannot access billing or delete organization

Manager (Level 2)
  └─ Team-level access
  └─ Can manage programs and networks
  └─ Can invite members (to lower roles)
  └─ Can view analytics and export data

Member (Level 1)
  └─ Collaborative access
  └─ Can edit programs and networks
  └─ Can view analytics and export data
  └─ Cannot manage users or other members

Viewer (Level 0)
  └─ Read-only access
  └─ Can view analytics and reports
  └─ Can export data
  └─ Cannot make any changes
```

### Role Hierarchy Rules

1. **Higher roles can manage lower roles**: A Manager can change a Member's role, but a Member cannot change anyone's role
2. **Role equality**: Higher roles cannot change their own role, only roles can change same-level or lower roles
3. **Owner protection**: Only an Owner can manage another Owner
4. **Cannot demote self**: Users cannot demote themselves from Owner to lower roles

## Permission System

### Permission Categories

#### User Management
- `manage_users` - Full user management
- `invite_users` - Send invitations
- `remove_users` - Remove members
- `change_user_role` - Modify member roles

#### Program Management
- `manage_programs` - Full program management
- `create_programs` - Create new programs
- `edit_programs` - Edit program details
- `delete_programs` - Delete programs

#### Network Management
- `manage_networks` - Full network management
- `create_networks` - Create new networks
- `edit_networks` - Edit network details
- `delete_networks` - Delete networks

#### Analytics & Reporting
- `view_analytics` - Access analytics dashboard
- `view_reports` - Generate and view reports
- `export_data` - Export data to external formats

#### Organization Management
- `manage_organization` - Full org settings
- `edit_organization` - Edit org details
- `delete_organization` - Delete organization
- `manage_billing` - Subscription and billing

#### Audit & Compliance
- `view_audit_log` - Access audit logs

### Role-Permission Mapping

**Owner**: All 20 permissions
**Admin**: All except billing and organization deletion (18 permissions)
**Manager**: Program/network management + analytics (10 permissions)
**Member**: Program editing + analytics (5 permissions)
**Viewer**: Analytics read-only (2 permissions)

## API Architecture

### Authentication Flow

1. **Supabase Auth**: User authenticates via Supabase
2. **User Sync**: User record created in Prisma if doesn't exist
3. **Organization Selection**: User selects/switches organization
4. **RBAC Context**: System loads user's role and permissions in that org
5. **Authorization**: Every request validated against user's permissions

### API Endpoints

#### Organizations
```
GET  /api/organizations              - List user's organizations
POST /api/organizations              - Create new organization
GET  /api/organizations/[orgId]      - Get organization details
PUT  /api/organizations/[orgId]      - Update organization
```

#### Organization Members
```
GET    /api/organizations/[orgId]/members              - List members
POST   /api/organizations/[orgId]/members              - Add/invite member
PUT    /api/organizations/[orgId]/members/[memberId]   - Update member role
DELETE /api/organizations/[orgId]/members/[memberId]   - Remove member
```

#### Organization Settings (Future)
```
PUT /api/organizations/[orgId]/settings               - Update org settings
GET /api/organizations/[orgId]/audit-logs             - View audit trail
```

### Request Context Structure

Every API request includes `OrgContext`:
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

### Middleware Pattern

```typescript
// Using withOrgContext middleware
export async function POST(request, { params }) {
  const orgContext = await getOrgContext(request, params.orgId);

  if (!orgContext) {
    return OrgAuth.unauthorized();
  }

  const rbacContext = toRBACContext(orgContext);

  // Check permission
  if (!can(rbacContext, Permission.MANAGE_USERS)) {
    return OrgAuth.forbidden();
  }

  // Proceed with operation
}
```

## RBAC Utilities

### Core Functions

#### hasPermission
Check if user has specific permission
```typescript
const result = hasPermission(context, Permission.MANAGE_USERS);
// { allowed: true/false, reason?: string }
```

#### hasAnyPermission
Check if user has ANY of specified permissions
```typescript
const result = hasAnyPermission(context, [
  Permission.MANAGE_USERS,
  Permission.MANAGE_PROGRAMS
]);
```

#### hasAllPermissions
Check if user has ALL specified permissions
```typescript
const result = hasAllPermissions(context, [
  Permission.MANAGE_USERS,
  Permission.VIEW_ANALYTICS
]);
```

#### can
Quick boolean check (returns true/false)
```typescript
if (can(context, Permission.MANAGE_USERS)) {
  // Proceed with operation
}
```

#### validateAction
Combined role and permission validation
```typescript
const result = validateAction(
  context,
  [Permission.MANAGE_PROGRAMS],  // required permissions
  'manager'                       // minimum role
);
```

#### canManageUser
Check if user can manage another user
```typescript
const result = canManageUser(
  managerContext,
  targetUserRole,
  organizationId
);
```

## Data Isolation Strategy

### Organization Isolation

**Principle**: Each organization only sees data they explicitly have access to

**Implementation**:
1. **User Membership Check**: Verify user is active member of organization
2. **NetworkAccess Control**: Organizations must have `NetworkAccess` record
3. **ProgramAccess Control**: Organizations must have `ProgramAccess` record
4. **Query Filtering**: All queries filtered by organizationId

### Example Query Pattern

```typescript
// ✅ CORRECT: Data isolated by organization
const programs = await prisma.affiliateProgram.findMany({
  where: {
    organizationAccess: {
      some: {
        organizationId: orgContext.organizationId
      }
    }
  }
});

// ❌ WRONG: No organization filtering
const programs = await prisma.affiliateProgram.findMany();
```

## User Invitation Flow

### Scenario 1: Existing User
1. Admin sends invitation with user's email
2. System finds existing user record
3. `OrganizationMember` created with `status: active`
4. User sees organization in their dashboard immediately

### Scenario 2: New User
1. Admin sends invitation with user's email
2. System creates pending `OrganizationMember` with `invitedEmail`
3. New user signs up via Supabase auth
4. Invitation acceptance logic matches email and activates membership

## Audit Logging

### Logged Actions
- User invitations and removals
- Role changes
- Organization creation/deletion
- Data exports
- Settings modifications

### Audit Entry Structure
```typescript
{
  organizationId: string;
  action: string;
  resourceType: string;
  resourceId: string?;
  performedBy: string;
  details: Record<string, any>;
  createdAt: DateTime;
}
```

## Security Considerations

### Authorization Checks
- Every API endpoint must validate user's organization context
- Permission checks must happen before any data access
- Role hierarchy must be enforced (can't grant/assign higher roles)

### Data Isolation
- Use Prisma relations to enforce access control
- Never return data without organization verification
- Always include `organizationId` in queries

### Rate Limiting (Future)
- Per-organization API rate limits
- Per-user rate limits for sensitive operations

### Session Security
- Leverage Supabase secure sessions
- Organization context tied to authenticated user
- Clear session data on organization switch

## Performance Optimizations

### Caching Strategy
- Cache user's organization list (invalidate on org changes)
- Cache role permissions (static by design)
- Cache organization member count

### Database Indexes
```prisma
- OrganizationMember: (organizationId, userId)
- OrganizationMember: (organizationId, role)
- NetworkAccess: (organizationId, networkId)
- ProgramAccess: (organizationId, programId)
- AuditLog: (organizationId, createdAt)
```

### Query Optimization
- Use `select` to fetch only needed fields
- Batch member operations with `create` for bulk invites
- Paginate large result sets

## Integration Points

### With Supabase Auth
- User authentication managed by Supabase
- User ID from `supabase.auth.getUser()`
- Email verification through Supabase flows

### With Affiliate Network Data
- Organizations grant access to specific networks
- Organizations grant access to specific programs
- Access levels: viewer (read-only), manager (edit), admin (full)

### With Existing Affiliate Data
- No changes to existing network/program schema
- Access control via separate `NetworkAccess`/`ProgramAccess` models
- Enables gradual migration of existing data

## Testing Strategy

### Unit Tests
- Permission checking logic
- Role hierarchy enforcement
- Permission calculation for different roles

### Integration Tests
- Organization creation flow
- User invitation flow
- Member role changes
- Access control enforcement

### E2E Tests (Future)
- Complete user signup + org creation
- Team collaboration scenarios
- Data isolation verification

## Migration Path

### Phase 1: Schema Setup
✅ Add Organization, OrganizationMember, Role models
✅ Add NetworkAccess, ProgramAccess models
✅ Add AuditLog model

### Phase 2: API Implementation
✅ Organization CRUD endpoints
✅ Member management endpoints
✅ RBAC middleware integration

### Phase 3: UI Implementation
✅ Organization switcher
✅ Member management interface
✅ Settings pages

### Phase 4: Data Migration
- Create default organizations for existing users
- Assign owner role to original user
- Grant full access to their networks/programs

### Phase 5: Deprecation
- Retire single-user mode
- Require organization context for all operations
- Remove legacy single-tenant code paths

## Future Enhancements

1. **Team Roles**: Custom roles for organizations
2. **Granular Permissions**: Per-resource permission overrides
3. **API Keys**: Organization-level API keys for integrations
4. **Two-Factor Auth**: Optional 2FA per organization
5. **Single Sign-On (SSO)**: Enterprise SSO support
6. **Advanced Analytics**: Per-organization analytics dashboard
7. **Webhook Events**: Organization activity webhooks
8. **Bulk Operations**: Batch user imports and role assignments
