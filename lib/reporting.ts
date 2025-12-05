/**
 * Reporting System
 * Generate PDF and Excel reports for analytics data
 */

import { prisma } from '@/lib/prisma';

// Report types
export type ReportType =
  | 'programs_overview'
  | 'clicks_analytics'
  | 'favorites_summary'
  | 'network_comparison'
  | 'category_analysis'
  | 'commission_trends';

export interface ReportConfig {
  type: ReportType;
  title: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, unknown>;
  format: 'pdf' | 'excel' | 'csv';
  organizationId: string;
}

export interface ReportData {
  title: string;
  generatedAt: Date;
  dateRange: { start: string; end: string };
  sections: ReportSection[];
  summary: ReportSummary;
}

export interface ReportSection {
  title: string;
  type: 'table' | 'chart' | 'text' | 'metric';
  data: unknown;
}

export interface ReportSummary {
  totalRecords: number;
  keyMetrics: { label: string; value: string | number }[];
  insights: string[];
}

/**
 * Generate report data based on type
 */
export async function generateReport(config: ReportConfig): Promise<ReportData> {
  switch (config.type) {
    case 'programs_overview':
      return generateProgramsOverviewReport(config);
    case 'clicks_analytics':
      return generateClicksAnalyticsReport(config);
    case 'favorites_summary':
      return generateFavoritesSummaryReport(config);
    case 'network_comparison':
      return generateNetworkComparisonReport(config);
    case 'category_analysis':
      return generateCategoryAnalysisReport(config);
    case 'commission_trends':
      return generateCommissionTrendsReport(config);
    default:
      throw new Error(`Unknown report type: ${config.type}`);
  }
}

/**
 * Programs Overview Report
 */
