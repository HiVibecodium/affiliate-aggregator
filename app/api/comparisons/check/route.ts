/**
 * Check Comparison Access API
 *
 * Verify user can add programs to comparison
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAndRecordUsage } from '@/lib/billing/feature-gates';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can add to comparison (with daily limit check)
    const access = await checkAndRecordUsage(user.id, 'comparisons_daily');

    if (!access.allowed) {
      return NextResponse.json({ error: access.message }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[COMPARISON_CHECK_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
