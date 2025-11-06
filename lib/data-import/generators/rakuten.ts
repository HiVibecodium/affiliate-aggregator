// Rakuten Advertising data generator
// Generates sample data representing Rakuten's global network

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const RAKUTEN_CATEGORIES = [
  'Apparel & Accessories',
  'Auto & Vehicles',
  'Books & Entertainment',
  'Business & Industrial',
  'Children & Family',
  'Computers & Electronics',
  'Education',
  'Finance',
  'Food & Beverage',
  'Health & Beauty',
  'Home & Garden',
  'Personal Care',
  'Sports & Outdoors',
  'Telecommunications',
  'Travel',
  'Toys & Games',
];

const SAMPLE_BRANDS = [
  { name: 'Walmart', commission: 4, category: 'Apparel & Accessories' },
  { name: 'Booking.com', commission: 25, category: 'Travel' },
  { name: 'Macys', commission: 10, category: 'Apparel & Accessories' },
  { name: 'Best Buy', commission: 1, category: 'Computers & Electronics' },
  { name: 'Saks Fifth Avenue', commission: 8, category: 'Apparel & Accessories' },
  { name: 'Rakuten.com', commission: 10, category: 'Books & Entertainment' },
  { name: 'Lenovo', commission: 5, category: 'Computers & Electronics' },
  { name: 'Microsoft Store', commission: 4, category: 'Computers & Electronics' },
  { name: 'Hotels.com', commission: 4, category: 'Travel' },
  { name: 'Target', commission: 8, category: 'Apparel & Accessories' },
];

export function generateRakutenData(count: number = 12000): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_BRANDS[i % SAMPLE_BRANDS.length];
    const category = i < SAMPLE_BRANDS.length ? template.category : RAKUTEN_CATEGORIES[Math.floor(Math.random() * RAKUTEN_CATEGORIES.length)];

    programs.push({
      externalId: `RAK${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_BRANDS.length ? template.name : `${template.name} Network ${Math.floor(i / SAMPLE_BRANDS.length) + 1}`,
      description: `Global affiliate program through Rakuten network. Access 1,000+ top brands worldwide.`,
      category,
      commissionRate: 5 + Math.floor(Math.random() * 11), // 5-15%
      commissionType: 'CPS', // Cost Per Sale
      cookieDuration: 30 + Math.floor(Math.random() * 60), // 30-90 days
      paymentThreshold: 50,
      paymentMethods: ['Direct Deposit', 'PayPal', 'Check'],
      programUrl: `https://rakutenadvertising.com/program/${i + 1}`,
      merchantUrl: `https://${template.name.toLowerCase().replace(/\\s+/g, '')}.com`,
      affiliateUrl: `https://rakutenadvertising.com/join/${i + 1}`,
      minPayout: 50,
      averageEarnings: 150 + Math.floor(Math.random() * 1350), // $150-$1500
      epc: 0.75 + Math.random() * 7.25, // $0.75-$8.00
      geoTargeting: ['US', 'CA', 'GB', 'AU', 'JP', 'DE', 'FR'],
      language: ['en', 'ja', 'de', 'fr'],
      verified: i < 800,
      featured: i < 75,
      popularity: Math.max(0, Math.floor(1200 - i * 0.1)),
    });
  }

  return {
    networkName: 'Rakuten Advertising',
    networkDescription: 'Global affiliate network with 1,000+ brands including Walmart and Booking.com',
    networkWebsite: 'https://rakutenadvertising.com',
    networkCountry: 'US',
    dataSource: 'scraper',
    programs,
  };
}
