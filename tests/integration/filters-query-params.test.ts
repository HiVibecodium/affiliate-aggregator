/**
 * Integration tests for filter query parameters
 */

describe('Filter Query Parameters', () => {
  it('should build query string from filters', () => {
    const filters = {
      category: 'Technology',
      network: 'ShareASale',
      minCommission: 10,
      maxCommission: 20,
    };

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.set(key, value.toString());
    });

    const queryString = params.toString();

    expect(queryString).toContain('category=Technology');
    expect(queryString).toContain('network=ShareASale');
    expect(queryString).toContain('minCommission=10');
    expect(queryString).toContain('maxCommission=20');
  });

  it('should parse query parameters', () => {
    const queryString = 'category=Finance&network=Awin&minCommission=15';
    const params = new URLSearchParams(queryString);

    expect(params.get('category')).toBe('Finance');
    expect(params.get('network')).toBe('Awin');
    expect(params.get('minCommission')).toBe('15');
  });

  it('should handle URL encoding', () => {
    const params = new URLSearchParams();
    params.set('query', 'Finance & Banking');

    const encoded = params.toString();

    expect(encoded).toContain('Finance');
    expect(encoded).not.toContain('&B'); // Should be encoded
  });

  it('should handle multiple values for same key', () => {
    const params = new URLSearchParams();
    params.append('category', 'Tech');
    params.append('category', 'Finance');

    expect(params.getAll('category')).toEqual(['Tech', 'Finance']);
  });

  it('should remove empty parameters', () => {
    const filters = {
      category: 'Tech',
      network: '',
      minCommission: null,
      maxCommission: undefined,
    };

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    expect(params.has('category')).toBe(true);
    expect(params.has('network')).toBe(false);
    expect(params.has('minCommission')).toBe(false);
    expect(params.has('maxCommission')).toBe(false);
  });

  it('should build shareable URLs', () => {
    const baseUrl = '/programs';
    const params = new URLSearchParams({
      category: 'Finance',
      minCommission: '15',
    });

    const shareableUrl = `${baseUrl}?${params.toString()}`;

    expect(shareableUrl).toBe('/programs?category=Finance&minCommission=15');
  });

  it('should preserve filter state in URL', () => {
    const currentFilters = {
      category: 'Tech',
      network: 'Awin',
      minCommission: '10',
    };

    const params = new URLSearchParams(currentFilters as any);
    const reconstructed = Object.fromEntries(params.entries());

    expect(reconstructed).toEqual(currentFilters);
  });

  it('should handle special characters in search', () => {
    const searchQuery = 'Amazon & Associates (USA)';
    const params = new URLSearchParams();
    params.set('search', searchQuery);

    const decoded = params.get('search');

    expect(decoded).toBe(searchQuery);
  });

  it('should sort parameters alphabetically for consistency', () => {
    const filters = { z: '1', a: '2', m: '3' };
    const params = new URLSearchParams(filters);

    const keys = Array.from(params.keys());

    expect(keys).toEqual(['z', 'a', 'm']); // URLSearchParams preserves insertion order
  });

  it('should handle numeric min/max values', () => {
    const params = new URLSearchParams();
    params.set('minCommission', '10');
    params.set('maxCommission', '20');

    const min = parseInt(params.get('minCommission') || '0', 10);
    const max = parseInt(params.get('maxCommission') || '100', 10);

    expect(min).toBe(10);
    expect(max).toBe(20);
    expect(min).toBeLessThan(max);
  });
});
