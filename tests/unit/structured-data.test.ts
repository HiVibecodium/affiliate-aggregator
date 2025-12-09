/**
 * Structured Data (JSON-LD) Tests
 */

import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateAffiliateProgramSchema,
  generateProgramListSchema,
  generateFAQSchema,
  generateReviewSchema,
  generateCategorySchema,
  generateNetworkSchema,
  generateHowToSchema,
  generateSoftwareApplicationSchema,
  combineSchemas,
  serializeSchema,
} from '@/lib/seo/structured-data';

describe('Structured Data Library', () => {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://affiliate-aggregator-five.vercel.app';

  describe('generateOrganizationSchema', () => {
    it('generates valid organization schema', () => {
      const schema = generateOrganizationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('Affiliate Aggregator');
      expect(schema.url).toBe(APP_URL);
      expect(schema.logo).toContain('icon-512x512.png');
      expect(schema.contactPoint).toBeDefined();
      expect(schema.contactPoint['@type']).toBe('ContactPoint');
    });
  });

  describe('generateWebsiteSchema', () => {
    it('generates valid website schema with search action', () => {
      const schema = generateWebsiteSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('Affiliate Aggregator');
      expect(schema.url).toBe(APP_URL);
      expect(schema.potentialAction).toBeDefined();
      expect(schema.potentialAction['@type']).toBe('SearchAction');
      expect(schema.potentialAction.target.urlTemplate).toContain('search=');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('generates valid breadcrumb schema', () => {
      const items = [
        { name: 'Home', url: '/' },
        { name: 'Programs', url: '/programs' },
        { name: 'Amazon', url: '/programs/amazon' },
      ];

      const schema = generateBreadcrumbSchema(items);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it('prepends APP_URL to relative paths', () => {
      const items = [{ name: 'Home', url: '/' }];
      const schema = generateBreadcrumbSchema(items);

      expect(schema.itemListElement[0].item).toBe(`${APP_URL}/`);
    });

    it('keeps absolute URLs as-is', () => {
      const items = [{ name: 'External', url: 'https://example.com' }];
      const schema = generateBreadcrumbSchema(items);

      expect(schema.itemListElement[0].item).toBe('https://example.com');
    });
  });

  describe('generateAffiliateProgramSchema', () => {
    const mockProgram = {
      id: 'prog-123',
      name: 'Amazon Associates',
      description: 'Top affiliate program',
      network: { name: 'Amazon', website: 'https://amazon.com' },
      commissionRate: 10,
      commissionType: 'CPS',
      category: 'E-commerce',
      cookieDuration: 30,
      averageRating: 4.5,
      reviewCount: 100,
      logoUrl: 'https://example.com/logo.png',
    };

    it('generates valid product schema for program', () => {
      const schema = generateAffiliateProgramSchema(mockProgram);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('Amazon Associates');
      expect(schema.description).toBe('Top affiliate program');
      expect(schema.category).toBe('E-commerce');
      expect(schema.url).toBe(`${APP_URL}/programs/prog-123`);
    });

    it('includes brand organization', () => {
      const schema = generateAffiliateProgramSchema(mockProgram);

      expect(schema.brand['@type']).toBe('Organization');
      expect(schema.brand.name).toBe('Amazon');
      expect(schema.brand.url).toBe('https://amazon.com');
    });

    it('includes offers with commission info', () => {
      const schema = generateAffiliateProgramSchema(mockProgram);

      expect(schema.offers['@type']).toBe('Offer');
      expect(schema.offers.price).toBe('0');
      expect(schema.offers.priceCurrency).toBe('USD');
      expect(schema.offers.description).toContain('10%');
      expect(schema.offers.description).toContain('CPS');
    });

    it('includes aggregate rating when available', () => {
      const schema = generateAffiliateProgramSchema(mockProgram);

      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating['@type']).toBe('AggregateRating');
      expect(schema.aggregateRating.ratingValue).toBe(4.5);
      expect(schema.aggregateRating.reviewCount).toBe(100);
      expect(schema.aggregateRating.bestRating).toBe(5);
    });

    it('excludes aggregate rating when no reviews', () => {
      const programNoReviews = { ...mockProgram, averageRating: null, reviewCount: 0 };
      const schema = generateAffiliateProgramSchema(programNoReviews);

      expect(schema.aggregateRating).toBeUndefined();
    });

    it('includes image when logo is available', () => {
      const schema = generateAffiliateProgramSchema(mockProgram);

      expect(schema.image).toBe('https://example.com/logo.png');
    });

    it('includes cookie duration as additional property', () => {
      const schema = generateAffiliateProgramSchema(mockProgram);

      expect(schema.additionalProperty).toBeDefined();
      expect(schema.additionalProperty[0].name).toBe('Cookie Duration');
      expect(schema.additionalProperty[0].value).toBe('30 days');
    });

    it('generates fallback description when null', () => {
      const programNoDesc = { ...mockProgram, description: null };
      const schema = generateAffiliateProgramSchema(programNoDesc);

      expect(schema.description).toContain('Amazon Associates');
      expect(schema.description).toContain('Amazon');
    });
  });

  describe('generateProgramListSchema', () => {
    const mockPrograms = [
      {
        id: '1',
        name: 'Program 1',
        description: 'Desc 1',
        network: { name: 'Net1' },
        commissionRate: 10,
      },
      {
        id: '2',
        name: 'Program 2',
        description: 'Desc 2',
        network: { name: 'Net2' },
        commissionRate: 20,
      },
      {
        id: '3',
        name: 'Program 3',
        description: 'Desc 3',
        network: { name: 'Net3' },
        commissionRate: 30,
      },
    ];

    it('generates valid ItemList schema', () => {
      const schema = generateProgramListSchema(mockPrograms);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('ItemList');
      expect(schema.name).toBe('Affiliate Programs');
      expect(schema.numberOfItems).toBe(3);
    });

    it('uses custom list name when provided', () => {
      const schema = generateProgramListSchema(mockPrograms, 'Top Programs');

      expect(schema.name).toBe('Top Programs');
    });

    it('includes list items with correct positions', () => {
      const schema = generateProgramListSchema(mockPrograms);

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe('Program 1');
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it('limits items to 10', () => {
      const manyPrograms = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        name: `Program ${i}`,
        description: `Desc ${i}`,
        network: { name: `Net${i}` },
        commissionRate: i * 10,
      }));

      const schema = generateProgramListSchema(manyPrograms);

      expect(schema.itemListElement).toHaveLength(10);
      expect(schema.numberOfItems).toBe(15);
    });
  });

  describe('generateFAQSchema', () => {
    const faqs = [
      { question: 'What is affiliate marketing?', answer: 'A performance-based marketing...' },
      { question: 'How do I start?', answer: 'Sign up for a program...' },
    ];

    it('generates valid FAQPage schema', () => {
      const schema = generateFAQSchema(faqs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
    });

    it('formats questions and answers correctly', () => {
      const schema = generateFAQSchema(faqs);

      expect(schema.mainEntity[0]['@type']).toBe('Question');
      expect(schema.mainEntity[0].name).toBe('What is affiliate marketing?');
      expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe('A performance-based marketing...');
    });
  });

  describe('generateReviewSchema', () => {
    const mockReview = {
      id: 'rev-123',
      programId: 'prog-123',
      programName: 'Amazon Associates',
      rating: 5,
      title: 'Great program!',
      comment: 'I love this program because...',
      authorName: 'John Doe',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    it('generates valid Review schema', () => {
      const schema = generateReviewSchema(mockReview);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Review');
      expect(schema.name).toBe('Great program!');
      expect(schema.reviewBody).toBe('I love this program because...');
    });

    it('includes item being reviewed', () => {
      const schema = generateReviewSchema(mockReview);

      expect(schema.itemReviewed['@type']).toBe('Product');
      expect(schema.itemReviewed.name).toBe('Amazon Associates');
      expect(schema.itemReviewed.url).toBe(`${APP_URL}/programs/prog-123`);
    });

    it('includes rating information', () => {
      const schema = generateReviewSchema(mockReview);

      expect(schema.reviewRating['@type']).toBe('Rating');
      expect(schema.reviewRating.ratingValue).toBe(5);
      expect(schema.reviewRating.bestRating).toBe(5);
      expect(schema.reviewRating.worstRating).toBe(1);
    });

    it('includes author information', () => {
      const schema = generateReviewSchema(mockReview);

      expect(schema.author['@type']).toBe('Person');
      expect(schema.author.name).toBe('John Doe');
    });

    it('includes publication date', () => {
      const schema = generateReviewSchema(mockReview);

      expect(schema.datePublished).toBe('2024-01-15T10:00:00.000Z');
    });

    it('generates fallback title when null', () => {
      const reviewNoTitle = { ...mockReview, title: null };
      const schema = generateReviewSchema(reviewNoTitle);

      expect(schema.name).toBe('Review of Amazon Associates');
    });
  });

  describe('generateCategorySchema', () => {
    const mockCategory = {
      name: 'Finance',
      slug: 'finance',
      description: 'Financial affiliate programs',
      programCount: 150,
    };

    it('generates valid CollectionPage schema', () => {
      const schema = generateCategorySchema(mockCategory);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('CollectionPage');
      expect(schema.name).toBe('Finance Affiliate Programs');
      expect(schema.url).toBe(`${APP_URL}/categories/finance`);
      expect(schema.numberOfItems).toBe(150);
    });

    it('uses custom description when provided', () => {
      const schema = generateCategorySchema(mockCategory);

      expect(schema.description).toBe('Financial affiliate programs');
    });

    it('generates fallback description when not provided', () => {
      const categoryNoDesc = { ...mockCategory, description: undefined };
      const schema = generateCategorySchema(categoryNoDesc);

      expect(schema.description).toContain('150 affiliate programs');
      expect(schema.description).toContain('Finance');
    });
  });

  describe('generateNetworkSchema', () => {
    const mockNetwork = {
      id: 'net-123',
      name: 'ShareASale',
      slug: 'shareasale',
      website: 'https://shareasale.com',
      description: 'Leading affiliate network',
      programCount: 500,
    };

    it('generates valid Organization schema', () => {
      const schema = generateNetworkSchema(mockNetwork);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('ShareASale');
      expect(schema.url).toBe('https://shareasale.com');
    });

    it('uses APP_URL when website is null', () => {
      const networkNoSite = { ...mockNetwork, website: null };
      const schema = generateNetworkSchema(networkNoSite);

      expect(schema.url).toBe(`${APP_URL}/networks/shareasale`);
    });

    it('includes sameAs with website when available', () => {
      const schema = generateNetworkSchema(mockNetwork);

      expect(schema.sameAs).toContain('https://shareasale.com');
    });
  });

  describe('generateHowToSchema', () => {
    const mockHowTo = {
      name: 'How to Start Affiliate Marketing',
      description: 'A step-by-step guide to starting...',
      steps: [
        {
          name: 'Choose a niche',
          text: 'Select a topic you are passionate about',
          url: '/guides/niche',
        },
        { name: 'Find programs', text: 'Browse and compare affiliate programs' },
        { name: 'Apply', text: 'Submit applications to chosen programs' },
      ],
    };

    it('generates valid HowTo schema', () => {
      const schema = generateHowToSchema(mockHowTo);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('HowTo');
      expect(schema.name).toBe('How to Start Affiliate Marketing');
      expect(schema.description).toBe('A step-by-step guide to starting...');
    });

    it('includes steps with correct positions', () => {
      const schema = generateHowToSchema(mockHowTo);

      expect(schema.step).toHaveLength(3);
      expect(schema.step[0]['@type']).toBe('HowToStep');
      expect(schema.step[0].position).toBe(1);
      expect(schema.step[0].name).toBe('Choose a niche');
      expect(schema.step[2].position).toBe(3);
    });

    it('includes step URLs when provided', () => {
      const schema = generateHowToSchema(mockHowTo);

      expect(schema.step[0].url).toBe('/guides/niche');
      expect(schema.step[1].url).toBeUndefined();
    });
  });

  describe('generateSoftwareApplicationSchema', () => {
    it('generates valid SoftwareApplication schema', () => {
      const schema = generateSoftwareApplicationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('SoftwareApplication');
      expect(schema.name).toBe('Affiliate Aggregator');
      expect(schema.applicationCategory).toBe('BusinessApplication');
      expect(schema.operatingSystem).toBe('Web');
    });

    it('includes free offer', () => {
      const schema = generateSoftwareApplicationSchema();

      expect(schema.offers['@type']).toBe('Offer');
      expect(schema.offers.price).toBe('0');
      expect(schema.offers.priceCurrency).toBe('USD');
    });

    it('includes aggregate rating', () => {
      const schema = generateSoftwareApplicationSchema();

      expect(schema.aggregateRating['@type']).toBe('AggregateRating');
      expect(schema.aggregateRating.ratingValue).toBe(4.8);
      expect(schema.aggregateRating.ratingCount).toBe(150);
    });
  });

  describe('combineSchemas', () => {
    it('combines multiple schemas into array', () => {
      const schema1 = { '@type': 'Organization', name: 'Org' };
      const schema2 = { '@type': 'WebSite', name: 'Site' };

      const combined = combineSchemas(schema1, schema2);

      expect(Array.isArray(combined)).toBe(true);
      expect(combined).toHaveLength(2);
      expect(combined[0]).toEqual(schema1);
      expect(combined[1]).toEqual(schema2);
    });
  });

  describe('serializeSchema', () => {
    it('serializes schema to JSON string', () => {
      const schema = { '@type': 'Organization', name: 'Test' };
      const serialized = serializeSchema(schema);

      expect(typeof serialized).toBe('string');
      expect(JSON.parse(serialized)).toEqual(schema);
    });

    it('serializes array of schemas', () => {
      const schemas = [{ '@type': 'Organization' }, { '@type': 'WebSite' }];
      const serialized = serializeSchema(schemas);

      expect(JSON.parse(serialized)).toEqual(schemas);
    });
  });
});
