/**
 * Unit tests for SEO metadata helpers
 */

import { defaultMetadata } from '@/lib/seo/metadata';

describe('SEO Metadata', () => {
  describe('defaultMetadata', () => {
    it('should have required fields', () => {
      expect(defaultMetadata).toHaveProperty('title');
      expect(defaultMetadata).toHaveProperty('description');
      expect(defaultMetadata).toHaveProperty('keywords');
    });

    it('should have title configuration', () => {
      expect(defaultMetadata.title).toHaveProperty('default');
      expect(defaultMetadata.title).toHaveProperty('template');

      const title = defaultMetadata.title as { default: string; template: string };
      expect(title.default).toBe('Affiliate Aggregator');
      expect(title.template).toContain('%s');
    });

    it('should have description', () => {
      expect(typeof defaultMetadata.description).toBe('string');
      expect((defaultMetadata.description as string).length).toBeGreaterThan(0);
    });

    it('should have keywords array', () => {
      expect(Array.isArray(defaultMetadata.keywords)).toBe(true);
      const keywords = defaultMetadata.keywords as string[];
      expect(keywords.length).toBeGreaterThan(0);
    });

    it('should include relevant keywords', () => {
      const keywords = defaultMetadata.keywords as string[];
      expect(keywords).toContain('affiliate programs');
      expect(keywords).toContain('affiliate marketing');
    });

    it('should have OpenGraph metadata', () => {
      expect(defaultMetadata).toHaveProperty('openGraph');
      expect(defaultMetadata.openGraph).toHaveProperty('type');
      expect(defaultMetadata.openGraph).toHaveProperty('siteName');
      expect(defaultMetadata.openGraph).toHaveProperty('title');
      expect(defaultMetadata.openGraph).toHaveProperty('description');
    });

    it('should have Twitter metadata', () => {
      expect(defaultMetadata).toHaveProperty('twitter');
      expect(defaultMetadata.twitter).toHaveProperty('card');
      expect(defaultMetadata.twitter).toHaveProperty('title');
      expect(defaultMetadata.twitter?.card).toBe('summary_large_image');
    });

    it('should have robots configuration', () => {
      expect(defaultMetadata).toHaveProperty('robots');
      expect(defaultMetadata.robots).toHaveProperty('index');
      expect(defaultMetadata.robots).toHaveProperty('follow');

      const robots = defaultMetadata.robots as any;
      expect(robots.index).toBe(true);
      expect(robots.follow).toBe(true);
    });

    it('should have Google verification', () => {
      expect(defaultMetadata).toHaveProperty('verification');
      expect(defaultMetadata.verification).toHaveProperty('google');
    });

    it('should have authors info', () => {
      expect(Array.isArray(defaultMetadata.authors)).toBe(true);
    });

    it('should have creator info', () => {
      expect(defaultMetadata.creator).toBeTruthy();
    });

    it('should have publisher info', () => {
      expect(defaultMetadata.publisher).toBeTruthy();
    });
  });
});
