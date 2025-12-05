/**
 * A/B Testing Infrastructure
 * Feature flags and experiment management
 */

import crypto from 'crypto';

// Experiment types
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface Variant {
  id: string;
  name: string;
  weight: number; // 0-100, percentage of traffic
  config: Record<string, unknown>;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  variants: Variant[];
  targetAudience?: {
    percentage: number; // 0-100, what % of users see this experiment
    filters?: {
      countries?: string[];
      userTypes?: string[];
      organizationIds?: string[];
    };
  };
  metrics: string[]; // metrics to track
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  userId: string;
  assignedAt: Date;
}

export interface ExperimentEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  eventType: string;
  eventData?: Record<string, unknown>;
  timestamp: Date;
}

// In-memory storage (in production, use Redis or database)
const experiments = new Map<string, Experiment>();
const assignments = new Map<string, ExperimentAssignment>(); // key: `${experimentId}:${userId}`
const events: ExperimentEvent[] = [];

/**
 * Create a new experiment
 */
export function createExperiment(
  name: string,
  description: string,
  variants: Omit<Variant, 'id'>[],
  options?: {
    targetAudience?: Experiment['targetAudience'];
    metrics?: string[];
  }
): Experiment {
  // Validate variant weights sum to 100
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight !== 100) {
    throw new Error(`Variant weights must sum to 100, got ${totalWeight}`);
  }

  const experiment: Experiment = {
    id: crypto.randomUUID(),
    name,
    description,
    status: 'draft',
    variants: variants.map((v) => ({ ...v, id: crypto.randomUUID() })),
    targetAudience: options?.targetAudience,
    metrics: options?.metrics || ['conversion', 'engagement'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  experiments.set(experiment.id, experiment);
  return experiment;
}

/**
 * Get experiment by ID
 */
export function getExperiment(id: string): Experiment | undefined {
  return experiments.get(id);
}

/**
 * List all experiments
 */
export function listExperiments(status?: ExperimentStatus): Experiment[] {
  const all = Array.from(experiments.values());
  return status ? all.filter((e) => e.status === status) : all;
}

/**
 * Update experiment status
 */
export function updateExperimentStatus(id: string, status: ExperimentStatus): Experiment | null {
  const experiment = experiments.get(id);
  if (!experiment) return null;

  experiment.status = status;
  experiment.updatedAt = new Date();

  if (status === 'running' && !experiment.startDate) {
    experiment.startDate = new Date();
  }
  if (status === 'completed' && !experiment.endDate) {
    experiment.endDate = new Date();
  }

  experiments.set(id, experiment);
  return experiment;
}

/**
 * Delete experiment
 */
export function deleteExperiment(id: string): boolean {
  return experiments.delete(id);
}

/**
 * Get variant assignment for a user
 * Uses consistent hashing for deterministic assignment
 */
export function getVariantAssignment(
  experimentId: string,
  userId: string,
  context?: { country?: string; userType?: string; organizationId?: string }
): Variant | null {
  const experiment = experiments.get(experimentId);
  if (!experiment || experiment.status !== 'running') {
    return null;
  }

  // Check if user is in target audience
  if (experiment.targetAudience) {
    // Check percentage
    const userHash = hashString(`${experimentId}:${userId}:audience`);
    const audienceThreshold = (experiment.targetAudience.percentage / 100) * 0xffffffff;
    if (userHash > audienceThreshold) {
      return null; // User not in experiment audience
    }

    // Check filters
    const filters = experiment.targetAudience.filters;
    if (filters) {
      if (filters.countries && context?.country && !filters.countries.includes(context.country)) {
        return null;
      }
      if (filters.userTypes && context?.userType && !filters.userTypes.includes(context.userType)) {
        return null;
      }
      if (
        filters.organizationIds &&
        context?.organizationId &&
        !filters.organizationIds.includes(context.organizationId)
      ) {
        return null;
      }
    }
  }

  // Check existing assignment
  const assignmentKey = `${experimentId}:${userId}`;
  const existingAssignment = assignments.get(assignmentKey);
  if (existingAssignment) {
    const variant = experiment.variants.find((v) => v.id === existingAssignment.variantId);
    if (variant) return variant;
  }

  // Assign variant using consistent hashing
  const hash = hashString(`${experimentId}:${userId}:variant`);
  const normalizedHash = hash / 0xffffffff; // 0-1 range

  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.weight / 100;
    if (normalizedHash <= cumulative) {
      // Store assignment
      assignments.set(assignmentKey, {
        experimentId,
        variantId: variant.id,
        userId,
        assignedAt: new Date(),
      });
      return variant;
    }
  }

  // Fallback to first variant
  const fallbackVariant = experiment.variants[0];
  assignments.set(assignmentKey, {
    experimentId,
    variantId: fallbackVariant.id,
    userId,
    assignedAt: new Date(),
  });
  return fallbackVariant;
}

