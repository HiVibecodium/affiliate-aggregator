/**
 * Unit tests for CSRF protection
 */

import { generateCSRFToken, verifyCSRFToken } from '@/lib/security/csrf';

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

describe('CSRF Protection', () => {
  describe('generateCSRFToken', () => {
    it('should generate a valid token', () => {
      const token = generateCSRFToken();
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      expect(token1).not.toBe(token2);
    });

    it('should generate base64 encoded tokens', () => {
      const token = generateCSRFToken();
      // Base64 pattern check
      expect(/^[A-Za-z0-9+/=]+$/.test(token)).toBe(true);
    });
  });

  describe('verifyCSRFToken', () => {
    it('should verify a valid token', () => {
      const token = generateCSRFToken();
      const isValid = verifyCSRFToken(token);
      expect(isValid).toBe(true);
    });

    it('should reject invalid token format', () => {
      const isValid = verifyCSRFToken('invalid-token');
      expect(isValid).toBe(false);
    });

    it('should reject empty token', () => {
      const isValid = verifyCSRFToken('');
      expect(isValid).toBe(false);
    });

    it('should reject malformed base64', () => {
      const isValid = verifyCSRFToken('not!valid!base64!');
      expect(isValid).toBe(false);
    });

    it('should reject token with wrong signature', () => {
      const token = generateCSRFToken();
      // Corrupt the token
      const corrupted = token.substring(0, token.length - 5) + 'XXXXX';
      const isValid = verifyCSRFToken(corrupted);
      expect(isValid).toBe(false);
    });

    it('should reject expired token', () => {
      // Create a token with old timestamp manually
      const oldTimestamp = Date.now() - 7200000; // 2 hours ago
      const fakeToken = Buffer.from(`abc123:${oldTimestamp}:fake-signature`).toString('base64');
      const isValid = verifyCSRFToken(fakeToken);
      expect(isValid).toBe(false);
    });
  });

  describe('Token lifecycle', () => {
    it('should generate and verify token successfully', () => {
      const token = generateCSRFToken();
      expect(verifyCSRFToken(token)).toBe(true);
    });

    it('should handle multiple tokens independently', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();

      expect(verifyCSRFToken(token1)).toBe(true);
      expect(verifyCSRFToken(token2)).toBe(true);
    });
  });
});
