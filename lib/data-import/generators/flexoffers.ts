// FlexOffers data generator
// Large affiliate network with 12,000+ advertisers

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const FLEXOFFERS_CATEGORIES = [
  'Apparel',
  'Automotive',
  'Business',
  'Computers & Electronics',
  'Education',
  'Entertainment',
  'Financial Services',
  'Food & Drink',
  'Health & Beauty',
  'Home & Garden',
  'Insurance',
  'Legal',
  'Online Services',
  'Sports & Fitness',
  'Telecommunications',
  'Travel',
  'Web Services',
];

const SAMPLE_PROGRAMS = [
  { name: 'Norton Security', category: 'Computers & Electronics', commission: 20, type: 'CPS' },
  { name: 'McAfee Antivirus', category: 'Computers & Electronics', commission: 15, type: 'CPS' },
  { name: 'Constant Contact', category: 'Business', commission: 105, type: 'CPA' },
  { name: 'Bluehost', category: 'Web Services', commission: 65, type: 'CPA' },
  { name: 'TurboTax', category: 'Financial Services', commission: 15, type: 'CPS' },
  { name: 'Credit Karma', category: 'Financial Services', commission: 2, type: 'CPL' },
  { name: 'ADT Security', category: 'Home & Garden', commission: 125, type: 'CPA' },
  { name: 'LifeLock', category: 'Online Services', commission: 110, type: 'CPA' },
  { name: 'Rosetta Stone', category: 'Education', commission: 20, type: 'CPS' },
  { name: 'Match.com', category: 'Entertainment', commission: 7, type: 'CPS' },
];

export function generateFlexOffersData(count: number = 1000): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_PROGRAMS[i % SAMPLE_PROGRAMS.length];
    const category =
      i < SAMPLE_PROGRAMS.length
        ? template.category
        : FLEXOFFERS_CATEGORIES[Math.floor(Math.random() * FLEXOFFERS_CATEGORIES.length)];

    const commissionTypes = ['CPS', 'CPA', 'CPL'];
    const commType =
      template.type || commissionTypes[Math.floor(Math.random() * commissionTypes.length)];

    programs.push({
      externalId: `FLX${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_PROGRAMS.length ? template.name : `${category} Partner ${i + 1}`,
      description: `FlexOffers ${category.toLowerCase()} advertiser. Reliable payments and real-time reporting.`,
      category,
      commissionRate:
        commType === 'CPA'
          ? 25 + Math.floor(Math.random() * 100)
          : commType === 'CPL'
            ? 1 + Math.floor(Math.random() * 10)
            : 5 + Math.floor(Math.random() * 20),
      commissionType: commType,
      cookieDuration: 30 + Math.floor(Math.random() * 30),
      paymentThreshold: 25,
      paymentMethods: ['PayPal', 'Check', 'Wire Transfer', 'Direct Deposit'],
      programUrl: `https://flexoffers.com/affiliate-programs/${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      geoTargeting: ['US', 'CA'],
      language: ['en'],
      verified: true,
      featured: i < 100,
      popularity: Math.max(0, Math.floor(800 - i * 0.8)),
    });
  }

  return {
    networkName: 'FlexOffers',
    networkDescription:
      'Premier affiliate network with 12,000+ advertisers and flexible payment options',
    networkWebsite: 'https://flexoffers.com',
    networkCountry: 'US',
    dataSource: 'api',
    programs,
  };
}
