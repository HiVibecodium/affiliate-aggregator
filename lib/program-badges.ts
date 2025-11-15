/**
 * Program Badge Utilities
 *
 * Calculate and display program badges (difficulty, quality, new status)
 */

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface DifficultyBadge {
  level: DifficultyLevel
  label: string
  color: string
  bgColor: string
  description: string
}

/**
 * Calculate program difficulty based on various factors
 */
export function calculateDifficulty(program: {
  paymentThreshold?: number | null
  commissionRate?: number | null
  cookieDuration?: number | null
  category?: string | null
}): DifficultyBadge {
  let score = 0

  // High payment threshold = harder
  if (program.paymentThreshold) {
    if (program.paymentThreshold > 500) score += 3
    else if (program.paymentThreshold > 200) score += 2
    else if (program.paymentThreshold > 50) score += 1
  }

  // High commission = more competitive = harder
  if (program.commissionRate) {
    if (program.commissionRate > 30) score += 2
    else if (program.commissionRate > 20) score += 1
  }

  // Short cookie = harder to convert
  if (program.cookieDuration) {
    if (program.cookieDuration < 7) score += 2
    else if (program.cookieDuration < 30) score += 1
  }

  // Competitive categories
  const competitiveCategories = ['Finance', 'Insurance', 'Credit Cards', 'Web Hosting']
  if (program.category && competitiveCategories.includes(program.category)) {
    score += 1
  }

  // Determine difficulty level
  if (score >= 6) {
    return {
      level: 'hard',
      label: 'Hard',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      description: 'High requirements, competitive niche',
    }
  } else if (score >= 3) {
    return {
      level: 'medium',
      label: 'Medium',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      description: 'Moderate requirements',
    }
  } else {
    return {
      level: 'easy',
      label: 'Easy',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Low requirements, beginner friendly',
    }
  }
}

/**
 * Check if program is new (created in last 30 days)
 */
export function isNewProgram(createdAt: Date): boolean {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return new Date(createdAt) > thirtyDaysAgo
}

/**
 * Format payment methods for display
 */
export function formatPaymentMethods(methods: string[]): string {
  if (!methods || methods.length === 0) return 'Not specified'

  const icons: Record<string, string> = {
    PayPal: '💳',
    'Wire Transfer': '🏦',
    'Direct Deposit': '💰',
    Payoneer: '💵',
    Check: '📝',
    ACH: '🏛️',
    Cryptocurrency: '₿',
  }

  return methods
    .slice(0, 3)
    .map((method) => icons[method] || '💳')
    .join(' ')
}

/**
 * Format cookie duration for display
 */
export function formatCookieDuration(days: number | null | undefined): string {
  if (!days) return 'N/A'
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  if (days === 30) return '30 days'
  if (days === 60) return '60 days'
  if (days === 90) return '90 days'
  if (days >= 365) return '1 year+'
  return `${days} days`
}

/**
 * Format commission rate for display
 */
export function formatCommissionRate(
  rate: number | null | undefined,
  type: string | null | undefined
): string {
  if (!rate) return 'N/A'

  const typeLabel = type ? ` (${type})` : ''
  return `${rate.toFixed(1)}%${typeLabel}`
}

/**
 * Format payment threshold for display
 */
export function formatPaymentThreshold(threshold: number | null | undefined): string {
  if (!threshold) return 'No minimum'
  return `$${threshold.toFixed(0)}`
}

/**
 * Get quality badge based on program data
 */
export function getQualityBadge(program: {
  commissionRate?: number | null
  cookieDuration?: number | null
  paymentThreshold?: number | null
}): { show: boolean; label: string; color: string } | null {
  // High quality if:
  // - High commission (>15%)
  // - Long cookie (>60 days)
  // - Low threshold (<$100)

  const hasHighCommission = (program.commissionRate || 0) > 15
  const hasLongCookie = (program.cookieDuration || 0) > 60
  const hasLowThreshold = (program.paymentThreshold || 1000) < 100

  const qualityScore = [hasHighCommission, hasLongCookie, hasLowThreshold].filter(Boolean).length

  if (qualityScore >= 2) {
    return {
      show: true,
      label: 'High Quality',
      color: 'bg-purple-100 text-purple-700',
    }
  }

  return null
}
