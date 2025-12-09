/**
 * SEO Metadata Generators Tests
 */

import {
  defaultMetadata,
  generateProgramMetadata,
  generateProgramStructuredData,
  generateCategoryMetadata,
  generateNetworkMetadata,
  generateCompareMetadata,
  generateSearchMetadata,
} from '@/lib/seo/metadata';

describe('SEO Metadata Generators', () => {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://affiliate-aggregator-five.vercel.app';

  describe('defaultMetadata', () => {
    it('has correct title configuration', () => {
      expect(defaultMetadata.title).toEqual({
        default: 'Affiliate Aggregator',
        template: '%s | Affiliate Aggregator',
      });
    });

    it('has description', () => {
      expect(defaultMetadata.description).toBeDefined();
      expect(defaultMetadata.description).toContain('партнёрских программ');
    });

    it('has keywords array', () => {
      expect(Array.isArray(defaultMetadata.keywords)).toBe(true);
      expect(defaultMetadata.keywords).toContain('affiliate programs');
      expect(defaultMetadata.keywords).toContain('CPA');
    });

    it('has OpenGraph configuration', () => {
      expect(defaultMetadata.openGraph).toBeDefined();
      expect(defaultMetadata.openGraph?.type).toBe('website');
      expect(defaultMetadata.openGraph?.locale).toBe('ru_RU');
      expect(defaultMetadata.openGraph?.siteName).toBe('Affiliate Aggregator');
    });

    it('has Twitter card configuration', () => {
      expect(defaultMetadata.twitter).toBeDefined();
      expect(defaultMetadata.twitter?.card).toBe('summary_large_image');
    });

    it('has robots configuration', () => {
      expect(defaultMetadata.robots).toBeDefined();
      expect(defaultMetadata.robots).toHaveProperty('index', true);
      expect(defaultMetadata.robots).toHaveProperty('follow', true);
    });

    it('has Google verification', () => {
      expect(defaultMetadata.verification?.google).toBeDefined();
    });
  });

  describe('generateProgramMetadata', () => {
    const mockProgram = {
      id: 'prog-123',
      name: 'Amazon Associates',
      description: 'Best affiliate program for products',
      network: { name: 'Amazon' },
      commissionRate: 10,
      commissionType: 'CPS',
      category: 'E-commerce',
    };

    it('generates correct title', () => {
      const metadata = generateProgramMetadata(mockProgram);

      expect(metadata.title).toBe('Amazon Associates - Amazon');
    });

    it('uses program description when available', () => {
      const metadata = generateProgramMetadata(mockProgram);

      expect(metadata.description).toBe('Best affiliate program for products');
    });

    it('generates fallback description when null', () => {
      const programNoDesc = { ...mockProgram, description: null };
      const metadata = generateProgramMetadata(programNoDesc);

      expect(metadata.description).toContain('Amazon Associates');
      expect(metadata.description).toContain('партнёрская программа');
      expect(metadata.description).toContain('10%');
    });

    it('includes OpenGraph metadata', () => {
      const metadata = generateProgramMetadata(mockProgram);

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe('Amazon Associates - Amazon');
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.url).toBe(`${APP_URL}/programs/prog-123`);
    });

    it('generates dynamic OG image URL', () => {
      const metadata = generateProgramMetadata(mockProgram);

      const images = metadata.openGraph?.images as Array<{ url: string }>;
      expect(images).toBeDefined();
      expect(images[0].url).toContain('/api/og?');
      expect(images[0].url).toContain('title=Amazon+Associates');
      expect(images[0].url).toContain('network=Amazon');
    });

    it('includes Twitter card metadata', () => {
      const metadata = generateProgramMetadata(mockProgram);

      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter?.card).toBe('summary_large_image');
    });

    it('handles missing optional fields', () => {
      const minimalProgram = {
        id: '456',
        name: 'Test Program',
        description: null,
        network: { name: 'TestNet' },
        commissionRate: null,
        commissionType: null,
        category: null,
      };

      const metadata = generateProgramMetadata(minimalProgram);

      expect(metadata.title).toBe('Test Program - TestNet');
      expect(metadata.description).toBeDefined();
    });
  });

  describe('generateProgramStructuredData', () => {
    const mockProgram = {
      id: 'prog-789',
      name: 'ShareASale Program',
      description: 'Top affiliate program',
      network: { name: 'ShareASale', website: 'https://shareasale.com' },
      commissionRate: 15,
      commissionType: 'CPA',
      category: 'Finance',
    };

    it('generates valid JSON-LD structure', () => {
      const schema = generateProgramStructuredData(mockProgram);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
    });

    it('includes correct product info', () => {
      const schema = generateProgramStructuredData(mockProgram);

      expect(schema.name).toBe('ShareASale Program');
      expect(schema.description).toBe('Top affiliate program');
      expect(schema.category).toBe('Finance');
    });

    it('includes brand organization', () => {
      const schema = generateProgramStructuredData(mockProgram);

      expect(schema.brand['@type']).toBe('Organization');
      expect(schema.brand.name).toBe('ShareASale');
      expect(schema.brand.url).toBe('https://shareasale.com');
    });

    it('includes offers with commission', () => {
      const schema = generateProgramStructuredData(mockProgram);

      expect(schema.offers['@type']).toBe('Offer');
      expect(schema.offers.price).toBe('0');
      expect(schema.offers.priceCurrency).toBe('USD');
      expect(schema.offers.description).toContain('15%');
      expect(schema.offers.description).toContain('CPA');
    });

    it('generates correct URL', () => {
      const schema = generateProgramStructuredData(mockProgram);

      expect(schema.url).toBe(`${APP_URL}/programs/prog-789`);
    });

    it('handles null description', () => {
      const programNoDesc = { ...mockProgram, description: null };
      const schema = generateProgramStructuredData(programNoDesc);

      expect(schema.description).toContain('ShareASale Program');
      expect(schema.description).toContain('affiliate program');
    });

    it('handles null category', () => {
      const programNoCategory = { ...mockProgram, category: null };
      const schema = generateProgramStructuredData(programNoCategory);

      expect(schema.category).toBe('Affiliate Program');
    });
  });

  describe('generateCategoryMetadata', () => {
    const mockCategory = {
      name: 'Finance',
      slug: 'finance',
      programCount: 250,
    };

    it('generates correct title', () => {
      const metadata = generateCategoryMetadata(mockCategory);

      expect(metadata.title).toBe('Finance Affiliate Programs');
    });

    it('generates description with program count', () => {
      const metadata = generateCategoryMetadata(mockCategory);

      expect(metadata.description).toContain('250');
      expect(metadata.description).toContain('Finance');
    });

    it('uses custom description when provided', () => {
      const categoryWithDesc = {
        ...mockCategory,
        description: 'Custom finance description',
      };
      const metadata = generateCategoryMetadata(categoryWithDesc);

      expect(metadata.description).toBe('Custom finance description');
    });

    it('includes correct OpenGraph URL', () => {
      const metadata = generateCategoryMetadata(mockCategory);

      expect(metadata.openGraph?.url).toBe(`${APP_URL}/categories/finance`);
    });

    it('generates OG image with category info', () => {
      const metadata = generateCategoryMetadata(mockCategory);

      const images = metadata.openGraph?.images as Array<{ url: string }>;
      expect(images[0].url).toContain('category=Finance');
    });
  });

  describe('generateNetworkMetadata', () => {
    const mockNetwork = {
      name: 'ShareASale',
      slug: 'shareasale',
      programCount: 500,
    };

    it('generates correct title', () => {
      const metadata = generateNetworkMetadata(mockNetwork);

      expect(metadata.title).toBe('ShareASale - Affiliate Network');
    });

    it('generates description with program count', () => {
      const metadata = generateNetworkMetadata(mockNetwork);

      expect(metadata.description).toContain('500');
      expect(metadata.description).toContain('ShareASale');
    });

    it('uses custom description when provided', () => {
      const networkWithDesc = {
        ...mockNetwork,
        description: 'Leading affiliate network',
      };
      const metadata = generateNetworkMetadata(networkWithDesc);

      expect(metadata.description).toBe('Leading affiliate network');
    });

    it('handles null description', () => {
      const networkNullDesc = {
        ...mockNetwork,
        description: null,
      };
      const metadata = generateNetworkMetadata(networkNullDesc);

      expect(metadata.description).toContain('ShareASale');
    });

    it('includes correct OpenGraph URL', () => {
      const metadata = generateNetworkMetadata(mockNetwork);

      expect(metadata.openGraph?.url).toBe(`${APP_URL}/networks/shareasale`);
    });
  });

  describe('generateCompareMetadata', () => {
    it('generates title with program names', () => {
      const programs = [{ name: 'Program A' }, { name: 'Program B' }, { name: 'Program C' }];
      const metadata = generateCompareMetadata(programs);

      expect(metadata.title).toBe('Compare: Program A vs Program B vs Program C');
    });

    it('limits title to 3 programs', () => {
      const programs = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }];
      const metadata = generateCompareMetadata(programs);

      expect(metadata.title).toBe('Compare: A vs B vs C');
      expect(metadata.description).toContain('5 affiliate programs');
    });

    it('sets noindex for dynamic pages', () => {
      const programs = [{ name: 'A' }, { name: 'B' }];
      const metadata = generateCompareMetadata(programs);

      expect(metadata.robots).toHaveProperty('index', false);
      expect(metadata.robots).toHaveProperty('follow', true);
    });

    it('includes comparison description', () => {
      const programs = [{ name: 'Test' }];
      const metadata = generateCompareMetadata(programs);

      expect(metadata.description).toContain('Side-by-side comparison');
      expect(metadata.description).toContain('commission rates');
    });
  });

  describe('generateSearchMetadata', () => {
    it('generates title with query', () => {
      const metadata = generateSearchMetadata('amazon', 150);

      expect(metadata.title).toBe('Search: amazon');
    });

    it('generates title without query', () => {
      const metadata = generateSearchMetadata('', 0);

      expect(metadata.title).toBe('Search Affiliate Programs');
    });

    it('includes result count in description', () => {
      const metadata = generateSearchMetadata('test', 42);

      expect(metadata.description).toContain('42');
      expect(metadata.description).toContain('test');
    });

    it('sets noindex for search queries', () => {
      const metadata = generateSearchMetadata('query', 10);

      expect(metadata.robots).toHaveProperty('index', false);
    });

    it('allows indexing for main search page', () => {
      const metadata = generateSearchMetadata('', 0);

      expect(metadata.robots).toHaveProperty('index', true);
    });

    it('includes generic description without query', () => {
      const metadata = generateSearchMetadata('', 0);

      expect(metadata.description).toContain('80,000+');
      expect(metadata.description).toContain('affiliate programs');
    });
  });
});
