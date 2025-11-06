// CJ Affiliate (Commission Junction) data generator
// Generates sample data representing CJ's enterprise-level advertiser base

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const CJ_CATEGORIES = [
  'Automotive',
  'Business',
  'Careers & Education',
  'Clothing & Accessories',
  'Computer & Electronics',
  'Department Stores & Malls',
  'Entertainment',
  'Family',
  'Financial Services',
  'Food & Drinks',
  'Health & Wellness',
  'Home & Garden',
  'Insurance',
  'Legal',
  'Retail',
  'Sports & Fitness',
  'Telecommunications',
  'Travel',
  'Web Services & Internet',
];

const SAMPLE_ADVERTISERS = [
  { name: 'GoPro', commission: 10, category: 'Computer & Electronics' },
  { name: 'Barnes & Noble', commission: 8, category: 'Entertainment' },
  { name: 'Lowes', commission: 5, category: 'Home & Garden' },
  { name: 'Office Depot', commission: 5, category: 'Retail' },
  { name: 'Vistaprint', commission: 15, category: 'Business' },
  { name: 'J.Crew', commission: 5, category: 'Clothing & Accessories' },
  { name: 'Grammarly', commission: 20, category: 'Web Services & Internet' },
  { name: 'Expedia', commission: 6, category: 'Travel' },
  { name: 'HP', commission: 5, category: 'Computer & Electronics' },
  { name: 'Sephora', commission: 5, category: 'Health & Wellness' },
];

export function generateCJAffiliateData(count: number = 15000): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_ADVERTISERS[i % SAMPLE_ADVERTISERS.length];
    const category = i < SAMPLE_ADVERTISERS.length ? template.category : CJ_CATEGORIES[Math.floor(Math.random() * CJ_CATEGORIES.length)];

    programs.push({
      externalId: `CJ${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_ADVERTISERS.length ? template.name : `${template.name} Brand ${Math.floor(i / SAMPLE_ADVERTISERS.length) + 1}`,
      description: `Premium affiliate program reaching 1B+ customers monthly through CJ Affiliate network.`,
      category,
      commissionRate: 5 + Math.floor(Math.random() * 16), // 5-20%
      commissionType: 'CPS', // Cost Per Sale
      cookieDuration: 30 + Math.floor(Math.random() * 60), // 30-90 days
      paymentThreshold: 50,
      paymentMethods: ['Direct Deposit', 'PayPal'],
      programUrl: `https://cj.com/advertiser/${i + 1}`,
      merchantUrl: `https://${template.name.toLowerCase().replace(/\\s+/g, '')}.com`,
      affiliateUrl: `https://cj.com/join/${i + 1}`,
      minPayout: 50,
      averageEarnings: 200 + Math.floor(Math.random() * 1800), // $200-$2000
      epc: 1.0 + Math.random() * 9.0, // $1.00-$10.00
      geoTargeting: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT'],
      language: ['en', 'de', 'fr', 'es', 'it'],
      verified: i < 500,
      featured: i < 100,
      popularity: Math.max(0, Math.floor(1500 - i * 0.1)),
    });
  }

  return {
    networkName: 'CJ Affiliate',
    networkDescription: 'Enterprise affiliate network reaching 1B+ customers monthly with 14B interactions/year',
    networkWebsite: 'https://cj.com',
    networkCountry: 'US',
    dataSource: 'scraper',
    programs,
  };
}
