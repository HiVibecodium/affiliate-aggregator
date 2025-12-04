import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Get active users (simulated - in production you'd track actual sessions)
    const activeUsers = Math.floor(Math.random() * 100) + 50;

    // Mock data for demonstration
    // In production, these would come from your database
    const clicksToday = Math.floor(Math.random() * 500) + 100;
    const conversionsToday = Math.floor(Math.random() * 50) + 10;
    const revenueToday = conversionsToday * 25; // Assuming $25 avg commission

    // Mock top performing programs
    const topPrograms = [
      {
        id: '1',
        name: 'Amazon Associates',
        clicks: Math.floor(Math.random() * 200) + 50,
        conversions: Math.floor(Math.random() * 20) + 5,
      },
      {
        id: '2',
        name: 'ShareASale Programs',
        clicks: Math.floor(Math.random() * 150) + 40,
        conversions: Math.floor(Math.random() * 15) + 3,
      },
      {
        id: '3',
        name: 'CJ Affiliate',
        clicks: Math.floor(Math.random() * 120) + 30,
        conversions: Math.floor(Math.random() * 12) + 2,
      },
      {
        id: '4',
        name: 'Rakuten Marketing',
        clicks: Math.floor(Math.random() * 100) + 25,
        conversions: Math.floor(Math.random() * 10) + 2,
      },
      {
        id: '5',
        name: 'Awin Network',
        clicks: Math.floor(Math.random() * 90) + 20,
        conversions: Math.floor(Math.random() * 8) + 1,
      },
    ];

    return NextResponse.json({
      activeUsers,
      clicksToday,
      conversionsToday,
      revenueToday,
      topPrograms,
    });
  } catch (error) {
    logger.error('Error fetching realtime analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch realtime analytics' }, { status: 500 });
  }
}
