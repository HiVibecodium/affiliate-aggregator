/**
 * Email Sender Service
 * Handles email delivery with multiple provider support
 */

import { prisma } from '@/lib/prisma';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

type EmailProvider = 'resend' | 'sendgrid' | 'mailgun' | 'console';

/**
 * Get configured email provider
 */
function getEmailProvider(): EmailProvider {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SENDGRID_API_KEY) return 'sendgrid';
  if (process.env.MAILGUN_API_KEY) return 'mailgun';
  return 'console';
}

/**
 * Send email using Resend
 */
async function sendWithResend(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: options.from || process.env.EMAIL_FROM || 'noreply@affiliateaggregator.com',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      tags: options.tags?.map((tag) => ({ name: tag, value: 'true' })),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  const data = await response.json();
  return { success: true, messageId: data.id };
}

/**
 * Send email using SendGrid
 */
async function sendWithSendGrid(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SENDGRID_API_KEY not configured');

  const recipients = Array.isArray(options.to) ? options.to : [options.to];

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: recipients.map((email) => ({ email })) }],
      from: { email: options.from || process.env.EMAIL_FROM || 'noreply@affiliateaggregator.com' },
      subject: options.subject,
      content: [
        { type: 'text/plain', value: options.text || '' },
        { type: 'text/html', value: options.html },
      ],
      reply_to: options.replyTo ? { email: options.replyTo } : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true, messageId: response.headers.get('x-message-id') || undefined };
}

/**
 * Send email using Mailgun
 */
async function sendWithMailgun(options: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) throw new Error('MAILGUN_API_KEY or MAILGUN_DOMAIN not configured');

  const formData = new FormData();
  formData.append('from', options.from || process.env.EMAIL_FROM || `noreply@${domain}`);
  formData.append('to', Array.isArray(options.to) ? options.to.join(',') : options.to);
  formData.append('subject', options.subject);
  formData.append('html', options.html);
  if (options.text) formData.append('text', options.text);
  if (options.replyTo) formData.append('h:Reply-To', options.replyTo);

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  const data = await response.json();
  return { success: true, messageId: data.id };
}

/**
 * Console logger for development
 */
function sendToConsole(options: EmailOptions): EmailResult {
  console.log('=== EMAIL ===');
  console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Text: ${options.text?.substring(0, 200)}...`);
  console.log('=============');
  return { success: true, messageId: `console-${Date.now()}` };
}

/**
 * Send email using configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const provider = getEmailProvider();

  try {
    let result: EmailResult;

    switch (provider) {
      case 'resend':
        result = await sendWithResend(options);
        break;
      case 'sendgrid':
        result = await sendWithSendGrid(options);
        break;
      case 'mailgun':
        result = await sendWithMailgun(options);
        break;
      case 'console':
      default:
        result = sendToConsole(options);
    }

    // Log email to database
    await logEmailSent(options, result, provider);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email send error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Log sent email to database for tracking
 */
async function logEmailSent(
  options: EmailOptions,
  result: EmailResult,
  provider: string
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: 'email.sent',
        resourceType: 'email',
        resourceId: result.messageId || 'unknown',
        performedBy: 'system',
        details: {
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          provider,
          success: result.success,
          error: result.error,
          tags: options.tags,
        },
      },
    });
  } catch {
    // Silently fail logging
    console.error('Failed to log email');
  }
}

/**
 * Send bulk emails with rate limiting
 */
export async function sendBulkEmails(
  emails: EmailOptions[],
  options?: { delayMs?: number; batchSize?: number }
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const delayMs = options?.delayMs || 100;
  const batchSize = options?.batchSize || 10;

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (email) => {
        const result = await sendEmail(email);
        if (result.success) {
          sent++;
        } else {
          failed++;
          if (result.error) errors.push(result.error);
        }
      })
    );

    // Rate limiting delay between batches
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return { sent, failed, errors };
}

/**
 * Check if user has email notifications enabled
 */
export async function canSendEmailToUser(
  userId: string,
  notificationType: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailNotifications: true },
    });

    if (!user) return false;

    const prefs = user.emailNotifications as Record<string, boolean> | null;
    if (!prefs) return true; // Default to enabled

    // Check specific notification type
    if (prefs[notificationType] === false) return false;

    // Check global opt-out
    if (prefs.all === false) return false;

    return true;
  } catch {
    return true; // Default to enabled on error
  }
}
