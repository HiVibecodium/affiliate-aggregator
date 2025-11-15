/**
 * Utility functions for program analysis and badging
 */

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type QualityTier = 'excellent' | 'good' | 'average';

/**
 * Calculate program difficulty based on requirements
 */
export function calculateDifficulty(program: {
  paymentThreshold?: number;
  commissionRate?: number;
  cookieDuration?: number;
}): { level: DifficultyLevel; label: string; color: string } {
  let score = 0;

  // High payment threshold = harder
  if (program.paymentThreshold && program.paymentThreshold > 500) score += 2;
  else if (program.paymentThreshold && program.paymentThreshold > 200) score += 1;

  // Very high commission might mean competitive/selective
  if (program.commissionRate && program.commissionRate > 30) score += 1;

  // Short cookie = harder to convert
  if (program.cookieDuration && program.cookieDuration < 7) score += 1;

  if (score >= 3) {
    return {
      level: 'hard',
      label: 'Высокие требования',
      color: 'bg-red-100 text-red-700',
    };
  } else if (score >= 1) {
    return {
      level: 'medium',
      label: 'Средние требования',
      color: 'bg-yellow-100 text-yellow-700',
    };
  } else {
    return {
      level: 'easy',
      label: 'Легкий старт',
      color: 'bg-green-100 text-green-700',
    };
  }
}

/**
 * Calculate program quality tier
 */
export function calculateQuality(program: {
  commissionRate?: number;
  cookieDuration?: number;
  paymentThreshold?: number;
}): { tier: QualityTier; label: string; emoji: string } {
  let score = 0;

  // Good commission rate
  if (program.commissionRate && program.commissionRate >= 20) score += 2;
  else if (program.commissionRate && program.commissionRate >= 10) score += 1;

  // Long cookie duration
  if (program.cookieDuration && program.cookieDuration >= 60) score += 2;
  else if (program.cookieDuration && program.cookieDuration >= 30) score += 1;

  // Reasonable payout threshold
  if (program.paymentThreshold && program.paymentThreshold <= 100) score += 1;

  if (score >= 4) {
    return { tier: 'excellent', label: 'Отличная программа', emoji: '🌟' };
  } else if (score >= 2) {
    return { tier: 'good', label: 'Хорошая программа', emoji: '⭐' };
  } else {
    return { tier: 'average', label: 'Стандартная программа', emoji: '📊' };
  }
}

/**
 * Check if program is new (added in last 30 days)
 */
export function isNewProgram(createdAt: string | Date): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = now.getTime() - created.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}

/**
 * Get payment method icon
 */
export function getPaymentMethodIcon(method: string): string {
  const methodLower = method.toLowerCase();

  if (methodLower.includes('paypal')) return '💳';
  if (methodLower.includes('bank') || methodLower.includes('transfer')) return '🏦';
  if (methodLower.includes('direct') || methodLower.includes('deposit')) return '💵';
  if (methodLower.includes('wire')) return '🔄';
  if (methodLower.includes('check') || methodLower.includes('cheque')) return '📝';
  if (methodLower.includes('payoneer')) return '💰';
  if (methodLower.includes('crypto') || methodLower.includes('bitcoin')) return '₿';
  if (methodLower.includes('stripe')) return '💸';

  return '💳'; // Default
}

/**
 * Format payment methods for display
 */
export function formatPaymentMethods(methods: string[]): string {
  if (!methods || methods.length === 0) return 'Не указано';

  if (methods.length <= 2) {
    return methods.map((m) => `${getPaymentMethodIcon(m)} ${m}`).join(', ');
  }

  const first = methods.slice(0, 2);
  const remaining = methods.length - 2;
  return `${first.map((m) => `${getPaymentMethodIcon(m)} ${m}`).join(', ')} +${remaining}`;
}
