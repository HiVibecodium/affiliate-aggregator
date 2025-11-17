/**
 * SEO Metadata Helpers
 * Генерация meta tags для страниц
 */

import { Metadata } from 'next';

const APP_NAME = 'Affiliate Aggregator';
const APP_DESCRIPTION =
  'Глобальный агрегатор партнёрских программ. 80,000+ программ от 6 крупнейших сетей. Поиск, сравнение, аналитика.';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://affiliate-aggregator-five.vercel.app';

/**
 * Default metadata для всего сайта
 */
export const defaultMetadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'affiliate programs',
    'партнёрские программы',
    'affiliate marketing',
    'партнёрский маркетинг',
    'CPA',
    'CPS',
    'affiliate networks',
    'commission',
    'ShareASale',
    'Awin',
    'CJ Affiliate',
  ],
  authors: [{ name: 'Affiliate Aggregator Team' }],
  creator: 'Affiliate Aggregator',
  publisher: 'Affiliate Aggregator',
  verification: {
    google: 'p1cIXuadbLcYL6mD1hJFnRn3ma9r6OkIl9etzF4bY0U',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Генерация metadata для программы
 */
export function generateProgramMetadata(program: {
  name: string;
  description: string | null;
  network: { name: string };
  commissionRate: number | null;
  commissionType: string | null;
  category: string | null;
}): Metadata {
  const title = `${program.name} - ${program.network.name}`;
  const description =
    program.description ||
    `${program.name} партнёрская программа от ${program.network.name}. Комиссия: ${program.commissionRate}% ${program.commissionType || ''}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${APP_URL}/programs/${program.name}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

/**
 * Генерация JSON-LD structured data для программы
 */
export function generateProgramStructuredData(program: {
  id: string;
  name: string;
  description: string | null;
  network: { name: string; website: string | null };
  commissionRate: number | null;
  commissionType: string | null;
  category: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: program.name,
    description: program.description || `${program.name} affiliate program`,
    brand: {
      '@type': 'Organization',
      name: program.network.name,
      url: program.network.website,
    },
    category: program.category || 'Affiliate Program',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: `Commission: ${program.commissionRate}% ${program.commissionType || ''}`,
    },
    url: `${APP_URL}/programs/${program.id}`,
  };
}
