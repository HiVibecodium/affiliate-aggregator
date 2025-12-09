// Admitad data generator
// International CPA network with strong CIS presence

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const ADMITAD_CATEGORIES = [
  'E-commerce',
  'Finance & Insurance',
  'Travel & Tourism',
  'Gaming',
  'Mobile Apps',
  'Education',
  'Services',
  'Fashion',
  'Electronics',
  'Health & Beauty',
  'Food Delivery',
  'Real Estate',
  'Auto',
  'Crypto & Forex',
  'Dating',
  'VPN & Software',
];

const SAMPLE_PROGRAMS = [
  { name: 'AliExpress', category: 'E-commerce', commission: 8, type: 'CPS' },
  { name: 'Tinkoff Bank', category: 'Finance & Insurance', commission: 50, type: 'CPA' },
  { name: 'Aviasales', category: 'Travel & Tourism', commission: 1.5, type: 'CPS' },
  { name: 'World of Tanks', category: 'Gaming', commission: 5, type: 'CPA' },
  { name: 'Lamoda', category: 'Fashion', commission: 10, type: 'CPS' },
  { name: 'Delivery Club', category: 'Food Delivery', commission: 3, type: 'CPA' },
  { name: 'Skillbox', category: 'Education', commission: 20, type: 'CPS' },
  { name: 'Binance', category: 'Crypto & Forex', commission: 40, type: 'CPA' },
  { name: 'ExpressVPN', category: 'VPN & Software', commission: 36, type: 'CPS' },
  { name: 'iHerb', category: 'Health & Beauty', commission: 5, type: 'CPS' },
  { name: 'Booking.com', category: 'Travel & Tourism', commission: 4, type: 'CPS' },
  { name: 'Ozon', category: 'E-commerce', commission: 5, type: 'CPS' },
];

export function generateAdmitadData(count: number = 2000): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_PROGRAMS[i % SAMPLE_PROGRAMS.length];
    const category =
      i < SAMPLE_PROGRAMS.length
        ? template.category
        : ADMITAD_CATEGORIES[Math.floor(Math.random() * ADMITAD_CATEGORIES.length)];

    const commissionTypes = ['CPS', 'CPA', 'CPL', 'CPI'];
    const commType =
      template.type || commissionTypes[Math.floor(Math.random() * commissionTypes.length)];

    programs.push({
      externalId: `ADM${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_PROGRAMS.length ? template.name : `${category} Offer ${i + 1}`,
      description: `International ${category.toLowerCase()} offer. Multi-geo targeting with real-time statistics.`,
      category,
      commissionRate:
        commType === 'CPA' || commType === 'CPI'
          ? 5 + Math.floor(Math.random() * 95)
          : commType === 'CPL'
            ? 1 + Math.floor(Math.random() * 15)
            : 3 + Math.floor(Math.random() * 15),
      commissionType: commType,
      cookieDuration: 30 + Math.floor(Math.random() * 60),
      paymentThreshold: 20,
      paymentMethods: ['Wire Transfer', 'WebMoney', 'PayPal', 'ePayments', 'Payoneer'],
      programUrl: `https://admitad.com/en/offers/${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      geoTargeting: ['RU', 'UA', 'KZ', 'BY', 'US', 'DE', 'FR', 'GB', 'IN', 'BR'],
      language: ['en', 'ru'],
      verified: true,
      featured: i < 200,
      popularity: Math.max(0, Math.floor(1000 - i * 0.5)),
    });
  }

  return {
    networkName: 'Admitad',
    networkDescription: 'Global CPA network with 2000+ advertisers across 40+ countries',
    networkWebsite: 'https://admitad.com',
    networkCountry: 'DE',
    dataSource: 'api',
    programs,
  };
}
