/**
 * Integrations API
 * List available integrations and manage connections
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  INTEGRATIONS,
  getIntegrationsByCategory,
  getPopularIntegrations,
  IntegrationCategory,
} from '@/lib/integrations/types';

// In-memory storage for connected integrations (use DB in production)
const connectedIntegrations = new Map<
  string,
  {
    integrationId: string;
    config: Record<string, string | boolean>;
    status: 'connected' | 'error';
    connectedAt: Date;
    lastSyncAt?: Date;
  }[]
>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as IntegrationCategory | null;
    const popular = searchParams.get('popular') === 'true';
    const organizationId = searchParams.get('orgId') || 'demo-org';

    // Get integrations based on filter
    let integrations = INTEGRATIONS;
    if (category) {
      integrations = getIntegrationsByCategory(category);
    } else if (popular) {
      integrations = getPopularIntegrations();
    }

    // Get connected integrations for this org
    const orgConnections = connectedIntegrations.get(organizationId) || [];

    // Merge connection status
    const integrationsWithStatus = integrations.map((integration) => {
      const connection = orgConnections.find((c) => c.integrationId === integration.id);
      return {
        ...integration,
        status: connection?.status || 'disconnected',
        connectedAt: connection?.connectedAt || null,
        lastSyncAt: connection?.lastSyncAt || null,
      };
    });

    // Group by category for response
    const categories = [...new Set(integrations.map((i) => i.category))];
    const grouped = categories.reduce(
      (acc, cat) => {
        acc[cat] = integrationsWithStatus.filter((i) => i.category === cat);
        return acc;
      },
      {} as Record<string, typeof integrationsWithStatus>
    );

    return NextResponse.json({
      integrations: integrationsWithStatus,
      grouped,
      categories,
      stats: {
        total: INTEGRATIONS.length,
        connected: orgConnections.filter((c) => c.status === 'connected').length,
        available: INTEGRATIONS.length - orgConnections.length,
      },
    });
  } catch (error) {
    console.error('Integrations API error:', error);
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { integrationId, config, organizationId = 'demo-org' } = body;

    if (!integrationId) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    // Find integration
    const integration = INTEGRATIONS.find((i) => i.id === integrationId);
    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    // Validate required config fields
    const missingFields = integration.configFields
      .filter((f) => f.required && !config?.[f.key])
      .map((f) => f.label);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Store connection
    let orgConnections = connectedIntegrations.get(organizationId);
    if (!orgConnections) {
      orgConnections = [];
      connectedIntegrations.set(organizationId, orgConnections);
    }

    // Remove existing connection if any
    const existingIndex = orgConnections.findIndex((c) => c.integrationId === integrationId);
    if (existingIndex > -1) {
      orgConnections.splice(existingIndex, 1);
    }

    // Add new connection
    const connection = {
      integrationId,
      config,
      status: 'connected' as const,
      connectedAt: new Date(),
    };
    orgConnections.push(connection);

    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${integration.name}`,
      integration: {
        ...integration,
        status: 'connected',
        connectedAt: connection.connectedAt,
      },
    });
  } catch (error) {
    console.error('Connect integration error:', error);
    return NextResponse.json({ error: 'Failed to connect integration' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get('id');
    const organizationId = searchParams.get('orgId') || 'demo-org';

    if (!integrationId) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    const orgConnections = connectedIntegrations.get(organizationId);
    if (!orgConnections) {
      return NextResponse.json({ error: 'No connections found' }, { status: 404 });
    }

    const index = orgConnections.findIndex((c) => c.integrationId === integrationId);
    if (index === -1) {
      return NextResponse.json({ error: 'Integration not connected' }, { status: 404 });
    }

    orgConnections.splice(index, 1);

    const integration = INTEGRATIONS.find((i) => i.id === integrationId);

    return NextResponse.json({
      success: true,
      message: `Disconnected from ${integration?.name || integrationId}`,
    });
  } catch (error) {
    console.error('Disconnect integration error:', error);
    return NextResponse.json({ error: 'Failed to disconnect integration' }, { status: 500 });
  }
}
