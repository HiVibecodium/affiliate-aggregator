/**
 * Webhooks Management API
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  registerWebhook,
  unregisterWebhook,
  getWebhooks,
  testWebhook,
  WebhookEventType,
} from '@/lib/webhooks';
import { getOrganizationContext } from '@/lib/org-middleware';

// GET - List webhooks for organization
export async function GET(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const webhooks = getWebhooks(context.organization.id);

    // Remove secrets from response
    const safeWebhooks = webhooks.map((w) => ({
      id: w.id,
      url: w.url,
      events: w.events,
      active: w.active,
      createdAt: w.createdAt,
      lastTriggeredAt: w.lastTriggeredAt,
      failureCount: w.failureCount,
    }));

    return NextResponse.json({ webhooks: safeWebhooks });
  } catch (error) {
    console.error('Error listing webhooks:', error);
    return NextResponse.json({ error: 'Failed to list webhooks' }, { status: 500 });
  }
}

// POST - Register new webhook
export async function POST(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const body = await request.json();
    const { url, events } = body;

    if (!url || !events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'URL and events array required' }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Validate events
    const validEvents: WebhookEventType[] = [
      'program.created',
      'program.updated',
      'program.deleted',
      'click.tracked',
      'favorite.added',
      'favorite.removed',
      'review.created',
      'application.submitted',
      'application.approved',
      'application.rejected',
    ];

    const invalidEvents = events.filter(
      (e: string) => !validEvents.includes(e as WebhookEventType)
    );
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        { error: `Invalid events: ${invalidEvents.join(', ')}` },
        { status: 400 }
      );
    }

    const webhook = await registerWebhook(
      context.organization.id,
      url,
      events as WebhookEventType[]
    );

    return NextResponse.json({
      webhook: {
        id: webhook.id,
        url: webhook.url,
        secret: webhook.secret, // Only returned once on creation
        events: webhook.events,
        active: webhook.active,
        createdAt: webhook.createdAt,
      },
      message: 'Webhook created. Save the secret - it will not be shown again.',
    });
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}

// DELETE - Unregister webhook
export async function DELETE(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get('id');

    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 });
    }

    const success = unregisterWebhook(context.organization.id, webhookId);

    if (!success) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Webhook deleted' });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}

// PATCH - Test webhook
export async function PATCH(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const body = await request.json();
    const { webhookId } = body;

    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 });
    }

    const success = await testWebhook(webhookId, context.organization.id);

    return NextResponse.json({
      success,
      message: success ? 'Test webhook sent successfully' : 'Test webhook failed',
    });
  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json({ error: 'Failed to test webhook' }, { status: 500 });
  }
}
