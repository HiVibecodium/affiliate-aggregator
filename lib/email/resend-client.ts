import { logger } from '@/lib/logger';
/**
 * Resend Email Client
 *
 * Centralized email sending with Resend
 */

import { Resend } from 'resend';

// Allow build without Resend key
const resendKey = process.env.RESEND_API_KEY || 'placeholder';

export const resend = new Resend(resendKey);

/**
 * Check if email system is configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

/**
 * Send email with error handling
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Email not configured, skipping send');
    }
    return { success: false, reason: 'not_configured' };
  }

  try {
    const result = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to,
      subject,
      html,
    });

    return { success: true, result };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.error('Failed to send email:', error);
    }
    return { success: false, error };
  }
}
