// ShareASale marketplace data generator
// Generates sample data representing ShareASale's 25,000+ merchants

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const SHARESALE_CATEGORIES = [
  'Accessories',
  'Antiques & Collectibles',
  'Arts, Crafts & Sewing',
  'Automotive',
  'Books & Media',
  'Business Services',
  'Clothing & Shoes',
  'Computer & Electronics',
  'Department Stores',
  'Flowers & Gifts',
  'Food & Beverage',
  'Health & Beauty',
  'Home & Garden',
  'Jewelry & Watches',
  'Office Products',
  'Pet Supplies',
  'Sports & Outdoors',
  'Toys & Hobbies',
  'Travel',
  'Web Services',
];

const SAMPLE_MERCHANTS = [
  { name: 'Etsy', commission: 4, category: 'Arts, Crafts & Sewing' },
  { name: 'Reebok', commission: 8, category: 'Clothing & Shoes' },
  { name: 'Warby Parker', commission: 15, category: 'Accessories' },
  { name: 'Priceline', commission: 12, category: 'Travel' },
  { name: 'Zappos', commission: 7, category: 'Clothing & Shoes' },
  { name: 'Shutterfly', commission: 10, category: 'Arts, Crafts & Sewing' },
  { name: 'Tailored Brands', commission: 6, category: 'Clothing & Shoes' },
  { name: 'Blue Nile', commission: 6, category: 'Jewelry & Watches' },
  { name: 'Overstock', commission: 5, category: 'Department Stores' },
  { name: '1-800-Flowers', commission: 15, category: 'Flowers & Gifts' },
];

export function generateShareASaleData(count: number = 25000): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_MERCHANTS[i % SAMPLE_MERCHANTS.length];
    const category = i < SAMPLE_MERCHANTS.length ? template.category : SHARESALE_CATEGORIES[Math.floor(Math.random() * SHARESALE_CATEGORIES.length)];

    programs.push({
      externalId: `SSA${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_MERCHANTS.length ? template.name : `${template.name} Store ${Math.floor(i / SAMPLE_MERCHANTS.length) + 1}`,
      description: `Affiliate program for ${template.name}. Join 260 new affiliates daily earning commissions.`,
      category,
      commissionRate: 4 + Math.floor(Math.random() * 47), // 4-50%
      commissionType: 'CPS', // Cost Per Sale
      cookieDuration: 30 + Math.floor(Math.random() * 60), // 30-90 days
      paymentThreshold: 50,
      paymentMethods: ['Direct Deposit', 'Check'],
      programUrl: `https://shareasale.com/merchants/${i + 1}`,
      merchantUrl: `https://${template.name.toLowerCase().replace(/\\s+/g, '')}.com`,
      affiliateUrl: `https://shareasale.com/join/${i + 1}`,
      minPayout: 50,
      averageEarnings: 100 + Math.floor(Math.random() * 900), // $100-$1000
      epc: 0.5 + Math.random() * 4.5, // $0.50-$5.00
      geoTargeting: ['US', 'CA', 'GB', 'AU'],
      language: ['en'],
      verified: i < 1000,
      featured: i < 50,
      popularity: Math.max(0, Math.floor(2500 - i * 0.1)),
    });
  }

  return {
    networkName: 'ShareASale',
    networkDescription: '25,000+ brands with $1.3B paid to affiliates last year',
    networkWebsite: 'https://shareasale.com',
    networkCountry: 'US',
    dataSource: 'scraper',
    programs,
  };
}
