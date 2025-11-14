/**
 * CSV Parser Unit Tests
 * Tests CSV parsing logic without database dependencies
 */

import { parse } from 'csv-parse/sync';

describe('CSV Parser - Parsing Logic', () => {
  describe('Basic CSV parsing', () => {
    it('should parse valid CSV with all columns', () => {
      const csvContent = `networkName,externalId,name,description,category,commissionRate
ShareASale,12345,Test Program,Great program,E-commerce,5.5
CJ Affiliate,67890,Another Program,Another one,Fashion,7.0`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      expect(records).toHaveLength(2);
      expect(records[0]).toMatchObject({
        networkName: 'ShareASale',
        externalId: '12345',
        name: 'Test Program',
        description: 'Great program',
      });
      expect(records[1].networkName).toBe('CJ Affiliate');
    });

    it('should trim whitespace from values', () => {
      const csvContent = `networkName,externalId,name
  ShareASale  ,  12345  ,  Test Program  `;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      expect(records[0].externalId).toBe('12345');
      expect(records[0].name).toBe('Test Program');
    });

    it('should handle empty lines correctly', () => {
      const csvContent = `networkName,externalId,name
ShareASale,12345,Test Program

ShareASale,12346,Another Program`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      expect(records).toHaveLength(2);
    });

    it('should parse CSV with quoted values', () => {
      const csvContent = `networkName,externalId,name,paymentMethods
ShareASale,12345,Test Program,"PayPal,Bank Transfer,Wire"`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      expect(records[0].paymentMethods).toBe('PayPal,Bank Transfer,Wire');
    });
  });

  describe('Numeric value parsing', () => {
    it('should parse numeric values with custom cast', () => {
      const csvContent = `networkName,externalId,name,commissionRate,cookieDuration
ShareASale,12345,Test Program,5.5,30`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          if (context.column === 'commissionRate' || context.column === 'cookieDuration') {
            const num = parseFloat(value);
            return isNaN(num) ? null : num;
          }
          return value;
        },
      });

      expect(records[0].commissionRate).toBe(5.5);
      expect(records[0].cookieDuration).toBe(30);
      expect(typeof records[0].commissionRate).toBe('number');
    });

    it('should handle invalid numeric values', () => {
      const csvContent = `networkName,externalId,name,commissionRate
ShareASale,12345,Test Program,invalid`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          if (context.column === 'commissionRate') {
            const num = parseFloat(value);
            return isNaN(num) ? null : num;
          }
          return value;
        },
      });

      expect(records[0].commissionRate).toBeNull();
    });
  });

  describe('Data transformation', () => {
    it('should split comma-separated payment methods', () => {
      const paymentMethodsString = 'PayPal,Bank Transfer,Wire Transfer';
      const methods = paymentMethodsString.split(',').map(m => m.trim());

      expect(methods).toEqual(['PayPal', 'Bank Transfer', 'Wire Transfer']);
      expect(methods).toHaveLength(3);
    });

    it('should handle single payment method', () => {
      const paymentMethodsString = 'PayPal';
      const methods = paymentMethodsString.split(',').map(m => m.trim());

      expect(methods).toEqual(['PayPal']);
      expect(methods).toHaveLength(1);
    });

    it('should group records by network', () => {
      const records = [
        { networkName: 'ShareASale', externalId: '1', name: 'Prog 1' },
        { networkName: 'CJ Affiliate', externalId: '2', name: 'Prog 2' },
        { networkName: 'ShareASale', externalId: '3', name: 'Prog 3' },
      ];

      const grouped = new Map<string, typeof records>();
      for (const record of records) {
        if (!grouped.has(record.networkName)) {
          grouped.set(record.networkName, []);
        }
        grouped.get(record.networkName)!.push(record);
      }

      expect(grouped.size).toBe(2);
      expect(grouped.get('ShareASale')).toHaveLength(2);
      expect(grouped.get('CJ Affiliate')).toHaveLength(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle CSV with only headers', () => {
      const csvContent = `networkName,externalId,name`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      expect(records).toHaveLength(0);
    });

    it('should handle CSV with missing optional fields', () => {
      const csvContent = `networkName,externalId,name,description
ShareASale,12345,Test Program,`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      expect(records[0].description).toBe('');
    });

    it('should handle CSV with special characters in values', () => {
      const csvContent = `networkName,externalId,name
ShareASale,12345,"Test & Demo Program (Beta)"`;

      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      expect(records[0].name).toBe('Test & Demo Program (Beta)');
    });
  });
});
