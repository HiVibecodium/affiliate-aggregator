/**
 * Resend Client Tests
 */

// Mock resend before importing
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
  },
}));

import { isEmailConfigured, sendEmail, resend } from '@/lib/email/resend-client';
import { logger } from '@/lib/logger';

// Store original env
const originalEnv = process.env;

describe('Resend Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('isEmailConfigured', () => {
    it('returns false when RESEND_API_KEY is missing', () => {
      delete process.env.RESEND_API_KEY;
      process.env.RESEND_FROM_EMAIL = 'test@example.com';

      expect(isEmailConfigured()).toBe(false);
    });

    it('returns false when RESEND_FROM_EMAIL is missing', () => {
      process.env.RESEND_API_KEY = 'test-key';
      delete process.env.RESEND_FROM_EMAIL;

      expect(isEmailConfigured()).toBe(false);
    });

    it('returns false when both are missing', () => {
      delete process.env.RESEND_API_KEY;
      delete process.env.RESEND_FROM_EMAIL;

      expect(isEmailConfigured()).toBe(false);
    });

    it('returns true when both are configured', () => {
      process.env.RESEND_API_KEY = 'test-key';
      process.env.RESEND_FROM_EMAIL = 'test@example.com';

      expect(isEmailConfigured()).toBe(true);
    });
  });

  describe('sendEmail', () => {
    it('returns not_configured when email not configured', async () => {
      delete process.env.RESEND_API_KEY;
      delete process.env.RESEND_FROM_EMAIL;
      process.env.NODE_ENV = 'development';

      const result = await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe('not_configured');
      expect(logger.warn).toHaveBeenCalledWith('Email not configured, skipping send');
    });

    it('does not log warning in production when not configured', async () => {
      delete process.env.RESEND_API_KEY;
      delete process.env.RESEND_FROM_EMAIL;
      process.env.NODE_ENV = 'production';

      const result = await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.reason).toBe('not_configured');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('sends email when configured', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      process.env.RESEND_FROM_EMAIL = 'sender@example.com';

      const mockResult = { id: 'email-123' };
      (resend.emails.send as jest.Mock).mockResolvedValueOnce(mockResult);

      const result = await sendEmail({
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });

      expect(result.success).toBe(true);
      expect(result.result).toEqual(mockResult);
      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'sender@example.com',
        to: 'user@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });
    });

    it('uses custom from address', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      process.env.RESEND_FROM_EMAIL = 'default@example.com';

      (resend.emails.send as jest.Mock).mockResolvedValueOnce({ id: 'email-123' });

      await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      });

      expect(resend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
        })
      );
    });

    it('handles send error', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      process.env.RESEND_FROM_EMAIL = 'sender@example.com';
      process.env.NODE_ENV = 'development';

      const mockError = new Error('Send failed');
      (resend.emails.send as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
      expect(logger.error).toHaveBeenCalledWith('Failed to send email:', mockError);
    });

    it('does not log error in production', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      process.env.RESEND_FROM_EMAIL = 'sender@example.com';
      process.env.NODE_ENV = 'production';

      const mockError = new Error('Send failed');
      (resend.emails.send as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('returns not_configured when from email is empty', async () => {
      process.env.RESEND_API_KEY = 'test-key';
      process.env.RESEND_FROM_EMAIL = '';

      const result = await sendEmail({
        to: 'user@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      // isEmailConfigured returns false when RESEND_FROM_EMAIL is empty
      expect(result.success).toBe(false);
      expect(result.reason).toBe('not_configured');
    });
  });

  describe('resend instance', () => {
    it('exports resend instance', () => {
      expect(resend).toBeDefined();
      expect(resend.emails).toBeDefined();
      expect(typeof resend.emails.send).toBe('function');
    });
  });
});
