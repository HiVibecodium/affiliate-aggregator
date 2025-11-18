/**
 * Unit tests for program badge utilities
 */

import {
  calculateDifficulty,
  isNewProgram,
  formatPaymentMethods,
  formatCookieDuration,
  formatCommissionRate,
  formatPaymentThreshold,
  getQualityBadge,
} from '@/lib/program-badges';

describe('Program Badges', () => {
  describe('calculateDifficulty', () => {
    it('should return easy for beginner-friendly programs', () => {
      const program = {
        paymentThreshold: 25,
        commissionRate: 10,
        cookieDuration: 60,
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('easy');
      expect(result.label).toBe('Easy');
    });

    it('should return medium for moderate difficulty', () => {
      const program = {
        paymentThreshold: 250,
        commissionRate: 25,
        cookieDuration: 5,
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('medium');
      expect(result.label).toBe('Medium');
    });

    it('should return hard for high requirements', () => {
      const program = {
        paymentThreshold: 600,
        commissionRate: 35,
        cookieDuration: 5,
        category: 'Finance',
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('hard');
      expect(result.label).toBe('Hard');
    });

    it('should increase difficulty for competitive categories', () => {
      const program = {
        paymentThreshold: 100,
        commissionRate: 15,
        cookieDuration: 15,
        category: 'Finance',
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('medium');
    });

    it('should handle null values gracefully', () => {
      const program = {
        paymentThreshold: null,
        commissionRate: null,
        cookieDuration: null,
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('easy');
    });
  });

  describe('isNewProgram', () => {
    it('should return true for programs created within 30 days', () => {
      const twentyDaysAgo = new Date();
      twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

      expect(isNewProgram(twentyDaysAgo)).toBe(true);
    });

    it('should return false for programs older than 30 days', () => {
      const fortyDaysAgo = new Date();
      fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

      expect(isNewProgram(fortyDaysAgo)).toBe(false);
    });

    it('should return true for programs created today', () => {
      const today = new Date();
      expect(isNewProgram(today)).toBe(true);
    });
  });

  describe('formatPaymentMethods', () => {
    it('should format up to 3 payment methods', () => {
      const methods = ['PayPal', 'Wire Transfer', 'Direct Deposit'];
      const result = formatPaymentMethods(methods);

      expect(result).toContain('💳');
      expect(result).toContain('🏦');
      expect(result).toContain('💰');
    });

    it('should show only first 3 methods if more exist', () => {
      const methods = ['PayPal', 'Wire Transfer', 'Direct Deposit', 'Check', 'ACH'];
      const result = formatPaymentMethods(methods);

      expect(result.split(' ')).toHaveLength(3);
    });

    it('should return "Not specified" for empty array', () => {
      expect(formatPaymentMethods([])).toBe('Not specified');
    });

    it('should handle null/undefined', () => {
      expect(formatPaymentMethods(null as any)).toBe('Not specified');
    });

    it('should use default icon for unknown methods', () => {
      const methods = ['UnknownMethod'];
      const result = formatPaymentMethods(methods);

      expect(result).toContain('💳');
    });
  });

  describe('formatCookieDuration', () => {
    it('should format single day', () => {
      expect(formatCookieDuration(1)).toBe('1 day');
    });

    it('should format multiple days', () => {
      expect(formatCookieDuration(15)).toBe('15 days');
    });

    it('should format 30 days', () => {
      expect(formatCookieDuration(30)).toBe('30 days');
    });

    it('should format 60 days', () => {
      expect(formatCookieDuration(60)).toBe('60 days');
    });

    it('should format 90 days', () => {
      expect(formatCookieDuration(90)).toBe('90 days');
    });

    it('should format year+', () => {
      expect(formatCookieDuration(365)).toBe('1 year+');
      expect(formatCookieDuration(400)).toBe('1 year+');
    });

    it('should handle null/undefined', () => {
      expect(formatCookieDuration(null)).toBe('N/A');
      expect(formatCookieDuration(undefined)).toBe('N/A');
    });
  });

  describe('formatCommissionRate', () => {
    it('should format rate with one decimal', () => {
      expect(formatCommissionRate(15.5, 'CPS')).toBe('15.5% (CPS)');
    });

    it('should format rate without type', () => {
      expect(formatCommissionRate(20, null)).toBe('20.0%');
    });

    it('should handle null rate', () => {
      expect(formatCommissionRate(null, 'CPS')).toBe('N/A');
    });

    it('should round to one decimal place', () => {
      expect(formatCommissionRate(12.456, 'CPA')).toBe('12.5% (CPA)');
    });
  });

  describe('formatPaymentThreshold', () => {
    it('should format threshold as dollar amount', () => {
      expect(formatPaymentThreshold(100)).toBe('$100');
    });

    it('should round to nearest dollar', () => {
      expect(formatPaymentThreshold(99.99)).toBe('$100');
    });

    it('should return "No minimum" for null', () => {
      expect(formatPaymentThreshold(null)).toBe('No minimum');
    });
  });

  describe('getQualityBadge', () => {
    it('should return high quality badge for excellent programs', () => {
      const program = {
        commissionRate: 20,
        cookieDuration: 90,
        paymentThreshold: 50,
      };

      const result = getQualityBadge(program);

      expect(result).not.toBeNull();
      expect(result?.label).toBe('High Quality');
      expect(result?.color).toBe('bg-purple-100 text-purple-700');
    });

    it('should return null for low quality programs', () => {
      const program = {
        commissionRate: 5,
        cookieDuration: 7,
        paymentThreshold: 500,
      };

      const result = getQualityBadge(program);

      expect(result).toBeNull();
    });

    it('should require at least 2 quality factors', () => {
      const program = {
        commissionRate: 20, // high
        cookieDuration: 15, // not high
        paymentThreshold: 500, // not low
      };

      const result = getQualityBadge(program);

      expect(result).toBeNull();
    });

    it('should handle null values', () => {
      const program = {
        commissionRate: null,
        cookieDuration: null,
        paymentThreshold: null,
      };

      const result = getQualityBadge(program);

      expect(result).toBeNull();
    });
  });
});
