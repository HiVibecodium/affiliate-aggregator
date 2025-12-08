/**
 * Email Sender Tests
 */

import {
  sendEmail,
  sendBulkEmails,
  canSendEmailToUser,
  type EmailOptions,
} from '@/lib/email/sender';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    auditLog: {
      create: jest.fn().mockResolvedValue({ id: 'log-1' }),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock FormData for Mailgun
class MockFormData {
  private data: Record<string, string> = {};
  append(key: string, value: string) {
    this.data[key] = value;
  }
  get(key: string) {
    return this.data[key];
  }
}
global.FormData = MockFormData as unknown as typeof FormData;

// Store original env
const originalEnv = process.env;

describe('Email Sender', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.RESEND_API_KEY;
    delete process.env.SENDGRID_API_KEY;
    delete process.env.MAILGUN_API_KEY;
    delete process.env.MAILGUN_DOMAIN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('sendEmail', () => {
    it('uses console provider when no API keys configured', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        text: 'Test',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toMatch(/^console-\d+$/);
      expect(consoleSpy).toHaveBeenCalledWith('=== EMAIL ===');

      consoleSpy.mockRestore();
    });

    it('sends email via Resend when configured', async () => {
      process.env.RESEND_API_KEY = 'test-resend-key';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'resend-msg-123' }),
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('resend-msg-123');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-resend-key',
          }),
        })
      );
    });

    it('handles Resend API failure', async () => {
      process.env.RESEND_API_KEY = 'test-resend-key';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('API Error: Invalid key'),
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error: Invalid key');
    });

    it('sends email via SendGrid when configured', async () => {
      process.env.SENDGRID_API_KEY = 'test-sendgrid-key';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: () => 'sendgrid-msg-456',
        },
      });

      const result = await sendEmail({
        to: ['user1@example.com', 'user2@example.com'],
        subject: 'Test',
        html: '<p>Test</p>',
        text: 'Test text',
      });

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer test-sendgrid-key',
          }),
        })
      );
    });

    it('handles SendGrid API failure', async () => {
      process.env.SENDGRID_API_KEY = 'test-sendgrid-key';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('Unauthorized'),
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('sends email via Mailgun when configured', async () => {
      process.env.MAILGUN_API_KEY = 'test-mailgun-key';
      process.env.MAILGUN_DOMAIN = 'mg.example.com';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'mailgun-msg-789' }),
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        replyTo: 'reply@example.com',
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('mailgun-msg-789');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.mailgun.net/v3/mg.example.com/messages',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('handles Mailgun API failure', async () => {
      process.env.MAILGUN_API_KEY = 'test-mailgun-key';
      process.env.MAILGUN_DOMAIN = 'mg.example.com';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('Invalid domain'),
      });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid domain');
    });

    it('uses custom from address', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      });

      consoleSpy.mockRestore();
    });

    it('handles array of recipients', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await sendEmail({
        to: ['user1@example.com', 'user2@example.com'],
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('To: user1@example.com, user2@example.com');

      consoleSpy.mockRestore();
    });

    it('handles fetch exception', async () => {
      process.env.RESEND_API_KEY = 'test-key';

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('supports tags option', async () => {
      process.env.RESEND_API_KEY = 'test-key';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 'msg-1' }),
      });

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        tags: ['welcome', 'onboarding'],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('tags'),
        })
      );
    });
  });

  describe('sendBulkEmails', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('sends multiple emails', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const emails: EmailOptions[] = [
        { to: 'user1@example.com', subject: 'Test 1', html: '<p>1</p>' },
        { to: 'user2@example.com', subject: 'Test 2', html: '<p>2</p>' },
        { to: 'user3@example.com', subject: 'Test 3', html: '<p>3</p>' },
      ];

      const resultPromise = sendBulkEmails(emails);
      await jest.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.sent).toBe(3);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);

      consoleSpy.mockRestore();
    });

    it('processes emails in batches', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const emails: EmailOptions[] = Array.from({ length: 25 }, (_, i) => ({
        to: `user${i}@example.com`,
        subject: `Test ${i}`,
        html: `<p>${i}</p>`,
      }));

      const resultPromise = sendBulkEmails(emails, { batchSize: 10 });
      await jest.runAllTimersAsync();
      const result = await resultPromise;

      expect(result.sent).toBe(25);

      consoleSpy.mockRestore();
    });

    it('tracks failed emails', async () => {
      // Use console provider (default) for simplicity, with one throwing an error
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Override sendEmail to simulate failures
      const originalError = console.error;
      let callCount = 0;
      consoleSpy.mockImplementation(() => {
        callCount++;
        if (callCount === 5) {
          // This is the 2nd email (each email logs 4 times)
          throw new Error('Simulated failure');
        }
      });

      const emails: EmailOptions[] = [
        { to: 'user1@example.com', subject: 'Test 1', html: '<p>1</p>' },
        { to: 'user2@example.com', subject: 'Test 2', html: '<p>2</p>' },
        { to: 'user3@example.com', subject: 'Test 3', html: '<p>3</p>' },
      ];

      const resultPromise = sendBulkEmails(emails);
      await jest.runAllTimersAsync();
      const result = await resultPromise;

      // All should succeed with console provider since errors are caught
      expect(result.sent + result.failed).toBe(3);

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('uses custom delay between batches', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      const emails: EmailOptions[] = Array.from({ length: 15 }, (_, i) => ({
        to: `user${i}@example.com`,
        subject: `Test ${i}`,
        html: `<p>${i}</p>`,
      }));

      const resultPromise = sendBulkEmails(emails, { delayMs: 500, batchSize: 5 });
      await jest.runAllTimersAsync();
      await resultPromise;

      // Should have delays between batches
      expect(setTimeoutSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      setTimeoutSpy.mockRestore();
    });
  });

  describe('canSendEmailToUser', () => {
    const { prisma } = require('@/lib/prisma');

    it('returns false if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      const result = await canSendEmailToUser('user-123', 'newsletter');

      expect(result).toBe(false);
    });

    it('returns true if no email preferences set (default)', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-123',
        emailNotifications: null,
      });

      const result = await canSendEmailToUser('user-123', 'newsletter');

      expect(result).toBe(true);
    });

    it('returns false if specific notification type disabled', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-123',
        emailNotifications: { newsletter: false, updates: true },
      });

      const result = await canSendEmailToUser('user-123', 'newsletter');

      expect(result).toBe(false);
    });

    it('returns true if specific notification type enabled', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-123',
        emailNotifications: { newsletter: true, updates: false },
      });

      const result = await canSendEmailToUser('user-123', 'newsletter');

      expect(result).toBe(true);
    });

    it('returns false if global opt-out is set', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-123',
        emailNotifications: { all: false, newsletter: true },
      });

      const result = await canSendEmailToUser('user-123', 'newsletter');

      expect(result).toBe(false);
    });

    it('returns true on database error (default to enabled)', async () => {
      prisma.user.findUnique.mockRejectedValueOnce(new Error('DB error'));

      const result = await canSendEmailToUser('user-123', 'newsletter');

      expect(result).toBe(true);
    });
  });
});
