/**
 * Analytics Export API
 * Export analytics data in CSV or JSON format
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const format = searchParams.get('format') || 'csv';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '12m':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch all clicks in the range
    const clicks = await prisma.programClick.findMany({
      where: {
        clickedAt: { gte: startDate },
      },
      select: {
        id: true,
        programId: true,
        clickedAt: true,
        program: {
          select: {
            name: true,
            category: true,
            commissionRate: true,
            network: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { clickedAt: 'desc' },
    });

    // Prepare export data
    const exportData = clicks.map((click) => ({
      date: click.clickedAt.toISOString(),
      programId: click.programId,
      programName: click.program?.name || 'Unknown',
      network: click.program?.network?.name || 'Unknown',
      category: click.program?.category || 'Unknown',
      commissionRate: click.program?.commissionRate || 0,
    }));

    // Calculate summary
    const summary = {
      totalClicks: clicks.length,
      uniquePrograms: new Set(clicks.map((c) => c.programId)).size,
      dateRange: { start: startDate.toISOString(), end: now.toISOString() },
      exportedAt: new Date().toISOString(),
    };

    if (format === 'json') {
      return NextResponse.json(
        { summary, data: exportData },
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="analytics-${range}.json"`,
          },
        }
      );
    }

    // Generate CSV
    const headers = [
      'Date',
      'Program ID',
      'Program Name',
      'Network',
      'Category',
      'Commission Rate',
    ];
    const csvRows = [
      headers.join(','),
      ...exportData.map((row) =>
        [
          row.date,
          row.programId,
          `"${row.programName.replace(/"/g, '""')}"`,
          `"${row.network.replace(/"/g, '""')}"`,
          `"${row.category.replace(/"/g, '""')}"`,
          row.commissionRate,
        ].join(',')
      ),
    ];

    // Add summary rows at the end
    csvRows.push('');
    csvRows.push('Summary');
    csvRows.push(`Total Clicks,${summary.totalClicks}`);
    csvRows.push(`Unique Programs,${summary.uniquePrograms}`);
    csvRows.push(`Date Range,"${summary.dateRange.start} to ${summary.dateRange.end}"`);
    csvRows.push(`Exported At,${summary.exportedAt}`);

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-${range}.csv"`,
      },
    });
  } catch (error) {
    console.error('Analytics export API error:', error);
    return NextResponse.json({ error: 'Failed to export analytics' }, { status: 500 });
  }
}
