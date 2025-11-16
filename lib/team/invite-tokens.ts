/**
 * Team Invite Token Utilities
 *
 * Generate and verify secure invite tokens
 */

import crypto from 'crypto';

const TOKEN_EXPIRY_DAYS = 7;

/**
 * Generate secure invite token
 */
export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create invite URL with token
 */
export function createInviteUrl(memberId: string, token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/invite/${token}?member=${memberId}`;
}

/**
 * Check if invite is expired
 */
export function isInviteExpired(invitedAt: Date): boolean {
  const expiryDate = new Date(invitedAt);
  expiryDate.setDate(expiryDate.getDate() + TOKEN_EXPIRY_DAYS);
  return new Date() > expiryDate;
}

/**
 * Calculate days remaining for invite
 */
export function getDaysRemaining(invitedAt: Date): number {
  const expiryDate = new Date(invitedAt);
  expiryDate.setDate(expiryDate.getDate() + TOKEN_EXPIRY_DAYS);
  const diff = expiryDate.getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
