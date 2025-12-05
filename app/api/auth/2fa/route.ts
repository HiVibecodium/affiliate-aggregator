import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  enable2FA,
  verify2FASetup,
  verify2FA,
  disable2FA,
  create2FASession,
} from '@/lib/two-factor';
import { createAuditLog, AuditActions, ResourceTypes } from '@/lib/audit';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/2fa
 * Get 2FA status for current user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        twoFactorEnabled: true,
        backupCodes: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      enabled: dbUser.twoFactorEnabled,
      backupCodesRemaining: dbUser.backupCodes.length,
    });
  } catch (error) {
    console.error('2FA status error:', error);
    return NextResponse.json({ error: 'Failed to get 2FA status' }, { status: 500 });
  }
}

/**
 * POST /api/auth/2fa
 * Enable 2FA - returns secret and QR code URI
 */
export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { id: true, organizationMembers: { select: { organizationId: true } } },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { secret, backupCodes, uri } = await enable2FA(dbUser.id);

    return NextResponse.json({
      secret,
      backupCodes,
      qrCodeUri: uri,
      message: 'Scan the QR code with your authenticator app, then verify with a code',
    });
  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to enable 2FA' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/2fa
 * Verify and activate 2FA OR verify 2FA during login
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, action } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        id: true,
        twoFactorEnabled: true,
        organizationMembers: { select: { organizationId: true } },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If 2FA is not enabled yet, this is setup verification
    if (!dbUser.twoFactorEnabled && action !== 'login') {
      const isValid = await verify2FASetup(dbUser.id, code);

      if (isValid) {
        // Log audit event
        const orgId = dbUser.organizationMembers[0]?.organizationId;
        if (orgId) {
          await createAuditLog({
            organizationId: orgId,
            action: AuditActions.TWO_FACTOR_ENABLED,
            resourceType: ResourceTypes.USER,
            resourceId: dbUser.id,
            performedBy: dbUser.id,
          });
        }

        return NextResponse.json({
          success: true,
          message: '2FA has been enabled successfully',
        });
      } else {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
      }
    }

    // 2FA is enabled - this is login verification
    const isValid = await verify2FA(dbUser.id, code);

    if (isValid) {
      // Create trusted device session
      const userAgent = request.headers.get('user-agent') || undefined;
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || undefined;
      const sessionToken = await create2FASession(dbUser.id, userAgent, ip);

      return NextResponse.json({
        success: true,
        sessionToken,
        message: '2FA verification successful',
      });
    } else {
      return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 400 });
    }
  } catch (error) {
    console.error('2FA verify error:', error);
    return NextResponse.json({ error: 'Failed to verify 2FA' }, { status: 500 });
  }
}

/**
 * DELETE /api/auth/2fa
 * Disable 2FA
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Code is required to disable 2FA' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: {
        id: true,
        organizationMembers: { select: { organizationId: true } },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const success = await disable2FA(dbUser.id, code);

    if (success) {
      // Log audit event
      const orgId = dbUser.organizationMembers[0]?.organizationId;
      if (orgId) {
        await createAuditLog({
          organizationId: orgId,
          action: AuditActions.TWO_FACTOR_DISABLED,
          resourceType: ResourceTypes.USER,
          resourceId: dbUser.id,
          performedBy: dbUser.id,
        });
      }

      return NextResponse.json({
        success: true,
        message: '2FA has been disabled',
      });
    } else {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 });
  }
}
