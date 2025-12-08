/**
 * PDF Generator Tests
 */

import { generateProgramPDF, downloadProgramsPDF } from '@/lib/export/pdf-generator';

// Mock jsPDF
const mockAddPage = jest.fn();
const mockSetFontSize = jest.fn();
const mockText = jest.fn();
const mockSave = jest.fn();

jest.mock('jspdf', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      addPage: mockAddPage,
      setFontSize: mockSetFontSize,
      text: mockText,
      save: mockSave,
    })),
  };
});

describe('PDF Generator', () => {
  const mockPrograms = [
    {
      name: 'Amazon Associates',
      network: { name: 'Amazon' },
      commissionRate: 10,
      commissionType: 'percentage',
    },
    {
      name: 'eBay Partner Network',
      network: { name: 'eBay' },
      commissionRate: 5,
      commissionType: 'percentage',
    },
    {
      name: 'Shopify Affiliates',
      network: { name: 'Shopify' },
      commissionRate: 200,
      commissionType: 'flat',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateProgramPDF', () => {
    it('creates a PDF document', async () => {
      const doc = await generateProgramPDF(mockPrograms);

      expect(doc).toBeDefined();
    });

    it('sets title with correct font size', async () => {
      await generateProgramPDF(mockPrograms);

      expect(mockSetFontSize).toHaveBeenCalledWith(20);
      expect(mockText).toHaveBeenCalledWith('Affiliate Programs Report', 20, 20);
    });

    it('adds program entries', async () => {
      await generateProgramPDF(mockPrograms);

      // Should include program names
      expect(mockText).toHaveBeenCalledWith(
        expect.stringContaining('Amazon Associates'),
        20,
        expect.any(Number)
      );
      expect(mockText).toHaveBeenCalledWith(
        expect.stringContaining('eBay Partner Network'),
        20,
        expect.any(Number)
      );
      expect(mockText).toHaveBeenCalledWith(
        expect.stringContaining('Shopify Affiliates'),
        20,
        expect.any(Number)
      );
    });

    it('adds network information', async () => {
      await generateProgramPDF(mockPrograms);

      expect(mockText).toHaveBeenCalledWith('Network: Amazon', 25, expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('Network: eBay', 25, expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('Network: Shopify', 25, expect.any(Number));
    });

    it('adds commission information', async () => {
      await generateProgramPDF(mockPrograms);

      expect(mockText).toHaveBeenCalledWith('Commission: 10% percentage', 25, expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('Commission: 5% percentage', 25, expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('Commission: 200% flat', 25, expect.any(Number));
    });

    it('handles empty programs array', async () => {
      const doc = await generateProgramPDF([]);

      expect(doc).toBeDefined();
      expect(mockText).toHaveBeenCalledWith('Affiliate Programs Report', 20, 20);
    });

    it('handles program with null commission', async () => {
      const programsWithNull = [
        {
          name: 'Test Program',
          network: { name: 'Test Network' },
          commissionRate: null,
          commissionType: null,
        },
      ];

      const doc = await generateProgramPDF(programsWithNull);

      expect(doc).toBeDefined();
      expect(mockText).toHaveBeenCalledWith('Commission: null% null', 25, expect.any(Number));
    });

    it('numbers programs correctly', async () => {
      await generateProgramPDF(mockPrograms);

      expect(mockText).toHaveBeenCalledWith('1. Amazon Associates', 20, expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('2. eBay Partner Network', 20, expect.any(Number));
      expect(mockText).toHaveBeenCalledWith('3. Shopify Affiliates', 20, expect.any(Number));
    });

    it('adds new page when content exceeds page height', async () => {
      // Create many programs to force page break
      const manyPrograms = Array.from({ length: 50 }, (_, i) => ({
        name: `Program ${i + 1}`,
        network: { name: `Network ${i + 1}` },
        commissionRate: i + 1,
        commissionType: 'percentage',
      }));

      await generateProgramPDF(manyPrograms);

      // Should have called addPage at least once for 50 programs
      expect(mockAddPage).toHaveBeenCalled();
    });
  });

  describe('downloadProgramsPDF', () => {
    it('saves PDF with default filename', async () => {
      await downloadProgramsPDF(mockPrograms);

      expect(mockSave).toHaveBeenCalledWith('programs.pdf');
    });

    it('saves PDF with custom filename', async () => {
      await downloadProgramsPDF(mockPrograms, 'my-programs.pdf');

      expect(mockSave).toHaveBeenCalledWith('my-programs.pdf');
    });

    it('generates PDF content before saving', async () => {
      await downloadProgramsPDF(mockPrograms);

      // Should have set title before saving
      expect(mockText).toHaveBeenCalledWith('Affiliate Programs Report', 20, 20);
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
