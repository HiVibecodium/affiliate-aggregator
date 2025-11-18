/**
 * API Route tests for /api/analytics/realtime
 */

import { GET } from '@/app/api/analytics/realtime/route';

// Mock Prisma client
const mockPrisma = {
  click: {
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  application: {
    count: jest.fn(),
  },
  program: {
    findUnique: jest.fn(),
  },
};

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

describe('/api/analytics/realtime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return realtime analytics data', async () => {
    // Mock data
    mockPrisma.click.count.mockResolvedValue(150);
    mockPrisma.application.count.mockResolvedValue(25);
    mockPrisma.click.groupBy.mockResolvedValue([
      { programId: '1', _count: { id: 50 } },
      { programId: '2', _count: { id: 30 } },
    ]);
    mockPrisma.program.findUnique.mockImplementation(({ where }) => {
      if (where.id === '1') {
        return Promise.resolve({ id: '1', name: 'Program 1' });
      }
      return Promise.resolve({ id: '2', name: 'Program 2' });
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('activeUsers');
    expect(data).toHaveProperty('clicksToday');
    expect(data).toHaveProperty('conversionsToday');
    expect(data).toHaveProperty('revenueToday');
    expect(data).toHaveProperty('topPrograms');

    expect(data.clicksToday).toBe(150);
    expect(data.conversionsToday).toBe(25);
    expect(Array.isArray(data.topPrograms)).toBe(true);
  });

  it('should calculate revenue correctly', async () => {
    mockPrisma.click.count.mockResolvedValue(100);
    mockPrisma.application.count.mockResolvedValue(10);
    mockPrisma.click.groupBy.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(data.revenueToday).toBe(250); // 10 conversions * $25
  });

  it('should handle top programs data correctly', async () => {
    mockPrisma.click.count.mockResolvedValue(100);
    mockPrisma.application.count.mockResolvedValue(10);
    mockPrisma.click.groupBy.mockResolvedValue([
      { programId: '1', _count: { id: 60 } },
      { programId: '2', _count: { id: 40 } },
    ]);
    mockPrisma.program.findUnique.mockResolvedValue({
      id: '1',
      name: 'Test Program',
    });

    const response = await GET();
    const data = await response.json();

    expect(data.topPrograms).toHaveLength(2);
    expect(data.topPrograms[0]).toHaveProperty('id');
    expect(data.topPrograms[0]).toHaveProperty('name');
    expect(data.topPrograms[0]).toHaveProperty('clicks');
    expect(data.topPrograms[0]).toHaveProperty('conversions');
  });

  it('should handle database errors gracefully', async () => {
    mockPrisma.click.count.mockRejectedValue(new Error('Database error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Failed to fetch realtime analytics');
  });

  it('should filter data by today only', async () => {
    mockPrisma.click.count.mockResolvedValue(0);
    mockPrisma.application.count.mockResolvedValue(0);
    mockPrisma.click.groupBy.mockResolvedValue([]);

    await GET();

    const calls = mockPrisma.click.count.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toHaveProperty('where');
    expect(calls[0][0].where).toHaveProperty('createdAt');
    expect(calls[0][0].where.createdAt).toHaveProperty('gte');
  });
});
