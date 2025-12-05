/**
 * Two-Factor Authentication (2FA) System
 * TOTP (Time-based One-Time Password) implementation
 */

import { createHmac, randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Constants
const TOTP_PERIOD = 30; // seconds
const TOTP_DIGITS = 6;
const BACKUP_CODES_COUNT = 10;
const SESSION_DURATION_DAYS = 30;

// Encryption key from environment (should be 32 bytes for AES-256)
const ENCRYPTION_KEY = process.env.TWO_FACTOR_ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Generate a random base32 secret for TOTP
 */
export function generateTOTPSecret(): string {
  const buffer = randomBytes(20);
  return base32Encode(buffer);
}

/**
 * Generate TOTP code from secret
 */
export function generateTOTP(secret: string, timestamp?: number): string {
  const time = Math.floor((timestamp || Date.now()) / 1000 / TOTP_PERIOD);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(time));

  const decodedSecret = base32Decode(secret);
  const hmac = createHmac('sha1', decodedSecret);
  hmac.update(timeBuffer);
  const hash = hmac.digest();

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, TOTP_DIGITS);
  return otp.toString().padStart(TOTP_DIGITS, '0');
}

/**
 * Verify TOTP code (allows 1 period drift)
 */
export function verifyTOTP(secret: string, code: string): boolean {
  const now = Date.now();

  // Check current and adjacent time periods
  for (let i = -1; i <= 1; i++) {
    const timestamp = now + i * TOTP_PERIOD * 1000;
    const expected = generateTOTP(secret, timestamp);
    if (expected === code) {
      return true;
    }
  }

  return false;
}

/**
 * Generate backup codes
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < BACKUP_CODES_COUNT; i++) {
    const code = randomBytes(4).toString('hex').toUpperCase();
    // Format: XXXX-XXXX
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
  }
  return codes;
}

/**
 * Simple encryption for storing secrets
 */
export function encryptSecret(secret: string): string {
  const cipher = require('crypto').createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypt stored secret
 */
export function decryptSecret(encrypted: string): string {
  const decipher = require('crypto').createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Generate QR code URL for authenticator apps
 */
export function generateTOTPUri(
  secret: string,
  email: string,
  issuer: string = 'AffiliateAggregator'
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(email);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=${TOTP_DIGITS}&period=${TOTP_PERIOD}`;
}

/**
 * Enable 2FA for a user
 */
export async function enable2FA(
  userId: string
): Promise<{ secret: string; backupCodes: string[]; uri: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, twoFactorEnabled: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.twoFactorEnabled) {
    throw new Error('2FA is already enabled');
  }

  const secret = generateTOTPSecret();
  const backupCodes = generateBackupCodes();
  const uri = generateTOTPUri(secret, user.email);

  // Store encrypted secret and backup codes
  await prisma.user.update({
    where: { id: userId },
    data: {
      twoFactorSecret: encryptSecret(secret),
      backupCodes: backupCodes.map(encryptSecret),
      // Don't enable yet - user must verify first
    },
  });

  logger.info('2FA setup initiated', { userId });

  return { secret, backupCodes, uri };
}

/**
 * Verify and activate 2FA
 */
export async function verify2FASetup(userId: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user || !user.twoFactorSecret) {
    throw new Error('2FA setup not initiated');
  }

  if (user.twoFactorEnabled) {
    throw new Error('2FA is already enabled');
  }

  const secret = decryptSecret(user.twoFactorSecret);
  const isValid = verifyTOTP(secret, code);

  if (isValid) {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    logger.info('2FA enabled successfully', { userId });
  }

  return isValid;
}

/**
 * Verify 2FA code during login
 */
export async function verify2FA(userId: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true, backupCodes: true },
  });

  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    return false;
  }

  // First try TOTP
  const secret = decryptSecret(user.twoFactorSecret);
  if (verifyTOTP(secret, code)) {
    return true;
  }

  // Then try backup codes
  const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const formattedCode = `${normalizedCode.slice(0, 4)}-${normalizedCode.slice(4)}`;

  for (let i = 0; i < user.backupCodes.length; i++) {
    const backupCode = decryptSecret(user.backupCodes[i]);
    if (backupCode === formattedCode) {
      // Remove used backup code
      const newBackupCodes = [...user.backupCodes];
      newBackupCodes.splice(i, 1);
      await prisma.user.update({
        where: { id: userId },
        data: { backupCodes: newBackupCodes },
      });
      logger.info('Backup code used', { userId, remainingCodes: newBackupCodes.length });
      return true;
    }
  }

  return false;
}

/**
 * Disable 2FA
 */
export async function disable2FA(userId: string, code: string): Promise<boolean> {
  const isValid = await verify2FA(userId, code);

  if (isValid) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: [],
      },
    });
    logger.info('2FA disabled', { userId });
    return true;
  }

  return false;
}

/**
 * Create a 2FA session (trusted device)
 */
export async function create2FASession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.twoFactorSession.create({
    data: {
      userId,
      token,
      expiresAt,
      userAgent,
      ipAddress,
    },
  });

  return token;
}

/**
 * Verify 2FA session token
 */
export async function verify2FASession(userId: string, token: string): Promise<boolean> {
  const session = await prisma.twoFactorSession.findFirst({
    where: {
      userId,
      token,
      expiresAt: { gt: new Date() },
    },
  });

  return !!session;
}

/**
 * Cleanup expired sessions
 */
export async function cleanup2FASessions(): Promise<number> {
  const result = await prisma.twoFactorSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  return result.count;
}

// Base32 encoding/decoding helpers
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanedInput = encoded.replace(/=+$/, '').toUpperCase();
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < cleanedInput.length; i++) {
    const idx = alphabet.indexOf(cleanedInput[i]);
    if (idx === -1) continue;

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}