/**
 * Simple string hash function (FNV-1a)
 */
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash;
}

/**
 * Track experiment event
 */
export function trackExperimentEvent(
  experimentId: string,
  userId: string,
  eventType: string,
  eventData?: Record<string, unknown>
): void {
  const assignmentKey = `${experimentId}:${userId}`;
  const assignment = assignments.get(assignmentKey);
  if (!assignment) return;

  events.push({
    experimentId,
    variantId: assignment.variantId,
    userId,
    eventType,
    eventData,
    timestamp: new Date(),
  });
}

/**
 * Get experiment results
 */
export function getExperimentResults(experimentId: string): {
  experiment: Experiment;
  variantStats: {
    variantId: string;
    variantName: string;
    participants: number;
    events: Record<string, number>;
    conversionRate?: number;
  }[];
} | null {
  const experiment = experiments.get(experimentId);
  if (!experiment) return null;

  // Get all assignments for this experiment
  const experimentAssignments = Array.from(assignments.values()).filter(
    (a) => a.experimentId === experimentId
  );

  // Get all events for this experiment
  const experimentEvents = events.filter((e) => e.experimentId === experimentId);

  // Calculate stats per variant
  const variantStats = experiment.variants.map((variant) => {
    const variantAssignments = experimentAssignments.filter((a) => a.variantId === variant.id);
    const variantEvents = experimentEvents.filter((e) => e.variantId === variant.id);

    // Count events by type
    const eventCounts = variantEvents.reduce(
      (acc, e) => {
        acc[e.eventType] = (acc[e.eventType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate conversion rate if we have conversion events
    const conversions = eventCounts['conversion'] || 0;
    const conversionRate =
      variantAssignments.length > 0 ? conversions / variantAssignments.length : undefined;

    return {
      variantId: variant.id,
      variantName: variant.name,
      participants: variantAssignments.length,
      events: eventCounts,
      conversionRate,
    };
  });

  return { experiment, variantStats };
}

/**
 * Feature flag helper - simple on/off flags
 */
const featureFlags = new Map<string, { enabled: boolean; rolloutPercentage: number }>();

export function setFeatureFlag(
  flagName: string,
  enabled: boolean,
  rolloutPercentage: number = 100
): void {
  featureFlags.set(flagName, { enabled, rolloutPercentage });
}

export function isFeatureEnabled(flagName: string, userId?: string): boolean {
  const flag = featureFlags.get(flagName);
  if (!flag || !flag.enabled) return false;

  if (flag.rolloutPercentage >= 100) return true;
  if (flag.rolloutPercentage <= 0) return false;

  if (!userId) {
    // Random rollout for anonymous users
    return Math.random() * 100 < flag.rolloutPercentage;
  }

  // Consistent rollout based on user ID
  const hash = hashString(`${flagName}:${userId}`);
  const threshold = (flag.rolloutPercentage / 100) * 0xffffffff;
  return hash < threshold;
}

/**
 * Get all feature flags
 */
export function getAllFeatureFlags(): {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
}[] {
  return Array.from(featureFlags.entries()).map(([name, config]) => ({
    name,
    ...config,
  }));
}

// Initialize some default feature flags
setFeatureFlag('dark_mode', true, 100);
setFeatureFlag('new_search_ui', true, 50);
setFeatureFlag('advanced_filters', true, 100);
setFeatureFlag('social_sharing', true, 30);
setFeatureFlag('program_recommendations', false, 0);
