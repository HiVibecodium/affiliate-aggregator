/**
 * Reports Generation API
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateReport, exportToCSV, ReportType } from '@/lib/reporting';
import { getOrganizationContext } from '@/lib/org-middleware';

// GET - Generate report
export async function GET(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') as ReportType;
    const format = (searchParams.get('format') || 'json') as 'json' | 'csv' | 'pdf';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate report type
    const validTypes: ReportType[] = [
      'programs_overview',
      'clicks_analytics',
      'favorites_summary',
      'network_comparison',
      'category_analysis',
      'commission_trends',
    ];

    if (!reportType || !validTypes.includes(reportType)) {
      return NextResponse.json(
        {
          error: `Invalid report type. Valid types: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Parse dates
    const dateRange = {
      start: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default 30 days
      end: endDate ? new Date(endDate) : new Date(),
    };

    // Generate report title
    const titleMap: Record<ReportType, string> = {
      programs_overview: 'Programs Overview Report',
      clicks_analytics: 'Click Analytics Report',
      favorites_summary: 'Favorites Summary Report',
      network_comparison: 'Network Comparison Report',
      category_analysis: 'Category Analysis Report',
      commission_trends: 'Commission Trends Report',
    };

    const report = await generateReport({
      type: reportType,
      title: titleMap[reportType],
      dateRange,
      format: format === 'pdf' ? 'pdf' : format === 'csv' ? 'csv' : 'excel',
      organizationId: context.organization.id,
    });

    // Return in requested format
    if (format === 'csv') {
      const csv = exportToCSV(report);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${reportType}_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (format === 'json') {
      return NextResponse.json(report);
    }

    // For PDF - return JSON with indication that PDF should be generated client-side
    // (True PDF generation would require a library like puppeteer or jspdf)
    return NextResponse.json({
      ...report,
      _format: 'pdf',
      _note: 'Use client-side PDF generation with this data',
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

// POST - Generate custom report
export async function POST(request: NextRequest) {
  try {
    const context = await getOrganizationContext(request);

    if (!context.organization) {
      return NextResponse.json({ error: 'Organization required' }, { status: 401 });
    }

    const body = await request.json();
    const { type, dateRange, filters, format = 'json' } = body;

    // Validate
    const validTypes: ReportType[] = [
      'programs_overview',
      'clicks_analytics',
      'favorites_summary',
      'network_comparison',
      'category_analysis',
      'commission_trends',
    ];

    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    const report = await generateReport({
      type,
      title: `Custom ${type} Report`,
      dateRange: {
        start: new Date(dateRange?.start || Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(dateRange?.end || Date.now()),
      },
      filters,
      format,
      organizationId: context.organization.id,
    });

    if (format === 'csv') {
      const csv = exportToCSV(report);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="report_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating custom report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
