/**
 * Structured Data (JSON-LD) Generator
 * Schema.org structured data for better SEO
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://affiliate-aggregator-five.vercel.app';
const APP_NAME = 'Affiliate Aggregator';

/**
 * Organization schema for the site
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/icons/icon-512x512.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Russian'],
    },
  };
}

/**
 * WebSite schema with search action
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/programs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${APP_URL}${item.url}`,
    })),
  };
}

/**
 * AffiliateProgram as SoftwareApplication schema
 */
export function generateAffiliateProgramSchema(program: {
  id: string;
  name: string;
  description: string | null;
  network: { name: string; website: string | null };
  commissionRate: number | null;
  commissionType: string | null;
  category: string | null;
  cookieDuration: number | null;
  averageRating?: number | null;
  reviewCount?: number;
  logoUrl?: string | null;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: program.name,
    description:
      program.description || `${program.name} affiliate program from ${program.network.name}`,
    brand: {
      '@type': 'Organization',
      name: program.network.name,
      url: program.network.website || undefined,
    },
    category: program.category || 'Affiliate Marketing',
    url: `${APP_URL}/programs/${program.id}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: program.commissionRate
        ? `Commission: ${program.commissionRate}% ${program.commissionType || ''}`
        : 'Commission varies',
    },
  };

  // Add logo if available
  if (program.logoUrl) {
    schema.image = program.logoUrl;
  }

  // Add aggregate rating if available
  if (program.averageRating && program.reviewCount && program.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: program.averageRating,
      reviewCount: program.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add additional properties
  if (program.cookieDuration) {
    schema.additionalProperty = [
      {
        '@type': 'PropertyValue',
        name: 'Cookie Duration',
        value: `${program.cookieDuration} days`,
      },
    ];
  }

  return schema;
}

/**
 * ItemList schema for program listings
 */
export function generateProgramListSchema(
  programs: Array<{
    id: string;
    name: string;
    description: string | null;
    network: { name: string };
    commissionRate: number | null;
  }>,
  listName: string = 'Affiliate Programs'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: programs.length,
    itemListElement: programs.slice(0, 10).map((program, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${APP_URL}/programs/${program.id}`,
      name: program.name,
    })),
  };
}

/**
 * FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Review schema
 */
export function generateReviewSchema(review: {
  id: string;
  programId: string;
  programName: string;
  rating: number;
  title: string | null;
  comment: string | null;
  authorName: string;
  createdAt: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: review.programName,
      url: `${APP_URL}/programs/${review.programId}`,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    name: review.title || `Review of ${review.programName}`,
    reviewBody: review.comment || '',
    author: {
      '@type': 'Person',
      name: review.authorName,
    },
    datePublished: review.createdAt.toISOString(),
  };
}

/**
 * Category page schema
 */
export function generateCategorySchema(category: {
  name: string;
  slug: string;
  description?: string;
  programCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Affiliate Programs`,
    description:
      category.description ||
      `Browse ${category.programCount} affiliate programs in ${category.name} category`,
    url: `${APP_URL}/categories/${category.slug}`,
    numberOfItems: category.programCount,
  };
}

/**
 * Network page schema
 */
export function generateNetworkSchema(network: {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  description: string | null;
  programCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: network.name,
    description:
      network.description ||
      `${network.name} affiliate network with ${network.programCount} programs`,
    url: network.website || `${APP_URL}/networks/${network.slug}`,
    sameAs: network.website ? [network.website] : [],
  };
}

/**
 * How-to schema for guides
 */
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    url?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url,
    })),
  };
}

/**
 * SoftwareApplication schema for the platform itself
 */
export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      ratingCount: 150,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * Combine multiple schemas into a single array
 */
export function combineSchemas(...schemas: object[]) {
  return schemas;
}

/**
 * Serialize schema for script tag
 */
export function serializeSchema(schema: object | object[]): string {
  return JSON.stringify(schema);
}
