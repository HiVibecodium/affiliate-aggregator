/**
 * API Keys Management System
 * Generate, validate, and manage API keys for external integrations
 */

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// API Key prefix for identification
const API_KEY_PREFIX = 'aa_';
const API_KEY_LENGTH = 32;

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  organizationId: string;
  permissions: ApiKeyPermission[];
  rateLimit: number;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  isActive: boolean;
}

export type ApiKeyPermission =
  | 'programs:read'
  | 'programs:write'
  | 'analytics:read'
  | 'favorites:read'
  | 'favorites:write'
  | 'webhooks:manage'
  | 'reports:read'
  | 'reports:write'
  | '*';

export interface CreateApiKeyInput {
  name: string;
  organizationId: string;
  permissions: ApiKeyPermission[];
  rateLimit?: number;
  expiresInDays?: number;
}

export interface ValidatedApiKey {
  id: string;
  organizationId: string;
  permissions: ApiKeyPermission[];
  rateLimit: number;
}

// In-memory rate limit tracking (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Generate a new API key
 */
export function generateApiKey(): { key: string; hash: string } {
  const randomBytes = crypto.randomBytes(API_KEY_LENGTH);
  const key = API_KEY_PREFIX + randomBytes.toString('base64url');
  const hash = hashApiKey(key);
  return { key, hash };
}

/**
 * Hash API key for storage
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Mask API key for display
 */
export function maskApiKey(key: string): string {
  if (key.length < 12) return '****';
  return key.substring(0, 7) + '...' + key.substring(key.length - 4);
}

/**
 * Create a new API key
 */
export async function createApiKey(
  input: CreateApiKeyInput
): Promise<{ apiKey: ApiKey; rawKey: string }> {
  const { key, hash } = generateApiKey();

  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const created = await prisma.apiKey.create({
    data: {
      name: input.name,
      keyHash: hash,
      keyPrefix: key.substring(0, 7),
      organizationId: input.organizationId,
      permissions: input.permissions,
      rateLimit: input.rateLimit || 1000, // Default: 1000 requests/hour
      expiresAt,
      isActive: true,
    },
  });

  return {
    rawKey: key, // Only returned once, must be saved by user
    apiKey: {
      id: created.id,
      name: created.name,
      key: hash,
      maskedKey: maskApiKey(key),
      organizationId: created.organizationId,
      permissions: created.permissions as ApiKeyPermission[],
      rateLimit: created.rateLimit,
      expiresAt: created.expiresAt,
      lastUsedAt: created.lastUsedAt,
      createdAt: created.createdAt,
      isActive: created.isActive,
    },
  };
}

/**
 * Validate API key and return associated data
 */
export async function validateApiKey(key: string): Promise<ValidatedApiKey | null> {
  if (!key || !key.startsWith(API_KEY_PREFIX)) {
    return null;
  }

  const hash = hashApiKey(key);

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: hash },
  });

  if (!apiKey) return null;
  if (!apiKey.isActive) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  // Update last used timestamp (async, don't await)
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {});

  return {
    id: apiKey.id,
    organizationId: apiKey.organizationId,
    permissions: apiKey.permissions as ApiKeyPermission[],
    rateLimit: apiKey.rateLimit,
  };
}

/**
 * Check if API key has specific permission
 */
export function hasPermission(
  apiKey: ValidatedApiKey,
  requiredPermission: ApiKeyPermission
): boolean {
  if (apiKey.permissions.includes('*')) return true;
  return apiKey.permissions.includes(requiredPermission);
}

/**
 * Check rate limit for API key
 * Returns remaining requests or -1 if exceeded
 */
export function checkRateLimit(
  apiKeyId: string,
  limit: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour window

  let record = rateLimitStore.get(apiKeyId);

  // Reset if window has passed
  if (!record || record.resetAt < now) {
    record = { count: 0, resetAt: now + windowMs };
    rateLimitStore.set(apiKeyId, record);
  }

  const remaining = limit - record.count;
  const resetIn = Math.max(0, record.resetAt - now);

  if (remaining <= 0) {
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count++;
  return { allowed: true, remaining: remaining - 1, resetIn };
}

/**
 * List API keys for an organization
 */
export async function listApiKeys(organizationId: string): Promise<ApiKey[]> {
  const keys = await prisma.apiKey.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });

  return keys.map((k) => ({
    id: k.id,
    name: k.name,
    key: k.keyHash,
    maskedKey: k.keyPrefix + '...',
    organizationId: k.organizationId,
    permissions: k.permissions as ApiKeyPermission[],
    rateLimit: k.rateLimit,
    expiresAt: k.expiresAt,
    lastUsedAt: k.lastUsedAt,
    createdAt: k.createdAt,
    isActive: k.isActive,
  }));
}

