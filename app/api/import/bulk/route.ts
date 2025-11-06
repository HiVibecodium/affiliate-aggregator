// API endpoint for bulk program import
// POST /api/import/bulk - Trigger bulk import
// Resolves C1: Data Starvation

import { NextRequest, NextResponse } from 'next/server';
import { executeBulkImport } from '@/lib/data-import/bulk-import';
import type { BulkImportOptions } from '@/lib/data-import/bulk-import';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as BulkImportOptions;

    console.log('Bulk import API triggered');
    console.log('Options:', body);

    const summary = await executeBulkImport(body);

    return NextResponse.json({
      success: true,
      summary,
      message: `Successfully imported ${summary.totalPrograms} programs across ${summary.successfulImports} networks`,
    });
  } catch (error) {
    console.error('Bulk import API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { importer } = await import('@/lib/data-import/importer');
    const stats = await importer.getImportStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get import stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
