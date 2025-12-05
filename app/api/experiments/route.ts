/**
 * A/B Testing / Experiments API
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createExperiment,
  getExperiment,
  listExperiments,
  updateExperimentStatus,
  deleteExperiment,
  getVariantAssignment,
  trackExperimentEvent,
  getExperimentResults,
  getAllFeatureFlags,
  isFeatureEnabled,
  ExperimentStatus,
} from '@/lib/ab-testing';
import { getOrganizationContext } from '@/lib/org-middleware';

// GET - List experiments or get variant assignment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const experimentId = searchParams.get('experimentId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status') as ExperimentStatus | null;

    // Get variant assignment
    if (action === 'assignment' && experimentId && userId) {
      const variant = getVariantAssignment(experimentId, userId);
      return NextResponse.json({ variant });
    }

    // Get experiment results
    if (action === 'results' && experimentId) {
      const results = getExperimentResults(experimentId);
      if (!results) {
        return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
      }
      return NextResponse.json(results);
    }

    // Get single experiment
    if (experimentId) {
      const experiment = getExperiment(experimentId);
      if (!experiment) {
        return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
      }
      return NextResponse.json({ experiment });
    }

    // List feature flags
    if (action === 'flags') {
      const flags = getAllFeatureFlags();
      return NextResponse.json({ flags });
    }

    // Check single feature flag
    if (action === 'flag') {
      const flagName = searchParams.get('name');
      if (!flagName) {
        return NextResponse.json({ error: 'Flag name required' }, { status: 400 });
      }
      const enabled = isFeatureEnabled(flagName, userId || undefined);
      return NextResponse.json({ flag: flagName, enabled });
    }

    // List all experiments
    const experiments = listExperiments(status || undefined);
    return NextResponse.json({ experiments });
  } catch (error) {
    console.error('Error in experiments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create experiment or track event
export async function POST(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);
    const body = await request.json();
    const { action } = body;

    // Track experiment event
    if (action === 'track') {
      const { experimentId, userId, eventType, eventData } = body;

      if (!experimentId || !userId || !eventType) {
        return NextResponse.json(
          { error: 'experimentId, userId, and eventType required' },
          { status: 400 }
        );
      }

      trackExperimentEvent(experimentId, userId, eventType, eventData);
      return NextResponse.json({ success: true });
    }

    // Create experiment (requires org context)
    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const { name, description, variants, targetAudience, metrics } = body;

    if (!name || !description || !variants || !Array.isArray(variants)) {
      return NextResponse.json(
        { error: 'name, description, and variants array required' },
        { status: 400 }
      );
    }

    // Validate variants
    for (const variant of variants) {
      if (!variant.name || typeof variant.weight !== 'number') {
        return NextResponse.json(
          { error: 'Each variant must have name and weight' },
          { status: 400 }
        );
      }
    }

    const experiment = createExperiment(name, description, variants, {
      targetAudience,
      metrics,
    });

    return NextResponse.json({ experiment }, { status: 201 });
  } catch (error) {
    console.error('Error creating experiment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create experiment' },
      { status: 500 }
    );
  }
}

// PATCH - Update experiment status
export async function PATCH(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const body = await request.json();
    const { experimentId, status } = body;

    if (!experimentId || !status) {
      return NextResponse.json({ error: 'experimentId and status required' }, { status: 400 });
    }

    const validStatuses: ExperimentStatus[] = ['draft', 'running', 'paused', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Valid: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const experiment = updateExperimentStatus(experimentId, status);
    if (!experiment) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    return NextResponse.json({ experiment });
  } catch (error) {
    console.error('Error updating experiment:', error);
    return NextResponse.json({ error: 'Failed to update experiment' }, { status: 500 });
  }
}

// DELETE - Delete experiment
export async function DELETE(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const experimentId = searchParams.get('id');

    if (!experimentId) {
      return NextResponse.json({ error: 'Experiment ID required' }, { status: 400 });
    }

    const success = deleteExperiment(experimentId);
    if (!success) {
      return NextResponse.json({ error: 'Experiment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Experiment deleted' });
  } catch (error) {
    console.error('Error deleting experiment:', error);
    return NextResponse.json({ error: 'Failed to delete experiment' }, { status: 500 });
  }
}
