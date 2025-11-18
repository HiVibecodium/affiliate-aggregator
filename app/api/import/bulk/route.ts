// API endpoint for bulk program import
// POST /api/import/bulk - Trigger bulk import
// Resolves C1: Data Starvation

import { NextRequest, NextResponse } from 'next/server';
import { executeBulkImport } from '@/lib/data-import/bulk-import';
import type { BulkImportOptions } from '@/lib/data-import/bulk-import';
import { withRateLimit, RateLimitPresets } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

async function bulkImportHandler(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as BulkImportOptions;

    logger.log('Bulk import API triggered');
    logger.log('Options:', body);

    const summary = await executeBulkImport(body);

    return NextResponse.json({
      success: true,
      summary,
      message: `Successfully imported ${summary.totalPrograms} programs across ${summary.successfulImports} networks`,
    });
  } catch (error) {
    logger.error('Bulk import API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

async function getStatsHandler() {
  try {
    const { importer } = await import('@/lib/data-import/importer');
    const stats = await importer.getImportStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error('Get import stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Apply rate limiting (strict for imports, relaxed for stats)
export const POST = withRateLimit(bulkImportHandler, RateLimitPresets.strict); // 5 req/min for imports
export const GET = withRateLimit(getStatsHandler, RateLimitPresets.relaxed); // 100 req/min for stats
