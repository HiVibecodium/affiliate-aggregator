/**
 * Rate Limit Utility Tests
 * Tests in-memory rate limiting functionality
 */

import { checkRateLimit, RateLimitPresets } from '@/lib/rate-limit';

describe('Rate Limit Utility', () => {
  beforeEach(() => {
    // Clear rate limit store between tests
    jest.clearAllMocks();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-ip-1', { interval: 60000, uniqueTokenPerInterval: 10 });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });

    it('should track multiple requests from same identifier', () => {
      const identifier = 'test-ip-2';
      const config = { interval: 60000, uniqueTokenPerInterval: 3 };

      // First request
      const result1 = checkRateLimit(identifier, config);
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(2);

      // Second request
      const result2 = checkRateLimit(identifier, config);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(1);

      // Third request
      const result3 = checkRateLimit(identifier, config);
      expect(result3.allowed).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it('should block requests when limit exceeded', () => {
      const identifier = 'test-ip-3';
      const config = { interval: 60000, uniqueTokenPerInterval: 2 };

      // Use up the limit
      checkRateLimit(identifier, config);
      checkRateLimit(identifier, config);

      // This should be blocked
      const result = checkRateLimit(identifier, config);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after interval expires', () => {
      const identifier = 'test-ip-4';
      const config = { interval: 100, uniqueTokenPerInterval: 2 }; // 100ms interval

      // Use up limit
      checkRateLimit(identifier, config);
      checkRateLimit(identifier, config);

      // Wait for interval to expire
      return new Promise((resolve) => {
        setTimeout(() => {
          // Should allow again
          const result = checkRateLimit(identifier, config);
          expect(result.allowed).toBe(true);
          expect(result.remaining).toBe(1);
          resolve(undefined);
        }, 150);
      });
    });

    it('should handle different identifiers independently', () => {
      const config = { interval: 60000, uniqueTokenPerInterval: 2 };

      checkRateLimit('ip-1', config);
      checkRateLimit('ip-1', config);

      // ip-1 is at limit
      const result1 = checkRateLimit('ip-1', config);
      expect(result1.allowed).toBe(false);

      // ip-2 should still be allowed
      const result2 = checkRateLimit('ip-2', config);
      expect(result2.allowed).toBe(true);
    });

    it('should use default config if not provided', () => {
      const result = checkRateLimit('test-ip-5');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
      expect(result.resetTime).toBeGreaterThan(Date.now());
    });
  });

  describe('RateLimitPresets', () => {
    it('should have strict preset', () => {
      expect(RateLimitPresets.strict).toEqual({
        interval: 60000,
        uniqueTokenPerInterval: 5,
      });
    });

    it('should have standard preset', () => {
      expect(RateLimitPresets.standard).toEqual({
        interval: 60000,
        uniqueTokenPerInterval: 30,
      });
    });

    it('should have relaxed preset', () => {
      expect(RateLimitPresets.relaxed).toEqual({
        interval: 60000,
        uniqueTokenPerInterval: 100,
      });
    });

    it('should have generous preset', () => {
      expect(RateLimitPresets.generous).toEqual({
        interval: 60000,
        uniqueTokenPerInterval: 300,
      });
    });
  });

  describe('Rate limit behavior', () => {
    it('should work with strict preset', () => {
      const identifier = 'strict-test';

      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(identifier, RateLimitPresets.strict);
        expect(result.allowed).toBe(true);
      }

      // 6th request should be blocked
      const blocked = checkRateLimit(identifier, RateLimitPresets.strict);
      expect(blocked.allowed).toBe(false);
    });

    it('should work with relaxed preset', () => {
      const identifier = 'relaxed-test';

      for (let i = 0; i < 100; i++) {
        const result = checkRateLimit(identifier, RateLimitPresets.relaxed);
        expect(result.allowed).toBe(true);
      }

      // 101st request should be blocked
      const blocked = checkRateLimit(identifier, RateLimitPresets.relaxed);
      expect(blocked.allowed).toBe(false);
    });
  });
});
