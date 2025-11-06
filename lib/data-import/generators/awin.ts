// Awin data generator
// Generates sample data representing Awin's global marketplace

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const AWIN_CATEGORIES = [
  'Animals & Pets',
  'Arts & Entertainment',
  'Automotive',
  'Beauty & Personal Care',
  'Books & Literature',
  'Business & Finance',
  'Computers & Technology',
  'Education',
  'Fashion & Style',
  'Food & Drink',
  'Games',
  'Health',
  'Hobbies & Leisure',
  'Home & Garden',
  'Sports',
  'Travel & Tourism',
  'Vehicles',
];

const SAMPLE_ADVERTISERS = [
  { name: 'AliExpress', commission: 8, category: 'Fashion & Style' },
  { name: 'Etsy', commission: 5, category: 'Arts & Entertainment' },
  { name: 'Under Armour', commission: 6, category: 'Sports' },
  { name: 'Puma', commission: 7, category: 'Fashion & Style' },
  { name: 'ASOS', commission: 10, category: 'Fashion & Style' },
  { name: 'StubHub', commission: 6, category: 'Arts & Entertainment' },
  { name: 'Udemy', commission: 15, category: 'Education' },
  { name: 'Fiverr', commission: 25, category: 'Business & Finance' },
  { name: 'TripAdvisor', commission: 50, category: 'Travel & Tourism' },
  { name: 'eBay', commission: 50, category: 'Fashion & Style' },
];

export function generateAwinData(count: number = 18000): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_ADVERTISERS[i % SAMPLE_ADVERTISERS.length];
    const category = i < SAMPLE_ADVERTISERS.length ? template.category : AWIN_CATEGORIES[Math.floor(Math.random() * AWIN_CATEGORIES.length)];

    programs.push({
      externalId: `AWIN${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_ADVERTISERS.length ? template.name : `${template.name} Partner ${Math.floor(i / SAMPLE_ADVERTISERS.length) + 1}`,
      description: `Affiliate program with Awin network. 25K+ advertisers, 270K+ publishers, $200M sales.`,
      category,
      commissionRate: 5 + Math.floor(Math.random() * 21), // 5-25%
      commissionType: 'CPS', // Cost Per Sale
      cookieDuration: 30 + Math.floor(Math.random() * 60), // 30-90 days
      paymentThreshold: 20,
      paymentMethods: ['Direct Deposit', 'PayPal'],
      programUrl: `https://awin.com/advertiser/${i + 1}`,
      merchantUrl: `https://${template.name.toLowerCase().replace(/\\s+/g, '')}.com`,
      affiliateUrl: `https://awin.com/join/${i + 1}`,
      minPayout: 20,
      averageEarnings: 120 + Math.floor(Math.random() * 1280), // $120-$1400
      epc: 0.8 + Math.random() * 6.2, // $0.80-$7.00
      geoTargeting: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BR'],
      language: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt'],
      verified: i < 1000,
      featured: i < 80,
      popularity: Math.max(0, Math.floor(1800 - i * 0.1)),
    });
  }

  return {
    networkName: 'Awin',
    networkDescription: 'Global affiliate network with 25,000+ advertisers and 270,000+ active publishers',
    networkWebsite: 'https://awin.com',
    networkCountry: 'GB',
    dataSource: 'scraper',
    programs,
  };
}
