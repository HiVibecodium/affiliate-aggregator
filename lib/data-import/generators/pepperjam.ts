// Pepperjam (Partnerize) data generator
// E-commerce focused affiliate network

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const PEPPERJAM_CATEGORIES = [
  'Fashion & Accessories',
  'Beauty & Cosmetics',
  'Home & Decor',
  'Electronics & Gadgets',
  'Health & Wellness',
  'Food & Gourmet',
  'Jewelry & Watches',
  'Sports & Outdoor',
  'Baby & Kids',
  'Gifts & Flowers',
  'Department Stores',
  'Luxury Brands',
];

const SAMPLE_PROGRAMS = [
  { name: 'Nordstrom', category: 'Department Stores', commission: 5, type: 'CPS' },
  { name: 'Sephora', category: 'Beauty & Cosmetics', commission: 5, type: 'CPS' },
  { name: 'Bloomingdales', category: 'Department Stores', commission: 4, type: 'CPS' },
  { name: 'Kate Spade', category: 'Fashion & Accessories', commission: 7, type: 'CPS' },
  { name: 'Michael Kors', category: 'Fashion & Accessories', commission: 8, type: 'CPS' },
  { name: 'Williams Sonoma', category: 'Home & Decor', commission: 6, type: 'CPS' },
  { name: 'Pottery Barn', category: 'Home & Decor', commission: 6, type: 'CPS' },
  { name: 'Dyson', category: 'Electronics & Gadgets', commission: 4, type: 'CPS' },
  { name: 'Tiffany & Co', category: 'Jewelry & Watches', commission: 5, type: 'CPS' },
  { name: 'Patagonia', category: 'Sports & Outdoor', commission: 8, type: 'CPS' },
];

export function generatePepperjamData(count: number = 300): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_PROGRAMS[i % SAMPLE_PROGRAMS.length];
    const category =
      i < SAMPLE_PROGRAMS.length
        ? template.category
        : PEPPERJAM_CATEGORIES[Math.floor(Math.random() * PEPPERJAM_CATEGORIES.length)];

    programs.push({
      externalId: `PPJ${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_PROGRAMS.length ? template.name : `${category} Retailer ${i + 1}`,
      description: `Premium ${category.toLowerCase()} retailer. High-quality products with excellent conversion rates.`,
      category,
      commissionRate: 3 + Math.floor(Math.random() * 10),
      commissionType: 'CPS',
      cookieDuration: 7 + Math.floor(Math.random() * 23),
      paymentThreshold: 25,
      paymentMethods: ['Direct Deposit', 'PayPal'],
      programUrl: `https://pepperjam.com/affiliate/${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      geoTargeting: ['US', 'CA'],
      language: ['en'],
      verified: true,
      featured: i < 30,
      popularity: Math.max(0, Math.floor(900 - i * 3)),
    });
  }

  return {
    networkName: 'Pepperjam',
    networkDescription: 'E-commerce focused affiliate network with premium retail brands',
    networkWebsite: 'https://pepperjam.com',
    networkCountry: 'US',
    dataSource: 'api',
    programs,
  };
}
