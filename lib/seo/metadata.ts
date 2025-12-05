/**
 * SEO Metadata Helpers
 * Генерация meta tags для страниц
 */

import { Metadata } from 'next';

const APP_NAME = 'Affiliate Aggregator';
const APP_DESCRIPTION =
  'Глобальный агрегатор партнёрских программ. 750+ отборных программ от 6 крупнейших сетей. Средняя комиссия 42%. Поиск, сравнение, аналитика.';
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
  id: string;
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

  // Generate dynamic OG image URL
  const ogImageParams = new URLSearchParams({
    title: program.name,
    network: program.network.name,
    ...(program.commissionRate && {
      commission: `${program.commissionRate}%`,
    }),
    ...(program.category && { category: program.category }),
  });
  const ogImageUrl = `${APP_URL}/api/og?${ogImageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${APP_URL}/programs/${program.id}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
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

/**
 * Генерация metadata для категории
 */
export function generateCategoryMetadata(category: {
  name: string;
  slug: string;
  programCount: number;
  description?: string;
}): Metadata {
  const title = `${category.name} Affiliate Programs`;
  const description =
    category.description ||
    `Browse ${category.programCount} affiliate programs in ${category.name} category. Find top-paying programs with detailed commission info.`;

  const ogImageParams = new URLSearchParams({
    title: title,
    network: `${category.programCount} programs`,
    category: category.name,
  });
  const ogImageUrl = `${APP_URL}/api/og?${ogImageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${APP_URL}/categories/${category.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Генерация metadata для сети
 */
export function generateNetworkMetadata(network: {
  name: string;
  slug: string;
  programCount: number;
  description?: string | null;
}): Metadata {
  const title = `${network.name} - Affiliate Network`;
  const description =
    network.description ||
    `Explore ${network.programCount} affiliate programs from ${network.name}. Compare commission rates and join top programs.`;

  const ogImageParams = new URLSearchParams({
    title: network.name,
    network: 'Affiliate Network',
    commission: `${network.programCount} programs`,
  });
  const ogImageUrl = `${APP_URL}/api/og?${ogImageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${APP_URL}/networks/${network.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Генерация metadata для страницы сравнения
 */
export function generateCompareMetadata(programs: Array<{ name: string }>): Metadata {
  const programNames = programs.map((p) => p.name).slice(0, 3);
  const title = `Compare: ${programNames.join(' vs ')}`;
  const description = `Side-by-side comparison of ${programs.length} affiliate programs. Compare commission rates, cookie duration, and more.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${APP_URL}/compare`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: false, // Dynamic comparison pages shouldn't be indexed
      follow: true,
    },
  };
}

/**
 * Генерация metadata для поиска
 */
export function generateSearchMetadata(query: string, resultCount: number): Metadata {
  const title = query ? `Search: ${query}` : 'Search Affiliate Programs';
  const description = query
    ? `Found ${resultCount} affiliate programs matching "${query}". Browse and compare commission rates.`
    : 'Search through 80,000+ affiliate programs. Filter by network, category, commission rate, and more.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${APP_URL}/programs`,
    },
    robots: {
      index: !query, // Only index main search page, not specific queries
      follow: true,
    },
  };
}
