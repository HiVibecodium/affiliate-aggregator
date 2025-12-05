/**
 * Webhooks System
 * Allows organizations to receive real-time notifications about events
 */

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// Webhook event types
export type WebhookEventType =
  | 'program.created'
  | 'program.updated'
  | 'program.deleted'
  | 'click.tracked'
  | 'favorite.added'
  | 'favorite.removed'
  | 'review.created'
  | 'application.submitted'
  | 'application.approved'
  | 'application.rejected';

export interface WebhookPayload {
  id: string;
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
  organizationId: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  active: boolean;
  organizationId: string;
  createdAt: Date;
  lastTriggeredAt?: Date;
  failureCount: number;
}

// In-memory webhook registry (in production, store in DB)
const webhookRegistry = new Map<string, WebhookConfig[]>();

/**
 * Generate webhook signature for payload verification
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

/**
 * Register a webhook for an organization
 */
export async function registerWebhook(
  organizationId: string,
  url: string,
  events: WebhookEventType[]
): Promise<WebhookConfig> {
  const secret = crypto.randomBytes(32).toString('hex');
  const webhook: WebhookConfig = {
    id: crypto.randomUUID(),
    url,
    secret,
    events,
    active: true,
    organizationId,
    createdAt: new Date(),
    failureCount: 0,
  };

  // Store in registry
  const orgWebhooks = webhookRegistry.get(organizationId) || [];
  orgWebhooks.push(webhook);
  webhookRegistry.set(organizationId, orgWebhooks);

  return webhook;
}

/**
 * Unregister a webhook
 */
export function unregisterWebhook(organizationId: string, webhookId: string): boolean {
  const orgWebhooks = webhookRegistry.get(organizationId);
  if (!orgWebhooks) return false;

  const index = orgWebhooks.findIndex((w) => w.id === webhookId);
  if (index === -1) return false;

  orgWebhooks.splice(index, 1);
  webhookRegistry.set(organizationId, orgWebhooks);
  return true;
}

/**
 * Get webhooks for an organization
 */
export function getWebhooks(organizationId: string): WebhookConfig[] {
  return webhookRegistry.get(organizationId) || [];
}

/**
 * Trigger webhook event
 */
export async function triggerWebhook(
  organizationId: string,
  event: WebhookEventType,
  data: Record<string, unknown>
): Promise<{ success: boolean; deliveredTo: number; errors: string[] }> {
  const webhooks = webhookRegistry.get(organizationId) || [];
  const activeWebhooks = webhooks.filter((w) => w.active && w.events.includes(event));

  const payload: WebhookPayload = {
    id: crypto.randomUUID(),
    event,
    timestamp: new Date().toISOString(),
    data,
    organizationId,
  };

  const payloadString = JSON.stringify(payload);
  const errors: string[] = [];
  let deliveredTo = 0;

  await Promise.all(
    activeWebhooks.map(async (webhook) => {
      try {
        const signature = generateWebhookSignature(payloadString, webhook.secret);

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': event,
            'X-Webhook-Id': payload.id,
          },
          body: payloadString,
          signal: AbortSignal.timeout(10000), // 10s timeout
        });

        if (response.ok) {
          deliveredTo++;
          webhook.lastTriggeredAt = new Date();
          webhook.failureCount = 0;
        } else {
          webhook.failureCount++;
          errors.push(`Webhook ${webhook.id}: HTTP ${response.status}`);

          // Disable webhook after 5 consecutive failures
          if (webhook.failureCount >= 5) {
            webhook.active = false;
          }
        }
      } catch (error) {
        webhook.failureCount++;
        errors.push(
          `Webhook ${webhook.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );

        if (webhook.failureCount >= 5) {
          webhook.active = false;
        }
      }
    })
  );

  // Log webhook delivery
  await logWebhookDelivery(organizationId, event, deliveredTo, errors);

  return { success: errors.length === 0, deliveredTo, errors };
}

/**
 * Log webhook delivery for auditing
 */
async function logWebhookDelivery(
  organizationId: string,
  event: WebhookEventType,
  deliveredTo: number,
  errors: string[]
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: 'webhook.delivered',
        resourceType: 'webhook',
        resourceId: event,
        performedBy: 'system',
        details: {
          event,
          deliveredTo,
          errors: errors.length > 0 ? errors : undefined,
        },
        organizationId,
      },
    });
  } catch {
    // Silently fail audit logging
    console.error('Failed to log webhook delivery');
  }
}

/**
 * Webhook event helper - trigger program events
 */
export async function triggerProgramEvent(
  organizationId: string,
  eventType: 'created' | 'updated' | 'deleted',
  program: { id: string; name: string; category?: string; networkId?: string }
): Promise<void> {
  await triggerWebhook(organizationId, `program.${eventType}` as WebhookEventType, {
    programId: program.id,
    programName: program.name,
    category: program.category,
    networkId: program.networkId,
  });
}

/**
 * Webhook event helper - trigger click events
 */
export async function triggerClickEvent(
  organizationId: string,
  clickData: { programId: string; source?: string; timestamp: Date }
): Promise<void> {
  await triggerWebhook(organizationId, 'click.tracked', {
    ...clickData,
    timestamp: clickData.timestamp.toISOString(),
  });
}

/**
 * Test webhook endpoint
 */
export async function testWebhook(webhookId: string, organizationId: string): Promise<boolean> {
  const webhooks = webhookRegistry.get(organizationId) || [];
  const webhook = webhooks.find((w) => w.id === webhookId);

  if (!webhook) return false;

  const testPayload: WebhookPayload = {
    id: crypto.randomUUID(),
    event: 'program.created',
    timestamp: new Date().toISOString(),
    data: { test: true, message: 'This is a test webhook' },
    organizationId,
  };

  try {
    const payloadString = JSON.stringify(testPayload);
    const signature = generateWebhookSignature(payloadString, webhook.secret);

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': 'test',
        'X-Webhook-Id': testPayload.id,
      },
      body: payloadString,
      signal: AbortSignal.timeout(10000),
    });

    return response.ok;
  } catch {
    return false;
  }
}
