/**
 * Feature Gating System
 *
 * Enforce tier-based feature limits
 */

import { prisma } from '@/lib/prisma'
import { getUserTier } from './subscription'

/**
 * Feature limits by tier
 */
export const TIER_LIMITS = {
  free: {
    favorites: 5,
    comparisons_daily: 3,
    saved_searches: 0,
    applications: 0,
    api_calls_monthly: 0,
    team_members: 1,
    can_write_reviews: false,
    can_export: false,
    can_access_analytics: false,
    can_use_api: false,
  },
  pro: {
    favorites: Infinity,
    comparisons_daily: Infinity,
    saved_searches: 10,
    applications: Infinity,
    api_calls_monthly: 0,
    team_members: 1,
    can_write_reviews: true,
    can_export: true,
    can_access_analytics: true,
    can_use_api: false,
  },
  business: {
    favorites: Infinity,
    comparisons_daily: Infinity,
    saved_searches: Infinity,
    applications: Infinity,
    api_calls_monthly: 10000,
    team_members: 5,
    can_write_reviews: true,
    can_export: true,
    can_access_analytics: true,
    can_use_api: true,
  },
  enterprise: {
    favorites: Infinity,
    comparisons_daily: Infinity,
    saved_searches: Infinity,
    applications: Infinity,
    api_calls_monthly: Infinity,
    team_members: Infinity,
    can_write_reviews: true,
    can_export: true,
    can_access_analytics: true,
    can_use_api: true,
  },
} as const

export type Tier = keyof typeof TIER_LIMITS
export type Feature = keyof typeof TIER_LIMITS.free

/**
 * Get current usage for a metric
 */
async function getCurrentUsage(userId: string, metric: string, period: 'daily' | 'monthly' | 'lifetime'): Promise<number> {
  const date = new Date()
  let dateKey: Date

  if (period === 'daily') {
    dateKey = new Date(date.toISOString().split('T')[0])
  } else if (period === 'monthly') {
    dateKey = new Date(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01`)
  } else {
    dateKey = new Date('1970-01-01') // Epoch for lifetime
  }

  const usage = await prisma.usageMetric.findUnique({
    where: {
      userId_metric_period_date: {
        userId,
        metric,
        period,
        date: dateKey,
      },
    },
  })

  return usage?.value || 0
}

/**
 * Record usage for a metric
 */
export async function recordUsage(
  userId: string,
  metric: string,
  period: 'daily' | 'monthly' | 'lifetime' = 'daily',
  increment = 1
): Promise<void> {
  const date = new Date()
  let dateKey: Date

  if (period === 'daily') {
    dateKey = new Date(date.toISOString().split('T')[0])
  } else if (period === 'monthly') {
    dateKey = new Date(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01`)
  } else {
    dateKey = new Date('1970-01-01')
  }

  await prisma.usageMetric.upsert({
    where: {
      userId_metric_period_date: {
        userId,
        metric,
        period,
        date: dateKey,
      },
    },
    update: {
      value: { increment },
    },
    create: {
      userId,
      metric,
      period,
      date: dateKey,
      value: increment,
    },
  })
}

/**
 * Check if user can access a feature
 */
export async function checkFeatureAccess(
  userId: string,
  feature: Feature
): Promise<{
  allowed: boolean
  limit?: number
  current?: number
  remaining?: number
  tier: Tier
  requiresUpgrade?: boolean
}> {
  const tier = await getUserTier(userId)
  const limit = TIER_LIMITS[tier][feature]

  // For boolean features
  if (typeof limit === 'boolean') {
    return {
      allowed: limit,
      tier,
      requiresUpgrade: !limit,
    }
  }

  // For unlimited features
  if (limit === Infinity) {
    return {
      allowed: true,
      tier,
    }
  }

  // For counted features, check usage
  const metricMap: Record<string, { metric: string; period: 'daily' | 'monthly' | 'lifetime' }> = {
    favorites: { metric: 'favorites_count', period: 'lifetime' },
    comparisons_daily: { metric: 'comparisons_count', period: 'daily' },
    saved_searches: { metric: 'saved_searches_count', period: 'lifetime' },
    applications: { metric: 'applications_count', period: 'lifetime' },
    api_calls_monthly: { metric: 'api_calls_count', period: 'monthly' },
    team_members: { metric: 'team_members_count', period: 'lifetime' },
  }

  const metricConfig = metricMap[feature]
  if (!metricConfig) {
    // Unknown feature, deny access
    return {
      allowed: false,
      tier,
      requiresUpgrade: true,
    }
  }

  const current = await getCurrentUsage(userId, metricConfig.metric, metricConfig.period)

  return {
    allowed: current < limit,
    limit,
    current,
    remaining: Math.max(0, limit - current),
    tier,
    requiresUpgrade: current >= limit,
  }
}

