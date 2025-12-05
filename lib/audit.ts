/**
 * Audit Log System
 * Tracks all security-relevant actions in the application
 */

import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Audit action types
export const AuditActions = {
  // Authentication
  LOGIN_SUCCESS: 'auth.login_success',
  LOGIN_FAILED: 'auth.login_failed',
  LOGOUT: 'auth.logout',
  PASSWORD_CHANGED: 'auth.password_changed',
  PASSWORD_RESET_REQUESTED: 'auth.password_reset_requested',
  TWO_FACTOR_ENABLED: 'auth.2fa_enabled',
  TWO_FACTOR_DISABLED: 'auth.2fa_disabled',

  // User management
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_INVITED: 'user.invited',
  USER_ROLE_CHANGED: 'user.role_changed',

  // Organization
  ORG_CREATED: 'org.created',
  ORG_UPDATED: 'org.updated',
  ORG_DELETED: 'org.deleted',
  ORG_MEMBER_ADDED: 'org.member_added',
  ORG_MEMBER_REMOVED: 'org.member_removed',

  // Data operations
  DATA_EXPORTED: 'data.exported',
  DATA_IMPORTED: 'data.imported',
  DATA_DELETED: 'data.deleted',

  // Programs
  PROGRAM_CREATED: 'program.created',
  PROGRAM_UPDATED: 'program.updated',
  PROGRAM_DELETED: 'program.deleted',
  PROGRAM_FAVORITED: 'program.favorited',
  PROGRAM_UNFAVORITED: 'program.unfavorited',

  // API
  API_KEY_CREATED: 'api.key_created',
  API_KEY_REVOKED: 'api.key_revoked',
  API_RATE_LIMITED: 'api.rate_limited',

  // Billing
  SUBSCRIPTION_CREATED: 'billing.subscription_created',
  SUBSCRIPTION_UPDATED: 'billing.subscription_updated',
  SUBSCRIPTION_CANCELLED: 'billing.subscription_cancelled',
  PAYMENT_SUCCEEDED: 'billing.payment_succeeded',
  PAYMENT_FAILED: 'billing.payment_failed',

  // Security
  SUSPICIOUS_ACTIVITY: 'security.suspicious_activity',
  IP_BLOCKED: 'security.ip_blocked',
  PERMISSION_DENIED: 'security.permission_denied',
} as const;

export type AuditAction = (typeof AuditActions)[keyof typeof AuditActions];

// Resource types
export const ResourceTypes = {
  USER: 'user',
  ORGANIZATION: 'organization',
  PROGRAM: 'program',
  NETWORK: 'network',
  SUBSCRIPTION: 'subscription',
  PAYMENT: 'payment',
  API_KEY: 'api_key',
  EXPORT: 'export',
  SYSTEM: 'system',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

// Audit log entry interface
interface AuditLogEntry {
  organizationId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  performedBy: string;
  details?: Record<string, unknown>;
}

// Audit context for request tracking
interface AuditContext {
  ip?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(entry: AuditLogEntry, context?: AuditContext): Promise<void> {
  try {
    const details = {
      ...entry.details,
      ...(context && {
        _context: {
          ip: context.ip,
          userAgent: context.userAgent,
          sessionId: context.sessionId,
          requestId: context.requestId,
          timestamp: new Date().toISOString(),
        },
      }),
    };

    await prisma.auditLog.create({
      data: {
        organizationId: entry.organizationId,
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        performedBy: entry.performedBy,
        details,
      },
    });

    // Also log to application logger for real-time monitoring
    logger.info('Audit log created', {
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      performedBy: entry.performedBy,
    });
  } catch (error) {
    // Don't throw - audit logging should not break the main flow
    logger.error('Failed to create audit log', { error, entry });
  }
}

/**
 * Get audit logs for an organization with filtering
 */
export async function getAuditLogs(
  organizationId: string,
  options: {
    action?: AuditAction;
    resourceType?: ResourceType;
    resourceId?: string;
    performedBy?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  } = {}
) {
  const where: Record<string, unknown> = {
    organizationId,
  };

  if (options.action) {
    where.action = options.action;
  }

  if (options.resourceType) {
    where.resourceType = options.resourceType;
  }

  if (options.resourceId) {
    where.resourceId = options.resourceId;
  }

  if (options.performedBy) {
    where.performedBy = options.performedBy;
  }

  if (options.startDate || options.endDate) {
    where.createdAt = {};
    if (options.startDate) {
      (where.createdAt as Record<string, unknown>).gte = options.startDate;
    }
    if (options.endDate) {
      (where.createdAt as Record<string, unknown>).lte = options.endDate;
    }
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}

/**
 * Helper to extract audit context from Next.js request
 */
export function getAuditContext(request: Request): AuditContext {
  const headers = request.headers;

  return {
    ip: headers.get('x-forwarded-for')?.split(',')[0] || headers.get('x-real-ip') || undefined,
    userAgent: headers.get('user-agent') || undefined,
    requestId: headers.get('x-request-id') || crypto.randomUUID(),
  };
}

/**
 * Audit log decorator for API routes
 */
export function withAuditLog(
  action: AuditAction,
  resourceType: ResourceType,
  _getResourceId?: (req: Request, res: Response) => string | undefined
) {
  return function <T extends (...args: unknown[]) => Promise<Response>>(handler: T): T {
    return (async (...args: unknown[]) => {
      const request = args[0] as Request;
      const context = getAuditContext(request);

      const response = await handler(...args);

      // Log after successful response
      if (response.ok) {
        // This would need user/org context from auth
        // For now, just log the action
        logger.info('API audit', {
          action,
          resourceType,
          context,
        });
      }

      return response;
    }) as T;
  };
}

/**
 * Cleanup old audit logs (retention policy)
 */
export async function cleanupOldAuditLogs(retentionDays: number = 90): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  const result = await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  logger.info('Audit logs cleanup completed', {
    deletedCount: result.count,
    retentionDays,
    cutoffDate,
  });

  return result.count;
}
