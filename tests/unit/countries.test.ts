/**
 * Unit tests for countries utility
 */

import { COUNTRIES, CountryInfo } from '@/lib/countries';

describe('Countries', () => {
  it('should have country data', () => {
    expect(COUNTRIES).toBeDefined();
    expect(typeof COUNTRIES).toBe('object');
  });

  it('should have US country data', () => {
    expect(COUNTRIES.US).toBeDefined();
    expect(COUNTRIES.US.name).toBe('United States');
    expect(COUNTRIES.US.code).toBe('US');
    expect(COUNTRIES.US.flag).toBe('🇺🇸');
    expect(COUNTRIES.US.region).toBe('North America');
  });

  it('should have all required fields for each country', () => {
    Object.values(COUNTRIES).forEach((country: CountryInfo) => {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('name');
      expect(country).toHaveProperty('flag');
      expect(country).toHaveProperty('region');

      expect(typeof country.code).toBe('string');
      expect(typeof country.name).toBe('string');
      expect(typeof country.flag).toBe('string');
      expect(typeof country.region).toBe('string');
    });
  });

  it('should have common countries', () => {
    const commonCountries = ['US', 'GB', 'CA', 'AU', 'DE', 'FR'];

    commonCountries.forEach((code) => {
      expect(COUNTRIES[code]).toBeDefined();
    });
  });

  it('should have unique country codes', () => {
    const codes = Object.keys(COUNTRIES);
    const uniqueCodes = new Set(codes);

    expect(codes.length).toBe(uniqueCodes.size);
  });

  it('should have valid 2-letter country codes', () => {
    Object.keys(COUNTRIES).forEach((code) => {
      expect(code).toMatch(/^[A-Z]{2}$/);
    });
  });

  it('should have emoji flags', () => {
    Object.values(COUNTRIES).forEach((country: CountryInfo) => {
      // Emoji flags should be present
      expect(country.flag).toBeTruthy();
      expect(country.flag.length).toBeGreaterThan(0);
    });
  });

  it('should have valid regions', () => {
    const validRegions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];

    Object.values(COUNTRIES).forEach((country: CountryInfo) => {
      expect(validRegions).toContain(country.region);
    });
  });

  it('should have European countries', () => {
    const europeanCountries = Object.values(COUNTRIES).filter(
      (c: CountryInfo) => c.region === 'Europe'
    );

    expect(europeanCountries.length).toBeGreaterThan(0);
  });

  it('should have Asian countries', () => {
    const asianCountries = Object.values(COUNTRIES).filter((c: CountryInfo) => c.region === 'Asia');

    expect(asianCountries.length).toBeGreaterThan(0);
  });

  it('should match code with object key', () => {
    Object.entries(COUNTRIES).forEach(([key, country]) => {
      expect(country.code).toBe(key);
    });
  });
});
