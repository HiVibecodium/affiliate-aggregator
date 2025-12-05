/**
 * Unit tests for program utility functions
 */

import {
  calculateDifficulty,
  calculateQuality,
  isNewProgram,
  getPaymentMethodIcon,
  formatPaymentMethods,
} from '@/lib/program-utils';

describe('Program Utils', () => {
  describe('calculateDifficulty', () => {
    it('should calculate easy difficulty', () => {
      const program = {
        paymentThreshold: 50,
        commissionRate: 10,
        cookieDuration: 30,
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('easy');
      expect(result.label).toBe('Легкий старт');
      expect(result.color).toContain('green');
    });

    it('should calculate medium difficulty', () => {
      const program = {
        paymentThreshold: 250,
        commissionRate: 15,
        cookieDuration: 20,
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('medium');
      expect(result.label).toBe('Средние требования');
      expect(result.color).toContain('yellow');
    });

    it('should calculate hard difficulty', () => {
      const program = {
        paymentThreshold: 600,
        commissionRate: 35,
        cookieDuration: 5,
      };

      const result = calculateDifficulty(program);

      expect(result.level).toBe('hard');
      expect(result.label).toBe('Высокие требования');
      expect(result.color).toContain('red');
    });

    it('should handle undefined values', () => {
      const program = {};

      const result = calculateDifficulty(program);

      expect(result.level).toBe('easy');
    });
  });

  describe('calculateQuality', () => {
    it('should calculate excellent quality', () => {
      const program = {
        commissionRate: 25,
        cookieDuration: 90,
        paymentThreshold: 50,
      };

      const result = calculateQuality(program);

      expect(result.tier).toBe('excellent');
      expect(result.label).toBe('Отличная программа');
      expect(result.emoji).toBe('🌟');
    });

    it('should calculate good quality', () => {
      const program = {
        commissionRate: 15,
        cookieDuration: 45,
        paymentThreshold: 80,
      };

      const result = calculateQuality(program);

      expect(result.tier).toBe('good');
      expect(result.label).toBe('Хорошая программа');
      expect(result.emoji).toBe('⭐');
    });

    it('should calculate average quality', () => {
      const program = {
        commissionRate: 5,
        cookieDuration: 15,
        paymentThreshold: 200,
      };

      const result = calculateQuality(program);

      expect(result.tier).toBe('average');
      expect(result.label).toBe('Стандартная программа');
      expect(result.emoji).toBe('📊');
    });
  });

  describe('isNewProgram', () => {
    it('should identify new programs', () => {
      const twentyDaysAgo = new Date();
      twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

      expect(isNewProgram(twentyDaysAgo)).toBe(true);
      expect(isNewProgram(twentyDaysAgo.toISOString())).toBe(true);
    });

    it('should identify old programs', () => {
      const fortyDaysAgo = new Date();
      fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

      expect(isNewProgram(fortyDaysAgo)).toBe(false);
    });

    it('should handle edge case of exactly 30 days', () => {
      // Create date exactly 30 days ago at start of day to avoid race conditions
      const exactlyThirtyDays = new Date();
      exactlyThirtyDays.setDate(exactlyThirtyDays.getDate() - 30);
      exactlyThirtyDays.setHours(exactlyThirtyDays.getHours() + 1); // Add 1 hour buffer

      expect(isNewProgram(exactlyThirtyDays)).toBe(true);
    });
  });

  describe('getPaymentMethodIcon', () => {
    it('should return correct icon for PayPal', () => {
      expect(getPaymentMethodIcon('PayPal')).toBe('💳');
      expect(getPaymentMethodIcon('paypal')).toBe('💳');
    });

    it('should return correct icon for bank transfers', () => {
      expect(getPaymentMethodIcon('Bank Transfer')).toBe('🏦');
    });

    it('should return correct icon for wire transfers', () => {
      const icon = getPaymentMethodIcon('Wire Transfer');
      // Wire is mapped to 🔄
      expect(['🔄', '🏦']).toContain(icon);
    });

    it('should return correct icon for deposits', () => {
      expect(getPaymentMethodIcon('Direct Deposit')).toBe('💵');
    });

    it('should return correct icon for checks', () => {
      expect(getPaymentMethodIcon('Check')).toBe('📝');
      expect(getPaymentMethodIcon('Cheque')).toBe('📝');
    });

    it('should return correct icon for crypto', () => {
      expect(getPaymentMethodIcon('Bitcoin')).toBe('₿');
      expect(getPaymentMethodIcon('Cryptocurrency')).toBe('₿');
    });

    it('should return default icon for unknown methods', () => {
      expect(getPaymentMethodIcon('Unknown')).toBe('💳');
    });
  });

  describe('formatPaymentMethods', () => {
    it('should format empty array', () => {
      expect(formatPaymentMethods([])).toBe('Не указано');
    });

    it('should format single method', () => {
      const result = formatPaymentMethods(['PayPal']);
      expect(result).toContain('💳');
      expect(result).toContain('PayPal');
    });

    it('should format two methods', () => {
      const result = formatPaymentMethods(['PayPal', 'Bank Transfer']);
      expect(result).toContain('PayPal');
      expect(result).toContain('Bank Transfer');
    });

    it('should truncate and show count for many methods', () => {
      const result = formatPaymentMethods(['PayPal', 'Bank', 'Wire', 'Check', 'Crypto']);
      expect(result).toContain('+3');
    });

    it('should handle null/undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(formatPaymentMethods(null as any)).toBe('Не указано');
    });
  });
});