async function generateProgramsOverviewReport(config: ReportConfig): Promise<ReportData> {
  const programs = await prisma.affiliateProgram.findMany({
    where: {
      createdAt: {
        gte: config.dateRange.start,
        lte: config.dateRange.end,
      },
    },
    include: {
      network: { select: { name: true } },
      _count: { select: { reviews: true, clicks: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const totalPrograms = await prisma.affiliateProgram.count();
  const avgCommission = await prisma.affiliateProgram.aggregate({
    _avg: { commissionRate: true },
  });

  // Category breakdown
  const categoryBreakdown = await prisma.affiliateProgram.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // Network breakdown
  const networkBreakdown = await prisma.affiliateProgram.groupBy({
    by: ['networkId'],
    _count: { id: true },
  });

  const networks = await prisma.affiliateNetwork.findMany({
    select: { id: true, name: true },
  });

  const networkMap = new Map(networks.map((n) => [n.id, n.name]));

  return {
    title: config.title,
    generatedAt: new Date(),
    dateRange: {
      start: config.dateRange.start.toISOString(),
      end: config.dateRange.end.toISOString(),
    },
    sections: [
      {
        title: 'Programs List',
        type: 'table',
        data: programs.map((p) => ({
          name: p.name,
          network: p.network.name,
          category: p.category,
          commission: `${p.commissionRate}%`,
          type: p.commissionType,
          reviews: p._count.reviews,
          clicks: p._count.clicks,
        })),
      },
      {
        title: 'Category Distribution',
        type: 'chart',
        data: categoryBreakdown.map((c) => ({
          category: c.category || 'Unknown',
          count: c._count.id,
        })),
      },
      {
        title: 'Network Distribution',
        type: 'chart',
        data: networkBreakdown.map((n) => ({
          network: networkMap.get(n.networkId) || 'Unknown',
          count: n._count.id,
        })),
      },
    ],
    summary: {
      totalRecords: programs.length,
      keyMetrics: [
        { label: 'Total Programs', value: totalPrograms },
        {
          label: 'Average Commission',
          value: `${(avgCommission._avg.commissionRate || 0).toFixed(1)}%`,
        },
        { label: 'Categories', value: categoryBreakdown.length },
        { label: 'Networks', value: networks.length },
      ],
      insights: [
        `Top category: ${categoryBreakdown[0]?.category || 'N/A'} with ${categoryBreakdown[0]?._count.id || 0} programs`,
        `Average commission rate is ${(avgCommission._avg.commissionRate || 0).toFixed(1)}%`,
      ],
    },
  };
}

/**
 * Clicks Analytics Report
 */
async function generateClicksAnalyticsReport(config: ReportConfig): Promise<ReportData> {
  const clicks = await prisma.programClick.findMany({
    where: {
      clickedAt: {
        gte: config.dateRange.start,
        lte: config.dateRange.end,
      },
    },
    include: {
      program: { select: { name: true, category: true } },
    },
    orderBy: { clickedAt: 'desc' },
    take: 500,
  });

  // Daily click counts
  const dailyClicks = clicks.reduce(
    (acc, click) => {
      const date = click.clickedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Top programs by clicks
  const programClicks = clicks.reduce(
    (acc, click) => {
      const name = click.program.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topPrograms = Object.entries(programClicks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return {
    title: config.title,
    generatedAt: new Date(),
    dateRange: {
      start: config.dateRange.start.toISOString(),
      end: config.dateRange.end.toISOString(),
    },
    sections: [
      {
        title: 'Daily Click Trend',
        type: 'chart',
        data: Object.entries(dailyClicks).map(([date, count]) => ({ date, clicks: count })),
      },
      {
        title: 'Top Programs by Clicks',
        type: 'table',
        data: topPrograms.map(([name, count]) => ({ program: name, clicks: count })),
      },
    ],
    summary: {
      totalRecords: clicks.length,
      keyMetrics: [
        { label: 'Total Clicks', value: clicks.length },
        { label: 'Unique Programs', value: Object.keys(programClicks).length },
        {
          label: 'Daily Average',
          value: Math.round(clicks.length / Object.keys(dailyClicks).length) || 0,
        },
      ],
      insights: [
        topPrograms[0]
          ? `Most clicked program: ${topPrograms[0][0]} (${topPrograms[0][1]} clicks)`
          : 'No click data',
      ],
    },
  };
}

/**
 * Favorites Summary Report
 */
async function generateFavoritesSummaryReport(config: ReportConfig): Promise<ReportData> {
  const favorites = await prisma.favorite.findMany({
    where: {
      createdAt: {
        gte: config.dateRange.start,
        lte: config.dateRange.end,
      },
    },
    include: {
      program: { select: { name: true, category: true, commissionRate: true } },
    },
  });

  // Group by category
  const categoryFavorites = favorites.reduce(
    (acc, fav) => {
      const category = fav.program.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    title: config.title,
    generatedAt: new Date(),
    dateRange: {
      start: config.dateRange.start.toISOString(),
      end: config.dateRange.end.toISOString(),
    },
    sections: [
      {
        title: 'Favorites by Category',
        type: 'chart',
        data: Object.entries(categoryFavorites).map(([category, count]) => ({ category, count })),
      },
      {
        title: 'Favorited Programs',
        type: 'table',
        data: favorites.map((f) => ({
          program: f.program.name,
          category: f.program.category,
          commission: `${f.program.commissionRate}%`,
          addedAt: f.createdAt.toISOString(),
        })),
      },
    ],
    summary: {
      totalRecords: favorites.length,
      keyMetrics: [
        { label: 'Total Favorites', value: favorites.length },
        { label: 'Categories', value: Object.keys(categoryFavorites).length },
      ],
      insights: [],
    },
  };
}

/**
 * Network Comparison Report
 */
async function generateNetworkComparisonReport(config: ReportConfig): Promise<ReportData> {
  const networks = await prisma.affiliateNetwork.findMany({
    include: {
      _count: { select: { programs: true } },
      programs: {
        select: { commissionRate: true, commissionType: true },
      },
    },
  });

  const networkStats = networks.map((network) => {
    const avgCommission =
      network.programs.length > 0
        ? network.programs.reduce((sum, p) => sum + (p.commissionRate || 0), 0) /
          network.programs.length
        : 0;

    const commissionTypes = network.programs.reduce(
      (acc, p) => {
        const type = p.commissionType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      name: network.name,
      programs: network._count.programs,
      avgCommission: avgCommission.toFixed(1),
      primaryType: Object.entries(commissionTypes).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A',
    };
  });

  return {
    title: config.title,
    generatedAt: new Date(),
    dateRange: {
      start: config.dateRange.start.toISOString(),
      end: config.dateRange.end.toISOString(),
    },
    sections: [
      {
        title: 'Network Comparison',
        type: 'table',
        data: networkStats,
      },
      {
        title: 'Programs per Network',
        type: 'chart',
        data: networkStats.map((n) => ({ network: n.name, programs: n.programs })),
      },
    ],
    summary: {
      totalRecords: networks.length,
      keyMetrics: [
        { label: 'Total Networks', value: networks.length },
        { label: 'Total Programs', value: networkStats.reduce((sum, n) => sum + n.programs, 0) },
      ],
      insights:
        networkStats.length > 0
          ? [`Largest network: ${networkStats.sort((a, b) => b.programs - a.programs)[0].name}`]
          : [],
    },
  };
}

/**
 * Category Analysis Report
 */
async function generateCategoryAnalysisReport(config: ReportConfig): Promise<ReportData> {
  const categoryStats = await prisma.affiliateProgram.groupBy({
    by: ['category'],
    _count: { id: true },
    _avg: { commissionRate: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return {
    title: config.title,
    generatedAt: new Date(),
    dateRange: {
      start: config.dateRange.start.toISOString(),
      end: config.dateRange.end.toISOString(),
    },
    sections: [
      {
        title: 'Category Statistics',
        type: 'table',
        data: categoryStats.map((c) => ({
          category: c.category || 'Unknown',
          programs: c._count.id,
          avgCommission: `${(c._avg.commissionRate || 0).toFixed(1)}%`,
        })),
      },
      {
        title: 'Programs by Category',
        type: 'chart',
        data: categoryStats.slice(0, 15).map((c) => ({
          category: c.category || 'Unknown',
          count: c._count.id,
        })),
      },
    ],
    summary: {
      totalRecords: categoryStats.length,
      keyMetrics: [
        { label: 'Total Categories', value: categoryStats.length },
        { label: 'Largest Category', value: categoryStats[0]?.category || 'N/A' },
      ],
      insights: [],
    },
  };
}

/**
 * Commission Trends Report
 */
async function generateCommissionTrendsReport(config: ReportConfig): Promise<ReportData> {
  const programs = await prisma.affiliateProgram.findMany({
    where: {
      createdAt: {
        gte: config.dateRange.start,
        lte: config.dateRange.end,
      },
    },
    select: {
      commissionRate: true,
      commissionType: true,
      category: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Commission by type
  const byType = programs.reduce(
    (acc, p) => {
      const type = p.commissionType || 'Unknown';
      acc[type] = acc[type] || { count: 0, total: 0 };
      acc[type].count++;
      acc[type].total += p.commissionRate || 0;
      return acc;
    },
    {} as Record<string, { count: number; total: number }>
  );

  const typeStats = Object.entries(byType).map(([type, stats]) => ({
    type,
    count: stats.count,
    avgCommission: (stats.total / stats.count).toFixed(1),
  }));

  // Commission distribution
  const distribution = {
    '0-10%': programs.filter((p) => (p.commissionRate || 0) <= 10).length,
    '11-25%': programs.filter((p) => (p.commissionRate || 0) > 10 && (p.commissionRate || 0) <= 25)
      .length,
    '26-50%': programs.filter((p) => (p.commissionRate || 0) > 25 && (p.commissionRate || 0) <= 50)
      .length,
    '51-75%': programs.filter((p) => (p.commissionRate || 0) > 50 && (p.commissionRate || 0) <= 75)
      .length,
    '76-100%': programs.filter((p) => (p.commissionRate || 0) > 75).length,
  };

  return {
    title: config.title,
    generatedAt: new Date(),
    dateRange: {
      start: config.dateRange.start.toISOString(),
      end: config.dateRange.end.toISOString(),
    },
    sections: [
      {
        title: 'Commission by Type',
        type: 'table',
        data: typeStats,
      },
      {
        title: 'Commission Distribution',
        type: 'chart',
        data: Object.entries(distribution).map(([range, count]) => ({ range, count })),
      },
    ],
    summary: {
      totalRecords: programs.length,
      keyMetrics: [
        { label: 'Programs Analyzed', value: programs.length },
        { label: 'Commission Types', value: Object.keys(byType).length },
      ],
      insights: [],
    },
  };
}

/**
 * Export report to CSV format
 */
export function exportToCSV(report: ReportData): string {
  const lines: string[] = [];

  // Header
  lines.push(`"${report.title}"`);
  lines.push(`"Generated: ${report.generatedAt.toISOString()}"`);
  lines.push(`"Date Range: ${report.dateRange.start} to ${report.dateRange.end}"`);
  lines.push('');

  // Summary
  lines.push('"Summary"');
  lines.push(`"Total Records",${report.summary.totalRecords}`);
  for (const metric of report.summary.keyMetrics) {
    lines.push(`"${metric.label}","${metric.value}"`);
  }
  lines.push('');

  // Sections
  for (const section of report.sections) {
    lines.push(`"${section.title}"`);

    if (section.type === 'table' && Array.isArray(section.data)) {
      const data = section.data as Record<string, unknown>[];
      if (data.length > 0) {
        // Headers
        const headers = Object.keys(data[0]);
        lines.push(headers.map((h) => `"${h}"`).join(','));

        // Rows
        for (const row of data) {
          lines.push(headers.map((h) => `"${row[h]}"`).join(','));
        }
      }
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export report to JSON format
 */
export function exportToJSON(report: ReportData): string {
  return JSON.stringify(report, null, 2);
}
