/**
 * API Keys Management API
 * Create, list, and manage API keys for integrations
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory storage for API keys (use DB in production)
interface StoredApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  keyHash: string;
  permissions: string[];
  rateLimit: number;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  isActive: boolean;
}

const apiKeysStore = new Map<string, StoredApiKey[]>();

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

function generateKey(): { key: string; hash: string; prefix: string } {
  const randomBytes = crypto.randomBytes(32);
  const key = 'aa_' + randomBytes.toString('base64url');
  const hash = hashKey(key);
  const prefix = key.substring(0, 7);
  return { key, hash, prefix };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('orgId') || 'demo-org';

    const keys = apiKeysStore.get(organizationId) || [];

    // Return keys without sensitive data
    const safeKeys = keys.map((k) => ({
      id: k.id,
      name: k.name,
      maskedKey: k.keyPrefix + '...',
      permissions: k.permissions,
      rateLimit: k.rateLimit,
      expiresAt: k.expiresAt,
      lastUsedAt: k.lastUsedAt,
      createdAt: k.createdAt,
      isActive: k.isActive,
    }));

    return NextResponse.json({
      apiKeys: safeKeys,
      stats: {
        total: keys.length,
        active: keys.filter((k) => k.isActive).length,
        expired: keys.filter((k) => k.expiresAt && k.expiresAt < new Date()).length,
      },
    });
  } catch (error) {
    console.error('List API keys error:', error);
    return NextResponse.json({ error: 'Failed to list API keys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      permissions = ['programs:read'],
      rateLimit = 1000,
      expiresInDays,
      organizationId = 'demo-org',
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    // Generate new key
    const { key, hash, prefix } = generateKey();

    const apiKey: StoredApiKey = {
      id: crypto.randomUUID(),
      name,
      keyPrefix: prefix,
      keyHash: hash,
      permissions,
      rateLimit,
      expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null,
      lastUsedAt: null,
      createdAt: new Date(),
      isActive: true,
    };

    // Store key
    let orgKeys = apiKeysStore.get(organizationId);
    if (!orgKeys) {
      orgKeys = [];
      apiKeysStore.set(organizationId, orgKeys);
    }
    orgKeys.push(apiKey);

    return NextResponse.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        key, // Only returned once on creation
        maskedKey: prefix + '...',
        permissions: apiKey.permissions,
        rateLimit: apiKey.rateLimit,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
      message: 'API key created. Save this key - it will not be shown again.',
    });
  } catch (error) {
    console.error('Create API key error:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');
    const organizationId = searchParams.get('orgId') || 'demo-org';

    if (!keyId) {
      return NextResponse.json({ error: 'API key ID required' }, { status: 400 });
    }

    const orgKeys = apiKeysStore.get(organizationId);
    if (!orgKeys) {
      return NextResponse.json({ error: 'No API keys found' }, { status: 404 });
    }

    const index = orgKeys.findIndex((k) => k.id === keyId);
    if (index === -1) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    orgKeys.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'API key deleted',
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, organizationId = 'demo-org', action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'API key ID required' }, { status: 400 });
    }

    const orgKeys = apiKeysStore.get(organizationId);
    if (!orgKeys) {
      return NextResponse.json({ error: 'No API keys found' }, { status: 404 });
    }

    const key = orgKeys.find((k) => k.id === id);
    if (!key) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Handle different actions
    if (action === 'revoke') {
      key.isActive = false;
      return NextResponse.json({ success: true, message: 'API key revoked' });
    }

    if (action === 'rotate') {
      // Create new key with same settings
      const { key: newRawKey, hash, prefix } = generateKey();
      key.keyHash = hash;
      key.keyPrefix = prefix;
      key.name = key.name.replace(/ \(rotated\)$/, '') + ' (rotated)';

      return NextResponse.json({
        success: true,
        key: newRawKey, // Only returned once
        message: 'API key rotated. Save this new key - it will not be shown again.',
      });
    }

    // Apply updates
    if (updates.name) key.name = updates.name;
    if (updates.permissions) key.permissions = updates.permissions;
    if (updates.rateLimit) key.rateLimit = updates.rateLimit;
    if (typeof updates.isActive === 'boolean') key.isActive = updates.isActive;

    return NextResponse.json({
      success: true,
      apiKey: {
        id: key.id,
        name: key.name,
        maskedKey: key.keyPrefix + '...',
        permissions: key.permissions,
        rateLimit: key.rateLimit,
        isActive: key.isActive,
      },
    });
  } catch (error) {
    console.error('Update API key error:', error);
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}
