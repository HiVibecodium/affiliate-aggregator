/**
 * Integration Hub Types
 * Types for external service integrations
 */

export type IntegrationCategory =
  | 'analytics'
  | 'marketing'
  | 'crm'
  | 'communication'
  | 'automation'
  | 'ecommerce'
  | 'social';

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  icon: string;
  status: IntegrationStatus;
  isPopular: boolean;
  isPremium: boolean;
  configFields: IntegrationConfigField[];
  features: string[];
  docsUrl?: string;
}

export interface IntegrationConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'toggle';
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
}

export interface ConnectedIntegration {
  id: string;
  integrationId: string;
  organizationId: string;
  config: Record<string, string | boolean>;
  status: IntegrationStatus;
  connectedAt: Date;
  lastSyncAt?: Date;
  syncStatus?: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

export interface IntegrationEvent {
  id: string;
  integrationId: string;
  organizationId: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  createdAt: Date;
  processedAt?: Date;
  error?: string;
}

// Available integrations catalog
export const INTEGRATIONS: Integration[] = [
  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track conversions and user behavior with GA4',
    category: 'analytics',
    icon: '📊',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: [
      'Automatic event tracking',
      'Conversion attribution',
      'User journey analysis',
      'Custom dimensions',
    ],
    configFields: [
      {
        key: 'measurementId',
        label: 'Measurement ID',
        type: 'text',
        required: true,
        placeholder: 'G-XXXXXXXXXX',
      },
      { key: 'apiSecret', label: 'API Secret', type: 'password', required: true },
      { key: 'trackClicks', label: 'Track Clicks', type: 'toggle', required: false },
      { key: 'trackConversions', label: 'Track Conversions', type: 'toggle', required: false },
    ],
    docsUrl: 'https://developers.google.com/analytics',
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Product analytics and user engagement tracking',
    category: 'analytics',
    icon: '📈',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Event tracking', 'Funnel analysis', 'Cohort analysis', 'User profiles'],
    configFields: [
      { key: 'projectToken', label: 'Project Token', type: 'text', required: true },
      { key: 'apiSecret', label: 'API Secret', type: 'password', required: false },
    ],
    docsUrl: 'https://developer.mixpanel.com',
  },
  {
    id: 'amplitude',
    name: 'Amplitude',
    description: 'Behavioral analytics platform',
    category: 'analytics',
    icon: '🔬',
    status: 'disconnected',
    isPopular: false,
    isPremium: true,
    features: ['Advanced segmentation', 'Predictive analytics', 'Cross-platform tracking'],
    configFields: [{ key: 'apiKey', label: 'API Key', type: 'password', required: true }],
    docsUrl: 'https://developers.amplitude.com',
  },