/**
 * Revoke API key
 */
export async function revokeApiKey(id: string, organizationId: string): Promise<boolean> {
  const result = await prisma.apiKey.updateMany({
    where: { id, organizationId },
    data: { isActive: false },
  });

  return result.count > 0;
}

/**
 * Delete API key permanently
 */
export async function deleteApiKey(id: string, organizationId: string): Promise<boolean> {
  const result = await prisma.apiKey.deleteMany({
    where: { id, organizationId },
  });

  return result.count > 0;
}

/**
 * Update API key
 */
export async function updateApiKey(
  id: string,
  organizationId: string,
  updates: {
    name?: string;
    permissions?: ApiKeyPermission[];
    rateLimit?: number;
    isActive?: boolean;
  }
): Promise<ApiKey | null> {
  const updated = await prisma.apiKey.updateMany({
    where: { id, organizationId },
    data: updates,
  });

  if (updated.count === 0) return null;

  const key = await prisma.apiKey.findUnique({ where: { id } });
  if (!key) return null;

  return {
    id: key.id,
    name: key.name,
    key: key.keyHash,
    maskedKey: key.keyPrefix + '...',
    organizationId: key.organizationId,
    permissions: key.permissions as ApiKeyPermission[],
    rateLimit: key.rateLimit,
    expiresAt: key.expiresAt,
    lastUsedAt: key.lastUsedAt,
    createdAt: key.createdAt,
    isActive: key.isActive,
  };
}

/**
 * Rotate API key (create new, revoke old)
 */
export async function rotateApiKey(
  id: string,
  organizationId: string
): Promise<{ newKey: { apiKey: ApiKey; rawKey: string }; oldKeyRevoked: boolean } | null> {
  const oldKey = await prisma.apiKey.findUnique({
    where: { id },
  });

  if (!oldKey || oldKey.organizationId !== organizationId) {
    return null;
  }

  // Create new key with same settings
  const newKey = await createApiKey({
    name: oldKey.name + ' (rotated)',
    organizationId: oldKey.organizationId,
    permissions: oldKey.permissions as ApiKeyPermission[],
    rateLimit: oldKey.rateLimit,
  });

  // Revoke old key
  const oldKeyRevoked = await revokeApiKey(id, organizationId);

  return { newKey, oldKeyRevoked };
}

/**
 * Get API key usage stats
 */
export async function getApiKeyStats(
  apiKeyId: string
): Promise<{ requestsToday: number; requestsThisMonth: number; lastUsed: Date | null }> {
  // This would typically query a usage tracking table
  // For now, return mock data based on rate limit store
  const record = rateLimitStore.get(apiKeyId);

  const key = await prisma.apiKey.findUnique({
    where: { id: apiKeyId },
    select: { lastUsedAt: true },
  });

  return {
    requestsToday: record?.count || 0,
    requestsThisMonth: (record?.count || 0) * 30, // Estimate
    lastUsed: key?.lastUsedAt || null,
  };
}

/**
 * Middleware helper to validate API key from request
 */
export async function validateApiKeyFromRequest(
  request: Request
): Promise<{ valid: false; error: string } | { valid: true; apiKey: ValidatedApiKey }> {
  const authHeader = request.headers.get('authorization');
  const apiKeyHeader = request.headers.get('x-api-key');

  let key: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    key = authHeader.substring(7);
  } else if (apiKeyHeader) {
    key = apiKeyHeader;
  }

  if (!key) {
    return { valid: false, error: 'API key required' };
  }

  const validatedKey = await validateApiKey(key);
  if (!validatedKey) {
    return { valid: false, error: 'Invalid or expired API key' };
  }

  // Check rate limit
  const rateCheck = checkRateLimit(validatedKey.id, validatedKey.rateLimit);
  if (!rateCheck.allowed) {
    return {
      valid: false,
      error: `Rate limit exceeded. Reset in ${Math.ceil(rateCheck.resetIn / 1000)}s`,
    };
  }

  return { valid: true, apiKey: validatedKey };
}
