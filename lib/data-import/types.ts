// Data import types for affiliate program aggregation

export interface NetworkProgramData {
  externalId: string;
  name: string;
  description?: string;
  category?: string;
  commissionRate?: number;
  commissionType?: string;
  cookieDuration?: number;
  paymentThreshold?: number;
  paymentMethods?: string[];
  programUrl?: string;
  merchantUrl?: string;
  affiliateUrl?: string;
  logoUrl?: string;
  minPayout?: number;
  averageEarnings?: number;
  epc?: number;
  geoTargeting?: string[];
  language?: string[];
  verified?: boolean;
  featured?: boolean;
  popularity?: number;
}

export interface NetworkImportConfig {
  networkName: string;
  networkDescription?: string;
  networkWebsite?: string;
  networkCountry?: string;
  dataSource: 'scraper' | 'api' | 'manual' | 'csv';
  programs: NetworkProgramData[];
}

export interface ImportResult {
  success: boolean;
  networkId?: string;
  programsImported: number;
  programsSkipped: number;
  programsUpdated: number;
  errors: string[];
  duration: number;
}

export interface BulkImportSummary {
  totalNetworks: number;
  totalPrograms: number;
  successfulImports: number;
  failedImports: number;
  results: ImportResult[];
  startTime: Date;
  endTime: Date;
  duration: number;
}
