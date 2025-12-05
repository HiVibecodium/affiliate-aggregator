import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs, AuditActions, ResourceTypes } from '@/lib/audit';
import { getOrganizationContext } from '@/lib/org-middleware';
import { hasPermission } from '@/lib/rbac';

/**
 * GET /api/audit-logs
 * Get audit logs for the current organization
 * Requires 'audit:read' permission (typically admin/owner only)
 */
export async function GET(request: NextRequest) {
  try {
    // Get organization context
    const orgContext = await getOrganizationContext(request);

    if (!orgContext.organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Check permission
    if (!hasPermission(orgContext.role || 'viewer', 'audit:read')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view audit logs' },
        { status: 403 }
      );
    }

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') as keyof typeof AuditActions | null;
    const resourceType = searchParams.get('resourceType') as keyof typeof ResourceTypes | null;
    const resourceId = searchParams.get('resourceId');
    const performedBy = searchParams.get('performedBy');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Validate limit
    const safeLimit = Math.min(Math.max(1, limit), 100);

    // Get audit logs
    const { logs, total } = await getAuditLogs(orgContext.organization.id, {
      action: action ? AuditActions[action] : undefined,
      resourceType: resourceType ? ResourceTypes[resourceType] : undefined,
      resourceId: resourceId || undefined,
      performedBy: performedBy || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: safeLimit,
      offset,
    });

    return NextResponse.json({
      logs,
      pagination: {
        total,
        limit: safeLimit,
        offset,
        hasMore: offset + logs.length < total,
      },
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