/**
 * Check and record usage
 * Returns true if action is allowed, false if limit reached
 */
export async function checkAndRecordUsage(
  userId: string,
  feature: Feature,
  increment = 1
): Promise<{
  allowed: boolean
  message?: string
  upgradeUrl?: string
}> {
  const access = await checkFeatureAccess(userId, feature)

  if (!access.allowed) {
    const messages: Record<string, string> = {
      favorites: `You've reached your favorites limit (${access.limit}). Upgrade to Pro for unlimited favorites.`,
      comparisons_daily: `You've reached your daily comparison limit (${access.limit}). Upgrade to Pro for unlimited comparisons.`,
      saved_searches: 'Saved searches are a Pro feature. Upgrade to save your searches.',
      applications: 'Application tracking is a Pro feature. Upgrade to track your applications.',
      api_calls_monthly: `You've reached your monthly API limit (${access.limit}). Upgrade to Business for more API calls.`,
      can_write_reviews: 'Writing reviews is a Pro feature. Upgrade to share your experience.',
      can_export: 'Data export is a Pro feature. Upgrade to export your data.',
      can_access_analytics: 'Analytics is a Pro feature. Upgrade to view detailed analytics.',
      can_use_api: 'API access is a Business feature. Upgrade to use our API.',
    }

    return {
      allowed: false,
      message: messages[feature] || 'This feature requires an upgrade.',
      upgradeUrl: '/billing/upgrade',
    }
  }

  // Record usage if it's a counted feature
  if (typeof access.limit === 'number' && access.limit !== Infinity) {
    const metricMap: Record<string, { metric: string; period: 'daily' | 'monthly' | 'lifetime' }> = {
      favorites: { metric: 'favorites_count', period: 'lifetime' },
      comparisons_daily: { metric: 'comparisons_count', period: 'daily' },
      saved_searches: { metric: 'saved_searches_count', period: 'lifetime' },
      applications: { metric: 'applications_count', period: 'lifetime' },
      api_calls_monthly: { metric: 'api_calls_count', period: 'monthly' },
      team_members: { metric: 'team_members_count', period: 'lifetime' },
    }

    const metricConfig = metricMap[feature]
    if (metricConfig) {
      await recordUsage(userId, metricConfig.metric, metricConfig.period, increment)
    }
  }

  return { allowed: true }
}

/**
 * Decrement usage (for undo operations like removing a favorite)
 */
export async function decrementUsage(
  userId: string,
  feature: Feature,
  decrement = 1
): Promise<void> {
  const metricMap: Record<string, { metric: string; period: 'daily' | 'monthly' | 'lifetime' }> = {
    favorites: { metric: 'favorites_count', period: 'lifetime' },
    comparisons_daily: { metric: 'comparisons_count', period: 'daily' },
    saved_searches: { metric: 'saved_searches_count', period: 'lifetime' },
    applications: { metric: 'applications_count', period: 'lifetime' },
    api_calls_monthly: { metric: 'api_calls_count', period: 'monthly' },
    team_members: { metric: 'team_members_count', period: 'lifetime' },
  }

  const metricConfig = metricMap[feature]
  if (!metricConfig) return

  const date = new Date()
  let dateKey: Date

  if (metricConfig.period === 'daily') {
    dateKey = new Date(date.toISOString().split('T')[0])
  } else if (metricConfig.period === 'monthly') {
    dateKey = new Date(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01`)
  } else {
    dateKey = new Date('1970-01-01')
  }

  await prisma.usageMetric.updateMany({
    where: {
      userId,
      metric: metricConfig.metric,
      period: metricConfig.period,
      date: dateKey,
    },
    data: {
      value: { decrement },
    },
  })
}

/**
 * Get usage summary for user
 */
export async function getUsageSummary(userId: string) {
  const tier = await getUserTier(userId)
  const limits = TIER_LIMITS[tier]

  const usage: Record<string, { current: number; limit: number | boolean | typeof Infinity; percentage?: number }> = {}

  for (const [feature, limit] of Object.entries(limits)) {
    const access = await checkFeatureAccess(userId, feature as Feature)

    if (typeof limit === 'boolean') {
      usage[feature] = {
        current: limit ? 1 : 0,
        limit,
      }
    } else if (limit === Infinity) {
      usage[feature] = {
        current: access.current || 0,
        limit: Infinity,
      }
    } else {
      usage[feature] = {
        current: access.current || 0,
        limit,
        percentage: ((access.current || 0) / limit) * 100,
      }
    }
  }

  return {
    tier,
    usage,
  }
}
