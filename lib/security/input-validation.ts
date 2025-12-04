import { logger } from '@/lib/logger';
/**
 * Input Validation Utilities
 * Provides validation and sanitization functions to prevent injection attacks
 */

import { z } from 'zod';

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Reject javascript: and data: protocols
    if (['javascript:', 'data:', 'vbscript:'].includes(parsed.protocol)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize SQL input (though we use Prisma which handles this)
 */
export function sanitizeSQL(input: string): string {
  // Remove potentially dangerous SQL characters
  return input.replace(/['";\\]/g, '');
}

/**
 * Validate and sanitize search query
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 100): string {
  // Trim and limit length
  let sanitized = query.trim().substring(0, maxLength);

  // Remove special characters that could be used in attacks
  sanitized = sanitized.replace(/[<>{}]/g, '');

  return sanitized;
}

/**
 * Validate pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * Validate and sanitize pagination params
 */
export function validatePagination(params: unknown): PaginationParams {
  return paginationSchema.parse(params);
}

/**
 * Validate ID parameter (UUID or numeric)
 */
export function isValidId(id: string): boolean {
  // Check if UUID
  const uuidSchema = z.string().uuid();
  if (uuidSchema.safeParse(id).success) {
    return true;
  }

  // Check if numeric ID
  const numericSchema = z.string().regex(/^\d+$/);
  return numericSchema.safeParse(id).success;
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and other dangerous characters
  return filename
    .replace(/[\/\\]/g, '')
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Validate JSON input
 */
export function isValidJSON(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limit key sanitization
 */
export function sanitizeRateLimitKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9._:-]/g, '_');
}

/**
 * Common input schemas
 */
export const schemas = {
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/),
  url: z.string().url().max(2048),
  text: z.string().max(5000),
  shortText: z.string().max(255),
};

/**
 * Validate against common injection patterns
 */
export function detectInjectionAttempt(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /data:text\/html/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize user input for display
 */
export function sanitizeUserInput(input: string): string {
  // Check for injection attempts
  if (detectInjectionAttempt(input)) {
    logger.warn('Potential injection attempt detected:', input.substring(0, 50));
    return '';
  }

  // Sanitize HTML
  return sanitizeHTML(input);
}
