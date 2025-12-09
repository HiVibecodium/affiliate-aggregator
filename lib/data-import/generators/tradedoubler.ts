// TradeDoubler data generator
// European affiliate network since 1999

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const TRADEDOUBLER_CATEGORIES = [
  'Retail & Shopping',
  'Travel & Leisure',
  'Finance & Banking',
  'Telecom & Utilities',
  'Fashion & Beauty',
  'Electronics',
  'Insurance',
  'Gaming & Entertainment',
  'Food & Restaurants',
  'Home & Garden',
  'Sports',
  'Education',
  'Automotive',
  'Health & Pharmacy',
];

const SAMPLE_PROGRAMS = [
  { name: 'H&M', category: 'Fashion & Beauty', commission: 7, type: 'CPS' },
  { name: 'Zalando', category: 'Fashion & Beauty', commission: 8, type: 'CPS' },
  { name: 'Vodafone', category: 'Telecom & Utilities', commission: 25, type: 'CPA' },
  { name: 'Expedia', category: 'Travel & Leisure', commission: 4, type: 'CPS' },
  { name: 'MediaMarkt', category: 'Electronics', commission: 3, type: 'CPS' },
  { name: 'ING Bank', category: 'Finance & Banking', commission: 50, type: 'CPA' },
  { name: 'Decathlon', category: 'Sports', commission: 5, type: 'CPS' },
  { name: 'IKEA', category: 'Home & Garden', commission: 3, type: 'CPS' },
  { name: 'Philips', category: 'Electronics', commission: 5, type: 'CPS' },
  { name: 'DocMorris', category: 'Health & Pharmacy', commission: 8, type: 'CPS' },
];

export function generateTradeDoublerData(count: number = 200): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_PROGRAMS[i % SAMPLE_PROGRAMS.length];
    const category =
      i < SAMPLE_PROGRAMS.length
        ? template.category
        : TRADEDOUBLER_CATEGORIES[Math.floor(Math.random() * TRADEDOUBLER_CATEGORIES.length)];

    programs.push({
      externalId: `TDB${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_PROGRAMS.length ? template.name : `${category} EU Partner ${i + 1}`,
      description: `European ${category.toLowerCase()} brand. Pan-European tracking with local support.`,
      category,
      commissionRate:
        template.type === 'CPA'
          ? 20 + Math.floor(Math.random() * 80)
          : 3 + Math.floor(Math.random() * 10),
      commissionType: template.type,
      cookieDuration: 30 + Math.floor(Math.random() * 30),
      paymentThreshold: 50,
      paymentMethods: ['Bank Transfer', 'PayPal'],
      programUrl: `https://tradedoubler.com/programs/${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      geoTargeting: ['DE', 'FR', 'GB', 'ES', 'IT', 'NL', 'SE', 'PL', 'AT', 'CH'],
      language: ['en', 'de', 'fr', 'es'],
      verified: true,
      featured: i < 20,
      popularity: Math.max(0, Math.floor(800 - i * 4)),
    });
  }

  return {
    networkName: 'TradeDoubler',
    networkDescription: 'Leading European affiliate network since 1999 with pan-European reach',
    networkWebsite: 'https://tradedoubler.com',
    networkCountry: 'SE',
    dataSource: 'api',
    programs,
  };
}
