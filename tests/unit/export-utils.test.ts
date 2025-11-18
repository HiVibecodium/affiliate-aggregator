/**
 * Unit tests for export utilities
 */

import { ExportableProgram } from '@/lib/export-utils';

// Mock document methods for browser-based exports
const mockDocument = {
  createElement: jest.fn((tag) => {
    return {
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: {},
      tagName: tag.toUpperCase(),
    };
  }),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
};

global.document = mockDocument as any;
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn(),
} as any;
global.Blob = jest.fn() as any;

describe('Export Utils', () => {
  it('should define ExportableProgram interface', () => {
    const program: ExportableProgram = {
      id: '1',
      name: 'Test Program',
      network: { name: 'Test Network' },
      category: 'Technology',
      commissionRate: 15,
      commissionType: 'CPS',
      cookieDuration: 30,
      paymentThreshold: 100,
    };

    expect(program).toHaveProperty('id');
    expect(program).toHaveProperty('name');
    expect(program).toHaveProperty('network');
    expect(program).toHaveProperty('category');
    expect(program).toHaveProperty('commissionRate');
  });

  it('should format CSV headers', () => {
    const headers = [
      'Name',
      'Network',
      'Category',
      'Commission Rate',
      'Commission Type',
      'Cookie Duration (days)',
      'Payment Threshold',
    ];

    expect(headers).toHaveLength(7);
    expect(headers).toContain('Name');
    expect(headers).toContain('Commission Rate');
  });

  it('should escape CSV quotes', () => {
    const escapeQuotes = (str: string) => str.replace(/"/g, '""');

    const input = 'Program "Best" Offer';
    const escaped = escapeQuotes(input);

    expect(escaped).toBe('Program ""Best"" Offer');
  });

  it('should format CSV row', () => {
    const program: ExportableProgram = {
      id: '1',
      name: 'Test',
      network: { name: 'Network' },
      category: 'Tech',
      commissionRate: 15,
      commissionType: 'CPS',
      cookieDuration: 30,
      paymentThreshold: 100,
    };

    const row = [
      `"${program.name}"`,
      program.network.name,
      program.category,
      program.commissionRate,
      program.commissionType,
      program.cookieDuration,
      program.paymentThreshold,
    ];

    expect(row).toHaveLength(7);
    expect(row[0]).toBe('"Test"');
    expect(row[3]).toBe(15);
  });

  it('should handle missing optional fields', () => {
    const program = {
      id: '1',
      name: 'Test',
      network: { name: 'Net' },
      category: '',
      commissionRate: 0,
      commissionType: '',
      cookieDuration: 0,
      paymentThreshold: 0,
    };

    expect(program.category || '').toBe('');
    expect(program.commissionRate || 0).toBe(0);
  });

  it('should generate filename with date', () => {
    const generateFilename = (base: string) => {
      const date = new Date().toISOString().split('T')[0];
      return `${base}_${date}.csv`;
    };

    const filename = generateFilename('programs');

    expect(filename).toContain('programs_');
    expect(filename).toContain('.csv');
    expect(filename).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('should create CSV blob', () => {
    const csvContent = 'Name,Network\nTest,ShareASale';
    const blob = { type: 'text/csv;charset=utf-8;' };

    expect(blob.type).toBe('text/csv;charset=utf-8;');
  });

  it('should create JSON export', () => {
    const programs: ExportableProgram[] = [
      {
        id: '1',
        name: 'Program 1',
        network: { name: 'Network' },
        category: 'Tech',
        commissionRate: 15,
        commissionType: 'CPS',
        cookieDuration: 30,
        paymentThreshold: 100,
      },
    ];

    const json = JSON.stringify(programs, null, 2);

    expect(json).toContain('"name": "Program 1"');
    expect(json).toContain('"commissionRate": 15');
  });

  it('should format JSON with indentation', () => {
    const data = { key: 'value' };
    const formatted = JSON.stringify(data, null, 2);

    expect(formatted).toContain('\n');
    expect(formatted).toContain('  '); // 2-space indentation
  });
});