  // Marketing
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and automation',
    category: 'marketing',
    icon: '📧',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Email campaigns', 'List segmentation', 'Automation workflows', 'A/B testing'],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      {
        key: 'serverPrefix',
        label: 'Server Prefix',
        type: 'text',
        required: true,
        placeholder: 'us1',
      },
      { key: 'listId', label: 'List ID', type: 'text', required: false },
    ],
    docsUrl: 'https://mailchimp.com/developer/',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Transactional and marketing email',
    category: 'marketing',
    icon: '✉️',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Transactional emails', 'Marketing campaigns', 'Email validation', 'Analytics'],
    configFields: [{ key: 'apiKey', label: 'API Key', type: 'password', required: true }],
    docsUrl: 'https://docs.sendgrid.com',
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    description: 'E-commerce email and SMS marketing',
    category: 'marketing',
    icon: '🎯',
    status: 'disconnected',
    isPopular: true,
    isPremium: true,
    features: [
      'E-commerce integration',
      'Predictive analytics',
      'SMS marketing',
      'Personalization',
    ],
    configFields: [
      { key: 'publicApiKey', label: 'Public API Key', type: 'text', required: true },
      { key: 'privateApiKey', label: 'Private API Key', type: 'password', required: true },
    ],
    docsUrl: 'https://developers.klaviyo.com',
  },

  // CRM
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and marketing automation platform',
    category: 'crm',
    icon: '🧡',
    status: 'disconnected',
    isPopular: true,
    isPremium: true,
    features: ['Contact sync', 'Deal tracking', 'Marketing automation', 'Reporting'],
    configFields: [
      { key: 'accessToken', label: 'Private App Token', type: 'password', required: true },
      { key: 'syncContacts', label: 'Sync Contacts', type: 'toggle', required: false },
      { key: 'syncDeals', label: 'Sync Deals', type: 'toggle', required: false },
    ],
    docsUrl: 'https://developers.hubspot.com',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM platform',
    category: 'crm',
    icon: '☁️',
    status: 'disconnected',
    isPopular: false,
    isPremium: true,
    features: ['Lead management', 'Opportunity tracking', 'Custom objects', 'Reports & dashboards'],
    configFields: [
      {
        key: 'instanceUrl',
        label: 'Instance URL',
        type: 'text',
        required: true,
        placeholder: 'https://your-org.salesforce.com',
      },
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
    ],
    docsUrl: 'https://developer.salesforce.com',
  },

  // Communication
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    category: 'communication',
    icon: '💬',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: [
      'Channel notifications',
      'Real-time alerts',
      'Custom bot messages',
      'Workflow integration',
    ],
    configFields: [
      {
        key: 'webhookUrl',
        label: 'Webhook URL',
        type: 'text',
        required: true,
        placeholder: 'https://hooks.slack.com/services/...',
      },
      {
        key: 'channel',
        label: 'Default Channel',
        type: 'text',
        required: false,
        placeholder: '#general',
      },
      { key: 'notifyClicks', label: 'Notify on Clicks', type: 'toggle', required: false },
      { key: 'notifyConversions', label: 'Notify on Conversions', type: 'toggle', required: false },
    ],
    docsUrl: 'https://api.slack.com',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Community notifications via Discord webhooks',
    category: 'communication',
    icon: '🎮',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Webhook notifications', 'Rich embeds', 'Channel targeting'],
    configFields: [{ key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: true }],
    docsUrl: 'https://discord.com/developers/docs',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Instant notifications via Telegram bot',
    category: 'communication',
    icon: '📱',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Bot notifications', 'Group messages', 'Inline buttons'],
    configFields: [
      { key: 'botToken', label: 'Bot Token', type: 'password', required: true },
      { key: 'chatId', label: 'Chat ID', type: 'text', required: true },
    ],
    docsUrl: 'https://core.telegram.org/bots/api',
  },

  // Automation
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with 5000+ apps via Zapier',
    category: 'automation',
    icon: '⚡',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: [
      '5000+ app connections',
      'Multi-step workflows',
      'Filters and formatters',
      'Scheduled triggers',
    ],
    configFields: [
      { key: 'webhookUrl', label: 'Zapier Webhook URL', type: 'text', required: true },
    ],
    docsUrl: 'https://zapier.com/developer',
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    description: 'Visual automation platform',
    category: 'automation',
    icon: '🔄',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Visual scenario builder', 'Advanced logic', 'Error handling', 'Scheduling'],
    configFields: [{ key: 'webhookUrl', label: 'Make Webhook URL', type: 'text', required: true }],
    docsUrl: 'https://www.make.com/en/api-documentation',
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Self-hosted workflow automation',
    category: 'automation',
    icon: '🔗',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Self-hosted option', 'Custom nodes', 'Git integration'],
    configFields: [{ key: 'webhookUrl', label: 'n8n Webhook URL', type: 'text', required: true }],
    docsUrl: 'https://docs.n8n.io',
  },

  // E-commerce
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'E-commerce platform integration',
    category: 'ecommerce',
    icon: '🛍️',
    status: 'disconnected',
    isPopular: true,
    isPremium: true,
    features: ['Product sync', 'Order tracking', 'Customer data', 'Revenue attribution'],
    configFields: [
      {
        key: 'shopDomain',
        label: 'Shop Domain',
        type: 'text',
        required: true,
        placeholder: 'your-store.myshopify.com',
      },
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
    ],
    docsUrl: 'https://shopify.dev/docs/api',
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'WordPress e-commerce integration',
    category: 'ecommerce',
    icon: '🛒',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Order webhooks', 'Product sync', 'Customer tracking'],
    configFields: [
      { key: 'siteUrl', label: 'Site URL', type: 'text', required: true },
      { key: 'consumerKey', label: 'Consumer Key', type: 'text', required: true },
      { key: 'consumerSecret', label: 'Consumer Secret', type: 'password', required: true },
    ],
    docsUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
  },

  // Social
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Social media posting and analytics',
    category: 'social',
    icon: '🐦',
    status: 'disconnected',
    isPopular: false,
    isPremium: true,
    features: ['Auto-posting', 'Engagement tracking', 'Mention monitoring'],
    configFields: [
      { key: 'apiKey', label: 'API Key', type: 'password', required: true },
      { key: 'apiSecret', label: 'API Secret', type: 'password', required: true },
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
      { key: 'accessSecret', label: 'Access Token Secret', type: 'password', required: true },
    ],
    docsUrl: 'https://developer.twitter.com',
  },
];

// Helper functions
export function getIntegrationsByCategory(category: IntegrationCategory): Integration[] {
  return INTEGRATIONS.filter((i) => i.category === category);
}

export function getPopularIntegrations(): Integration[] {
  return INTEGRATIONS.filter((i) => i.isPopular);
}

export function getIntegrationById(id: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.id === id);
}

export function getCategoryLabel(category: IntegrationCategory): string {
  const labels: Record<IntegrationCategory, string> = {
    analytics: 'Analytics',
    marketing: 'Marketing',
    crm: 'CRM',
    communication: 'Communication',
    automation: 'Automation',
    ecommerce: 'E-commerce',
    social: 'Social Media',
  };
  return labels[category];
}

export function getCategoryIcon(category: IntegrationCategory): string {
  const icons: Record<IntegrationCategory, string> = {
    analytics: '📊',
    marketing: '📧',
    crm: '👥',
    communication: '💬',
    automation: '⚡',
    ecommerce: '🛍️',
    social: '🌐',
  };
  return icons[category];
}
