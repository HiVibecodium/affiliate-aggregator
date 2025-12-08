'use client';

import useSWR from 'swr';

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: string;
  cookieDuration: number;
  paymentThreshold: number;
  paymentMethods: string[];
  createdAt: string;
  network: {
    name: string;
    website: string;
  };
}

interface ProgramsResponse {
  programs: Program[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProgramFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  network?: string;
  category?: string;
  commissionType?: string;
  country?: string;
  search?: string;
  minCommission?: string;
  maxCommission?: string;
  paymentMethod?: string;
  minCookieDuration?: string;
  maxCookieDuration?: string;
  minPaymentThreshold?: string;
  maxPaymentThreshold?: string;
  hasReviews?: boolean;
  paymentFrequency?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePrograms(filters: ProgramFilters = {}) {
  const params = new URLSearchParams({
    page: (filters.page || 1).toString(),
    limit: (filters.limit || 20).toString(),
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
    ...(filters.network && { network: filters.network }),
    ...(filters.category && { category: filters.category }),
    ...(filters.commissionType && { commissionType: filters.commissionType }),
    ...(filters.country && { country: filters.country }),
    ...(filters.search && { search: filters.search }),
    ...(filters.minCommission && { minCommission: filters.minCommission }),
    ...(filters.maxCommission && { maxCommission: filters.maxCommission }),
    ...(filters.paymentMethod && { paymentMethod: filters.paymentMethod }),
    ...(filters.minCookieDuration && { minCookieDuration: filters.minCookieDuration }),
    ...(filters.maxCookieDuration && { maxCookieDuration: filters.maxCookieDuration }),
    ...(filters.minPaymentThreshold && { minPaymentThreshold: filters.minPaymentThreshold }),
    ...(filters.maxPaymentThreshold && { maxPaymentThreshold: filters.maxPaymentThreshold }),
    ...(filters.hasReviews && { hasReviews: 'true' }),
    ...(filters.paymentFrequency && { paymentFrequency: filters.paymentFrequency }),
  });

  const { data, error, isLoading, mutate } = useSWR<ProgramsResponse>(
    `/api/programs?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute deduplication
      keepPreviousData: true,
    }
  );

  return {
    programs: data?.programs || [],
    pagination: data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProgram(id: string | null) {
  const { data, error, isLoading } = useSWR<Program>(id ? `/api/programs/${id}` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes for individual programs
  });

  return {
    program: data,
    isLoading,
    isError: error,
  };
}

export function useStats() {
  const { data, error, isLoading } = useSWR<{
    totalPrograms: number;
    totalNetworks: number;
    networks: { name: string; programs: number }[];
  }>('/api/programs/stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}

export function useFilters(params?: {
  network?: string;
  category?: string;
  commissionType?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params?.network) queryParams.set('network', params.network);
  if (params?.category) queryParams.set('category', params.category);
  if (params?.commissionType) queryParams.set('commissionType', params.commissionType);

  const url = queryParams.toString()
    ? `/api/programs/filters?${queryParams}`
    : '/api/programs/filters';

  const { data, error, isLoading } = useSWR<{
    categories: { value: string; count: number }[];
    commissionTypes: { value: string; count: number }[];
    countries: { value: string; count: number }[];
    commissionRange: { min: number; max: number };
  }>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    filters: data,
    isLoading,
    isError: error,
  };
}

export function useSearchSuggestions(query: string) {
  const { data, error, isLoading } = useSWR<{
    suggestions: { id: string; name: string; network: string; commissionRate: number }[];
  }>(
    query.length >= 2 ? `/api/programs/search?q=${encodeURIComponent(query)}&limit=5` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds for search
    }
  );

  return {
    suggestions: data?.suggestions || [],
    isLoading,
    isError: error,
  };
}
