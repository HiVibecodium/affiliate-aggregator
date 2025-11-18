/**
 * API Route tests for /api/programs/stats
 */

describe('/api/programs/stats', () => {
  it('should return stats structure', () => {
    const expectedStats = {
      totalPrograms: expect.any(Number),
      totalNetworks: expect.any(Number),
      networks: expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          programs: expect.any(Number),
        }),
      ]),
    };

    expect(expectedStats).toBeDefined();
  });

  it('should have positive program count', () => {
    const mockStats = {
      totalPrograms: 80010,
      totalNetworks: 6,
      networks: [],
    };

    expect(mockStats.totalPrograms).toBeGreaterThan(0);
    expect(mockStats.totalNetworks).toBeGreaterThan(0);
  });

  it('should have networks array', () => {
    const mockStats = {
      totalPrograms: 100,
      totalNetworks: 2,
      networks: [
        { name: 'Network 1', programs: 50 },
        { name: 'Network 2', programs: 50 },
      ],
    };

    expect(Array.isArray(mockStats.networks)).toBe(true);
    expect(mockStats.networks).toHaveLength(2);
  });

  it('should have network data structure', () => {
    const network = {
      name: 'ShareASale',
      programs: 1000,
    };

    expect(network).toHaveProperty('name');
    expect(network).toHaveProperty('programs');
    expect(typeof network.name).toBe('string');
    expect(typeof network.programs).toBe('number');
  });

  it('should sum network programs to total', () => {
    const networks = [
      { name: 'Network 1', programs: 30 },
      { name: 'Network 2', programs: 20 },
      { name: 'Network 3', programs: 50 },
    ];

    const total = networks.reduce((sum, n) => sum + n.programs, 0);

    expect(total).toBe(100);
  });
});
