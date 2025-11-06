// ClickBank marketplace data generator
// Generates sample data representing ClickBank's 10K+ digital products

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const CLICKBANK_CATEGORIES = [
  'Business & Investing',
  'Computers & Internet',
  'Cooking, Food & Wine',
  'E-business & E-marketing',
  'Education',
  'Fiction',
  'Games',
  'Green Products',
  'Health & Fitness',
  'Home & Garden',
  'Languages',
  'Mobile',
  'Parenting & Families',
  'Politics & Current Events',
  'Reference',
  'Self-Help',
  'Software & Services',
  'Spirituality, New Age & Alternative Beliefs',
  'Sports',
  'Travel',
];

const SAMPLE_PROGRAMS = [
  { name: 'The Ultimate Keto Meal Plan', category: 'Health & Fitness', commission: 75, epc: 1.85 },
  { name: 'Affiliate Marketing Masterclass', category: 'E-business & E-marketing', commission: 50, epc: 2.15 },
  { name: 'Dog Training Secrets', category: 'Parenting & Families', commission: 60, epc: 1.45 },
  { name: 'Guitar Lessons for Beginners', category: 'Education', commission: 70, epc: 1.95 },
  { name: 'Manifestation Magic', category: 'Self-Help', commission: 75, epc: 1.75 },
  { name: 'Backyard Revolution Solar Power', category: 'Green Products', commission: 75, epc: 3.25 },
  { name: 'Text Your Ex Back', category: 'Parenting & Families', commission: 75, epc: 2.45 },
  { name: 'Numerologist.com Personalized Report', category: 'Spirituality, New Age & Alternative Beliefs', commission: 75, epc: 1.65 },
  { name: 'The Lost Ways Survival Guide', category: 'Home & Garden', commission: 75, epc: 2.95 },
  { name: 'Diabetes Freedom Program', category: 'Health & Fitness', commission: 75, epc: 2.15 },
];

export function generateClickBankData(count: number = 10000): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_PROGRAMS[i % SAMPLE_PROGRAMS.length];
    const category = CLICKBANK_CATEGORIES[Math.floor(Math.random() * CLICKBANK_CATEGORIES.length)];

    programs.push({
      externalId: `CB${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_PROGRAMS.length ? template.name : `${template.name} ${Math.floor(i / SAMPLE_PROGRAMS.length) + 1}`,
      description: `Digital product in ${category}. High converting offer with proven sales funnel.`,
      category: i < SAMPLE_PROGRAMS.length ? template.category : category,
      commissionRate: 40 + Math.floor(Math.random() * 36), // 40-75%
      commissionType: 'CPS', // Cost Per Sale
      cookieDuration: 60,
      paymentThreshold: 10,
      paymentMethods: ['PayPal', 'Direct Deposit', 'Check'],
      programUrl: `https://clickbank.com/marketplace/products/${template.name.toLowerCase().replace(/\\s+/g, '-')}`,
      merchantUrl: `https://example.com/${template.name.toLowerCase().replace(/\\s+/g, '-')}`,
      affiliateUrl: `https://clickbank.com/affiliate/${template.name.toLowerCase().replace(/\\s+/g, '-')}`,
      minPayout: 10,
      averageEarnings: 50 + Math.floor(Math.random() * 450), // $50-$500
      epc: template.epc + (Math.random() - 0.5) * 0.5, // ±$0.25 variance
      geoTargeting: ['US', 'CA', 'GB', 'AU', 'NZ'],
      language: ['en'],
      verified: true,
      featured: i < 100,
      popularity: Math.max(0, Math.floor(1000 - i * 0.1)),
    });
  }

  return {
    networkName: 'ClickBank',
    networkDescription: 'The largest digital marketplace with 10,000+ products and 40-75% commissions',
    networkWebsite: 'https://clickbank.com',
    networkCountry: 'US',
    dataSource: 'scraper',
    programs,
  };
}
