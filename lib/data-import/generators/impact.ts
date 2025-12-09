// Impact (formerly Impact Radius) data generator
// Premium performance marketing platform with enterprise brands

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const IMPACT_CATEGORIES = [
  'Retail & Shopping',
  'Travel & Hospitality',
  'Financial Services',
  'Technology & Software',
  'Telecommunications',
  'Health & Wellness',
  'Education & Learning',
  'Entertainment & Media',
  'Fashion & Apparel',
  'Home & Living',
  'Automotive',
  'Business Services',
  'Food & Beverage',
  'Sports & Outdoors',
];

const SAMPLE_PROGRAMS = [
  { name: 'Uber', category: 'Travel & Hospitality', commission: 5, type: 'CPA' },
  { name: 'Airbnb', category: 'Travel & Hospitality', commission: 25, type: 'CPA' },
  { name: 'Canva', category: 'Technology & Software', commission: 36, type: 'CPS' },
  { name: 'Shopify', category: 'Technology & Software', commission: 200, type: 'CPA' },
  { name: 'Adidas', category: 'Fashion & Apparel', commission: 7, type: 'CPS' },
  { name: 'Lenovo', category: 'Technology & Software', commission: 5, type: 'CPS' },
  { name: 'Ticketmaster', category: 'Entertainment & Media', commission: 3, type: 'CPS' },
  { name: 'HelloFresh', category: 'Food & Beverage', commission: 10, type: 'CPA' },
  { name: 'NordVPN', category: 'Technology & Software', commission: 40, type: 'CPS' },
  { name: 'Booking.com', category: 'Travel & Hospitality', commission: 4, type: 'CPS' },
  { name: 'Grammarly', category: 'Education & Learning', commission: 20, type: 'CPA' },
  { name: 'Squarespace', category: 'Technology & Software', commission: 200, type: 'CPA' },
];

export function generateImpactData(count: number = 500): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_PROGRAMS[i % SAMPLE_PROGRAMS.length];
    const category =
      i < SAMPLE_PROGRAMS.length
        ? template.category
        : IMPACT_CATEGORIES[Math.floor(Math.random() * IMPACT_CATEGORIES.length)];

    programs.push({
      externalId: `IMP${String(i + 1).padStart(6, '0')}`,
      name:
        i < SAMPLE_PROGRAMS.length
          ? template.name
          : `${template.name} Program ${Math.floor(i / SAMPLE_PROGRAMS.length) + 1}`,
      description: `Premium ${category.toLowerCase()} partner program. Enterprise-grade tracking and dedicated support.`,
      category,
      commissionRate:
        template.type === 'CPA'
          ? 10 + Math.floor(Math.random() * 190)
          : 3 + Math.floor(Math.random() * 12),
      commissionType: template.type,
      cookieDuration: 30 + Math.floor(Math.random() * 60),
      paymentThreshold: 50,
      paymentMethods: ['Wire Transfer', 'PayPal', 'ACH'],
      programUrl: `https://impact.com/partners/${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      geoTargeting: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
      language: ['en'],
      verified: true,
      featured: i < 50,
      popularity: Math.max(0, Math.floor(1000 - i * 2)),
    });
  }

  return {
    networkName: 'Impact',
    networkDescription: 'Enterprise partnership management platform with premium global brands',
    networkWebsite: 'https://impact.com',
    networkCountry: 'US',
    dataSource: 'api',
    programs,
  };
}
