/**
 * Country code to name mapping
 * ISO 3166-1 alpha-2 codes
 */

export interface CountryInfo {
  code: string;
  name: string;
  flag: string; // Emoji flag
  region: string;
}

export const COUNTRIES: Record<string, CountryInfo> = {
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    region: 'North America',
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'North America',
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
  },
  FR: {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    region: 'Europe',
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    region: 'Europe',
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    region: 'Europe',
  },
  SE: {
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    region: 'Europe',
  },
  IN: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    region: 'Asia',
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
  },
  CN: {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    region: 'Asia',
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    region: 'South America',
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    flag: '🇲🇽',
    region: 'North America',
  },
};

/**
 * Get country info by code
 */
export function getCountryInfo(code: string): CountryInfo | null {
  return COUNTRIES[code.toUpperCase()] || null;
}

/**
 * Get formatted country name with flag
 */
export function getCountryDisplay(code: string): string {
  const info = getCountryInfo(code);
  if (!info) return code;
  return `${info.flag} ${info.name}`;
}

/**
 * Get all available countries
 */
export function getAllCountries(): CountryInfo[] {
  return Object.values(COUNTRIES);
}
