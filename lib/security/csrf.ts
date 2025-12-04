import { logger } from '@/lib/logger';
/**
 * CSRF Token Management
 * Provides protection against Cross-Site Request Forgery attacks
 */

import { randomBytes, createHmac } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  const timestamp = Date.now();

  // Create HMAC signature
  const hmac = createHmac('sha256', CSRF_SECRET);
  hmac.update(`${token}:${timestamp}`);
  const signature = hmac.digest('hex');

  // Combine token, timestamp, and signature
  const tokenData = `${token}:${timestamp}:${signature}`;
  return Buffer.from(tokenData).toString('base64');
}

/**
 * Verify CSRF token validity
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [tokenValue, timestampStr, signature] = decoded.split(':');

    if (!tokenValue || !timestampStr || !signature) {
      return false;
    }

    const timestamp = parseInt(timestampStr, 10);

    // Check token age (max 1 hour)
    const tokenAge = Date.now() - timestamp;
    if (tokenAge > 3600000) {
      return false;
    }

    // Verify signature
    const hmac = createHmac('sha256', CSRF_SECRET);
    hmac.update(`${tokenValue}:${timestamp}`);
    const expectedSignature = hmac.digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    logger.error('CSRF token verification error:', error);
    return false;
  }
}

/**
 * Set CSRF token in cookie
 */
export async function setCSRFCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600, // 1 hour
    path: '/',
  });
}

/**
 * Get CSRF token from cookie
 */
export async function getCSRFToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value;
}

/**
 * Validate CSRF token from request
 */
export async function validateCSRFToken(requestToken: string): Promise<boolean> {
  const cookieToken = await getCSRFToken();

  if (!cookieToken || !requestToken) {
    return false;
  }

  // Verify both tokens match and are valid
  return cookieToken === requestToken && verifyCSRFToken(requestToken);
}

/**
 * Middleware to check CSRF token for state-changing operations
 */
export async function requireCSRFToken(requestToken: string | null): Promise<void> {
  if (!requestToken) {
    throw new Error('CSRF token missing');
  }

  const isValid = await validateCSRFToken(requestToken);
  if (!isValid) {
    throw new Error('Invalid CSRF token');
  }
}
