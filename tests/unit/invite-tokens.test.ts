/**
 * Team Invite Token Utilities Tests
 */

import {
  generateInviteToken,
  createInviteUrl,
  isInviteExpired,
  getDaysRemaining,
} from '@/lib/team/invite-tokens';

describe('Invite Tokens', () => {
  const originalEnv = process.env.NEXT_PUBLIC_APP_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = originalEnv;
  });

  describe('generateInviteToken', () => {
    it('generates a token', () => {
      const token = generateInviteToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('generates a 64 character hex string', () => {
      const token = generateInviteToken();
      expect(token.length).toBe(64);
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });

    it('generates unique tokens', () => {
      const tokens = new Set<string>();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateInviteToken());
      }
      expect(tokens.size).toBe(100);
    });
  });

  describe('createInviteUrl', () => {
    it('creates URL with member and token', () => {
      const url = createInviteUrl('member123', 'token456');
      expect(url).toBe('https://example.com/invite/token456?member=member123');
    });

    it('uses localhost when env not set', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      const url = createInviteUrl('member', 'token');
      expect(url).toBe('http://localhost:3000/invite/token?member=member');
    });

    it('handles special characters in member id', () => {
      const url = createInviteUrl('member-with-dashes', 'abc123');
      expect(url).toBe('https://example.com/invite/abc123?member=member-with-dashes');
    });

    it('handles UUID member ids', () => {
      const memberId = '550e8400-e29b-41d4-a716-446655440000';
      const url = createInviteUrl(memberId, 'token');
      expect(url).toContain(memberId);
    });
  });

  describe('isInviteExpired', () => {
    it('returns false for invite created now', () => {
      const now = new Date();
      expect(isInviteExpired(now)).toBe(false);
    });

    it('returns false for invite created 6 days ago', () => {
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
      expect(isInviteExpired(sixDaysAgo)).toBe(false);
    });

    it('returns true for invite created 8 days ago', () => {
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
      expect(isInviteExpired(eightDaysAgo)).toBe(true);
    });

    it('returns true for invite created 30 days ago', () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      expect(isInviteExpired(thirtyDaysAgo)).toBe(true);
    });

    it('handles boundary case at exactly 7 days', () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setMilliseconds(sevenDaysAgo.getMilliseconds() - 1);
      expect(isInviteExpired(sevenDaysAgo)).toBe(true);
    });
  });

  describe('getDaysRemaining', () => {
    it('returns 7 for invite created now', () => {
      const now = new Date();
      const days = getDaysRemaining(now);
      expect(days).toBe(7);
    });

    it('returns 6 for invite created 1 day ago', () => {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const days = getDaysRemaining(oneDayAgo);
      expect(days).toBe(6);
    });

    it('returns 1 for invite created 6 days ago', () => {
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
      const days = getDaysRemaining(sixDaysAgo);
      expect(days).toBe(1);
    });

    it('returns 0 or negative for expired invites', () => {
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
      const days = getDaysRemaining(eightDaysAgo);
      expect(days).toBeLessThanOrEqual(0);
    });

    it('returns correct value for 3 days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const days = getDaysRemaining(threeDaysAgo);
      expect(days).toBe(4);
    });
  });
});
