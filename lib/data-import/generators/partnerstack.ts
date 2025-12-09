// PartnerStack data generator
// B2B SaaS partnership platform

import type { NetworkImportConfig, NetworkProgramData } from '../types';

const PARTNERSTACK_CATEGORIES = [
  'Sales & CRM',
  'Marketing Automation',
  'Customer Support',
  'HR & Recruiting',
  'Project Management',
  'Finance & Accounting',
  'Developer Tools',
  'eCommerce',
  'Communication',
  'Productivity',
  'Security',
  'Analytics',
  'Design',
  'IT & DevOps',
];

const SAMPLE_PROGRAMS = [
  { name: 'Monday.com', category: 'Project Management', commission: 100, type: 'CPA' },
  { name: 'Freshworks', category: 'Customer Support', commission: 200, type: 'CPA' },
  { name: 'Pipedrive', category: 'Sales & CRM', commission: 33, type: 'CPS' },
  { name: 'Webflow', category: 'Design', commission: 50, type: 'CPS' },
  { name: 'Notion', category: 'Productivity', commission: 50, type: 'CPA' },
  { name: 'Intercom', category: 'Customer Support', commission: 20, type: 'CPS' },
  { name: 'Drift', category: 'Marketing Automation', commission: 100, type: 'CPA' },
  { name: 'Gorgias', category: 'eCommerce', commission: 20, type: 'CPS' },
  { name: 'Datadog', category: 'IT & DevOps', commission: 15, type: 'CPS' },
  { name: 'Mixpanel', category: 'Analytics', commission: 20, type: 'CPS' },
];

export function generatePartnerStackData(count: number = 100): NetworkImportConfig {
  const programs: NetworkProgramData[] = [];

  for (let i = 0; i < count; i++) {
    const template = SAMPLE_PROGRAMS[i % SAMPLE_PROGRAMS.length];
    const category =
      i < SAMPLE_PROGRAMS.length
        ? template.category
        : PARTNERSTACK_CATEGORIES[Math.floor(Math.random() * PARTNERSTACK_CATEGORIES.length)];

    programs.push({
      externalId: `PSK${String(i + 1).padStart(6, '0')}`,
      name: i < SAMPLE_PROGRAMS.length ? template.name : `${category} SaaS ${i + 1}`,
      description: `B2B ${category.toLowerCase()} SaaS solution. Recurring commissions on subscription revenue.`,
      category,
      commissionRate:
        template.type === 'CPA'
          ? 50 + Math.floor(Math.random() * 200)
          : 15 + Math.floor(Math.random() * 35),
      commissionType: template.type,
      cookieDuration: 90 + Math.floor(Math.random() * 90),
      paymentThreshold: 100,
      paymentMethods: ['PayPal', 'Stripe', 'Bank Transfer'],
      programUrl: `https://partnerstack.com/partners/${template.name.toLowerCase().replace(/\s+/g, '-')}`,
      geoTargeting: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL'],
      language: ['en'],
      verified: true,
      featured: i < 10,
      popularity: Math.max(0, Math.floor(500 - i * 5)),
    });
  }

  return {
    networkName: 'PartnerStack',
    networkDescription: 'B2B SaaS partnership platform with recurring revenue commissions',
    networkWebsite: 'https://partnerstack.com',
    networkCountry: 'CA',
    dataSource: 'api',
    programs,
  };
}
