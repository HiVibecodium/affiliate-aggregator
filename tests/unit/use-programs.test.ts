/**
 * usePrograms Hooks Tests
 */

import { renderHook, waitFor as _waitFor } from '@testing-library/react';
import {
  usePrograms,
  useProgram,
  useStats,
  useFilters,
  useSearchSuggestions,
} from '@/hooks/usePrograms';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useSWR from 'swr';

const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

describe('usePrograms Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('usePrograms', () => {
    const mockProgramsData = {
      programs: [
        {
          id: '1',
          name: 'Amazon Associates',
          description: 'Top affiliate program',
          category: 'E-commerce',
          commissionRate: 10,
          commissionType: 'CPS',
          cookieDuration: 30,
          paymentThreshold: 10,
          paymentMethods: ['Bank Transfer'],
          createdAt: '2024-01-01',
          network: { name: 'Amazon', website: 'https://amazon.com' },
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      },
    };

    it('returns programs and pagination data', () => {
      mockUseSWR.mockReturnValue({
        data: mockProgramsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      });

      const { result } = renderHook(() => usePrograms());

      expect(result.current.programs).toEqual(mockProgramsData.programs);
      expect(result.current.pagination).toEqual(mockProgramsData.pagination);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBeUndefined();
    });

    it('returns empty arrays when data is undefined', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
        isValidating: false,
      });

      const { result } = renderHook(() => usePrograms());

      expect(result.current.programs).toEqual([]);
      expect(result.current.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    });

    it('passes filters to URL params', () => {
      mockUseSWR.mockReturnValue({
        data: mockProgramsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      });

      const filters = {
        page: 2,
        limit: 50,
        network: 'ShareASale',
        category: 'Finance',
        search: 'amazon',
        minCommission: '10',
        maxCommission: '50',
      };

      renderHook(() => usePrograms(filters));

      const calledUrl = mockUseSWR.mock.calls[0][0];
      expect(calledUrl).toContain('page=2');
      expect(calledUrl).toContain('limit=50');
      expect(calledUrl).toContain('network=ShareASale');
      expect(calledUrl).toContain('category=Finance');
      expect(calledUrl).toContain('search=amazon');
      expect(calledUrl).toContain('minCommission=10');
      expect(calledUrl).toContain('maxCommission=50');
    });

    it('uses default values for page and limit', () => {
      mockUseSWR.mockReturnValue({
        data: mockProgramsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      });

      renderHook(() => usePrograms({}));

      const calledUrl = mockUseSWR.mock.calls[0][0];
      expect(calledUrl).toContain('page=1');
      expect(calledUrl).toContain('limit=20');
      expect(calledUrl).toContain('sortBy=createdAt');
      expect(calledUrl).toContain('sortOrder=desc');
    });

    it('handles error state', () => {
      const mockError = new Error('Failed to fetch');
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: mockError,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      });

      const { result } = renderHook(() => usePrograms());

      expect(result.current.isError).toBe(mockError);
    });

    it('returns mutate function', () => {
      const mockMutate = jest.fn();
      mockUseSWR.mockReturnValue({
        data: mockProgramsData,
        error: undefined,
        isLoading: false,
        mutate: mockMutate,
        isValidating: false,
      });

      const { result } = renderHook(() => usePrograms());

      expect(result.current.mutate).toBe(mockMutate);
    });
  });

  describe('useProgram', () => {
    const mockProgram = {
      id: '123',
      name: 'Test Program',
      description: 'Test description',
      category: 'Tech',
      commissionRate: 15,
      commissionType: 'CPS',
      cookieDuration: 60,
      paymentThreshold: 50,
      paymentMethods: ['PayPal'],
      createdAt: '2024-01-01',
      network: { name: 'TestNet', website: 'https://testnet.com' },
    };

    it('fetches program by id', () => {
      mockUseSWR.mockReturnValue({
        data: mockProgram,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      const { result } = renderHook(() => useProgram('123'));

      expect(result.current.program).toEqual(mockProgram);
      expect(result.current.isLoading).toBe(false);
      expect(mockUseSWR).toHaveBeenCalledWith(
        '/api/programs/123',
        expect.any(Function),
        expect.any(Object)
      );
    });

    it('returns null when id is null', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      renderHook(() => useProgram(null));

      expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function), expect.any(Object));
    });

    it('handles loading state', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        isValidating: false,
      });

      const { result } = renderHook(() => useProgram('123'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.program).toBeUndefined();
    });
  });

  describe('useStats', () => {
    const mockStats = {
      totalPrograms: 80000,
      totalNetworks: 6,
      networks: [
        { name: 'ShareASale', programs: 15000 },
        { name: 'CJ Affiliate', programs: 20000 },
      ],
    };

    it('returns stats data', () => {
      mockUseSWR.mockReturnValue({
        data: mockStats,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      const { result } = renderHook(() => useStats());

      expect(result.current.stats).toEqual(mockStats);
      expect(result.current.isLoading).toBe(false);
      expect(mockUseSWR).toHaveBeenCalledWith(
        '/api/programs/stats',
        expect.any(Function),
        expect.any(Object)
      );
    });

    it('handles error state', () => {
      const mockError = new Error('Stats error');
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: mockError,
        isLoading: false,
        isValidating: false,
      });

      const { result } = renderHook(() => useStats());

      expect(result.current.isError).toBe(mockError);
    });
  });

  describe('useFilters', () => {
    const mockFilters = {
      categories: [
        { value: 'Finance', count: 100 },
        { value: 'Tech', count: 200 },
      ],
      commissionTypes: [
        { value: 'CPS', count: 500 },
        { value: 'CPA', count: 300 },
      ],
      countries: [
        { value: 'US', count: 1000 },
        { value: 'UK', count: 500 },
      ],
      commissionRange: { min: 1, max: 100 },
    };

    it('returns filter options', () => {
      mockUseSWR.mockReturnValue({
        data: mockFilters,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      const { result } = renderHook(() => useFilters());

      expect(result.current.filters).toEqual(mockFilters);
      expect(result.current.isLoading).toBe(false);
    });

    it('builds query params from provided filters', () => {
      mockUseSWR.mockReturnValue({
        data: mockFilters,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      renderHook(() =>
        useFilters({
          network: 'ShareASale',
          category: 'Finance',
          commissionType: 'CPS',
        })
      );

      const calledUrl = mockUseSWR.mock.calls[0][0];
      expect(calledUrl).toContain('network=ShareASale');
      expect(calledUrl).toContain('category=Finance');
      expect(calledUrl).toContain('commissionType=CPS');
    });

    it('uses base URL without params when no filters provided', () => {
      mockUseSWR.mockReturnValue({
        data: mockFilters,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      renderHook(() => useFilters());

      expect(mockUseSWR).toHaveBeenCalledWith(
        '/api/programs/filters',
        expect.any(Function),
        expect.any(Object)
      );
    });
  });

  describe('useSearchSuggestions', () => {
    const mockSuggestions = {
      suggestions: [
        { id: '1', name: 'Amazon Associates', network: 'Amazon', commissionRate: 10 },
        { id: '2', name: 'Amazon Prime', network: 'Amazon', commissionRate: 5 },
      ],
    };

    it('returns suggestions when query has 2+ characters', () => {
      mockUseSWR.mockReturnValue({
        data: mockSuggestions,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      const { result } = renderHook(() => useSearchSuggestions('am'));

      expect(result.current.suggestions).toEqual(mockSuggestions.suggestions);
    });

    it('returns empty array when query is too short', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      const { result } = renderHook(() => useSearchSuggestions('a'));

      expect(result.current.suggestions).toEqual([]);
      expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function), expect.any(Object));
    });

    it('encodes query in URL', () => {
      mockUseSWR.mockReturnValue({
        data: mockSuggestions,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      renderHook(() => useSearchSuggestions('test query'));

      const calledUrl = mockUseSWR.mock.calls[0][0];
      expect(calledUrl).toContain('q=test%20query');
      expect(calledUrl).toContain('limit=5');
    });

    it('returns empty suggestions when data is undefined', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        isValidating: false,
      });

      const { result } = renderHook(() => useSearchSuggestions('amazon'));

      expect(result.current.suggestions).toEqual([]);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('SWR Configuration', () => {
    it('usePrograms has correct SWR config', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      });

      renderHook(() => usePrograms());

      const config = mockUseSWR.mock.calls[0][2];
      expect(config.revalidateOnFocus).toBe(false);
      expect(config.revalidateOnReconnect).toBe(false);
      expect(config.dedupingInterval).toBe(60000);
      expect(config.keepPreviousData).toBe(true);
    });

    it('useProgram has correct SWR config', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      renderHook(() => useProgram('123'));

      const config = mockUseSWR.mock.calls[0][2];
      expect(config.revalidateOnFocus).toBe(false);
      expect(config.dedupingInterval).toBe(300000); // 5 minutes
    });

    it('useStats has correct SWR config', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      renderHook(() => useStats());

      const config = mockUseSWR.mock.calls[0][2];
      expect(config.revalidateOnFocus).toBe(false);
      expect(config.dedupingInterval).toBe(300000);
    });

    it('useSearchSuggestions has correct SWR config', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        isValidating: false,
      });

      renderHook(() => useSearchSuggestions('test'));

      const config = mockUseSWR.mock.calls[0][2];
      expect(config.revalidateOnFocus).toBe(false);
      expect(config.dedupingInterval).toBe(30000); // 30 seconds for search
    });
  });
});
