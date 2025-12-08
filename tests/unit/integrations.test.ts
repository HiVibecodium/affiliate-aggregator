/**
 * Integration Hub Tests
 */

import {
  INTEGRATIONS,
  getIntegrationsByCategory,
  getPopularIntegrations,
  getIntegrationById,
  getCategoryLabel,
  getCategoryIcon,
} from '@/lib/integrations/types';

describe('Integration Hub', () => {
  describe('INTEGRATIONS', () => {
    it('contains analytics integrations', () => {
      const analytics = INTEGRATIONS.filter((i) => i.category === 'analytics');
      expect(analytics.length).toBeGreaterThan(0);
      expect(analytics.some((i) => i.id === 'google-analytics')).toBe(true);
    });

    it('contains marketing integrations', () => {
      const marketing = INTEGRATIONS.filter((i) => i.category === 'marketing');
      expect(marketing.length).toBeGreaterThan(0);
      expect(marketing.some((i) => i.id === 'mailchimp')).toBe(true);
    });

    it('contains communication integrations', () => {
      const communication = INTEGRATIONS.filter((i) => i.category === 'communication');
      expect(communication.length).toBeGreaterThan(0);
      expect(communication.some((i) => i.id === 'slack')).toBe(true);
    });

    it('contains automation integrations', () => {
      const automation = INTEGRATIONS.filter((i) => i.category === 'automation');
      expect(automation.length).toBeGreaterThan(0);
      expect(automation.some((i) => i.id === 'zapier')).toBe(true);
    });

    it('contains ecommerce integrations', () => {
      const ecommerce = INTEGRATIONS.filter((i) => i.category === 'ecommerce');
      expect(ecommerce.length).toBeGreaterThan(0);
      expect(ecommerce.some((i) => i.id === 'shopify')).toBe(true);
    });

    it('all integrations have required fields', () => {
      INTEGRATIONS.forEach((integration) => {
        expect(integration.id).toBeDefined();
        expect(integration.name).toBeDefined();
        expect(integration.description).toBeDefined();
        expect(integration.category).toBeDefined();
        expect(integration.icon).toBeDefined();
        expect(integration.status).toBeDefined();
        expect(integration.features).toBeDefined();
        expect(integration.configFields).toBeDefined();
        expect(typeof integration.isPopular).toBe('boolean');
        expect(typeof integration.isPremium).toBe('boolean');
      });
    });

    it('all integrations have unique ids', () => {
      const ids = INTEGRATIONS.map((i) => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all config fields have required properties', () => {
      INTEGRATIONS.forEach((integration) => {
        integration.configFields.forEach((field) => {
          expect(field.key).toBeDefined();
          expect(field.label).toBeDefined();
          expect(field.type).toBeDefined();
          expect(['text', 'password', 'select', 'toggle']).toContain(field.type);
          expect(typeof field.required).toBe('boolean');
        });
      });
    });
  });

  describe('getIntegrationsByCategory', () => {
    it('returns analytics integrations', () => {
      const integrations = getIntegrationsByCategory('analytics');
      expect(integrations.length).toBeGreaterThan(0);
      integrations.forEach((i) => {
        expect(i.category).toBe('analytics');
      });
    });

    it('returns marketing integrations', () => {
      const integrations = getIntegrationsByCategory('marketing');
      expect(integrations.length).toBeGreaterThan(0);
      integrations.forEach((i) => {
        expect(i.category).toBe('marketing');
      });
    });

    it('returns communication integrations', () => {
      const integrations = getIntegrationsByCategory('communication');
      expect(integrations.length).toBeGreaterThan(0);
      integrations.forEach((i) => {
        expect(i.category).toBe('communication');
      });
    });

    it('returns automation integrations', () => {
      const integrations = getIntegrationsByCategory('automation');
      expect(integrations.length).toBeGreaterThan(0);
      integrations.forEach((i) => {
        expect(i.category).toBe('automation');
      });
    });

    it('returns ecommerce integrations', () => {
      const integrations = getIntegrationsByCategory('ecommerce');
      expect(integrations.length).toBeGreaterThan(0);
      integrations.forEach((i) => {
        expect(i.category).toBe('ecommerce');
      });
    });

    it('returns social integrations', () => {
      const integrations = getIntegrationsByCategory('social');
      expect(integrations.length).toBeGreaterThan(0);
      integrations.forEach((i) => {
        expect(i.category).toBe('social');
      });
    });
  });

  describe('getPopularIntegrations', () => {
    it('returns only popular integrations', () => {
      const popular = getPopularIntegrations();
      expect(popular.length).toBeGreaterThan(0);
      popular.forEach((i) => {
        expect(i.isPopular).toBe(true);
      });
    });

    it('includes Google Analytics as popular', () => {
      const popular = getPopularIntegrations();
      expect(popular.some((i) => i.id === 'google-analytics')).toBe(true);
    });

    it('includes Mailchimp as popular', () => {
      const popular = getPopularIntegrations();
      expect(popular.some((i) => i.id === 'mailchimp')).toBe(true);
    });

    it('includes Zapier as popular', () => {
      const popular = getPopularIntegrations();
      expect(popular.some((i) => i.id === 'zapier')).toBe(true);
    });
  });

  describe('getIntegrationById', () => {
    it('returns integration by valid id', () => {
      const integration = getIntegrationById('google-analytics');
      expect(integration).toBeDefined();
      expect(integration?.name).toBe('Google Analytics');
    });

    it('returns undefined for invalid id', () => {
      const integration = getIntegrationById('invalid-id');
      expect(integration).toBeUndefined();
    });

    it('returns correct integration for slack', () => {
      const integration = getIntegrationById('slack');
      expect(integration).toBeDefined();
      expect(integration?.name).toBe('Slack');
      expect(integration?.category).toBe('communication');
    });

    it('returns correct integration for zapier', () => {
      const integration = getIntegrationById('zapier');
      expect(integration).toBeDefined();
      expect(integration?.name).toBe('Zapier');
      expect(integration?.category).toBe('automation');
    });

    it('returns correct integration for shopify', () => {
      const integration = getIntegrationById('shopify');
      expect(integration).toBeDefined();
      expect(integration?.isPremium).toBe(true);
    });
  });

  describe('getCategoryLabel', () => {
    it('returns correct label for analytics', () => {
      expect(getCategoryLabel('analytics')).toBe('Analytics');
    });

    it('returns correct label for marketing', () => {
      expect(getCategoryLabel('marketing')).toBe('Marketing');
    });

    it('returns correct label for crm', () => {
      expect(getCategoryLabel('crm')).toBe('CRM');
    });

    it('returns correct label for communication', () => {
      expect(getCategoryLabel('communication')).toBe('Communication');
    });

    it('returns correct label for automation', () => {
      expect(getCategoryLabel('automation')).toBe('Automation');
    });

    it('returns correct label for ecommerce', () => {
      expect(getCategoryLabel('ecommerce')).toBe('E-commerce');
    });

    it('returns correct label for social', () => {
      expect(getCategoryLabel('social')).toBe('Social Media');
    });
  });

  describe('getCategoryIcon', () => {
    it('returns correct icon for analytics', () => {
      expect(getCategoryIcon('analytics')).toBe('📊');
    });

    it('returns correct icon for marketing', () => {
      expect(getCategoryIcon('marketing')).toBe('📧');
    });

    it('returns correct icon for crm', () => {
      expect(getCategoryIcon('crm')).toBe('👥');
    });

    it('returns correct icon for communication', () => {
      expect(getCategoryIcon('communication')).toBe('💬');
    });

    it('returns correct icon for automation', () => {
      expect(getCategoryIcon('automation')).toBe('⚡');
    });

    it('returns correct icon for ecommerce', () => {
      expect(getCategoryIcon('ecommerce')).toBe('🛍️');
    });

    it('returns correct icon for social', () => {
      expect(getCategoryIcon('social')).toBe('🌐');
    });
  });
});
