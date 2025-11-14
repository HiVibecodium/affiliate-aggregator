/**
 * Export utilities for CSV/Excel generation
 */

export interface ExportableProgram {
  id: string;
  name: string;
  network: { name: string };
  category: string;
  commissionRate: number;
  commissionType: string;
  cookieDuration: number;
  paymentThreshold: number;
}

/**
 * Export programs to CSV format
 */
export function exportProgramsToCSV(programs: ExportableProgram[], filename = 'programs') {
  // CSV headers
  const headers = [
    'Name',
    'Network',
    'Category',
    'Commission Rate',
    'Commission Type',
    'Cookie Duration (days)',
    'Payment Threshold',
  ];

  // Convert programs to CSV rows
  const rows = programs.map((program) => [
    `"${program.name.replace(/"/g, '""')}"`, // Escape quotes
    program.network.name,
    program.category || '',
    program.commissionRate || 0,
    program.commissionType || '',
    program.cookieDuration || 0,
    program.paymentThreshold || 0,
  ]);

  // Combine headers and rows
  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export programs to JSON format
 */
export function exportProgramsToJSON(programs: ExportableProgram[], filename = 'programs') {
  const json = JSON.stringify(programs, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
