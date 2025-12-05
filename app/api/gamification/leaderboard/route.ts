/**
 * Gamification Leaderboard API
 * Get top users by points
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateLevel, getLevelTitle } from '@/lib/gamification/types';

// Sample leaderboard data (in production, fetch from database)
const sampleUsers = [
  { id: 'user1', name: 'Alex Johnson', totalPoints: 15420, achievementCount: 28 },
  { id: 'user2', name: 'Maria Garcia', totalPoints: 12850, achievementCount: 24 },
  { id: 'user3', name: 'James Wilson', totalPoints: 11200, achievementCount: 22 },
  { id: 'user4', name: 'Emma Davis', totalPoints: 9870, achievementCount: 19 },
  { id: 'user5', name: 'Michael Brown', totalPoints: 8540, achievementCount: 17 },
  { id: 'user6', name: 'Sophie Martinez', totalPoints: 7320, achievementCount: 15 },
  { id: 'user7', name: 'David Lee', totalPoints: 6100, achievementCount: 14 },
  { id: 'user8', name: 'Olivia Taylor', totalPoints: 5400, achievementCount: 12 },
  { id: 'user9', name: 'Daniel Anderson', totalPoints: 4800, achievementCount: 11 },
  { id: 'user10', name: 'Isabella Thomas', totalPoints: 4200, achievementCount: 10 },
  { id: 'user11', name: 'William Jackson', totalPoints: 3800, achievementCount: 9 },
  { id: 'user12', name: 'Ava White', totalPoints: 3500, achievementCount: 8 },
  { id: 'user13', name: 'Joseph Harris', totalPoints: 3100, achievementCount: 8 },
  { id: 'user14', name: 'Mia Martin', totalPoints: 2800, achievementCount: 7 },
  { id: 'user15', name: 'Christopher Clark', totalPoints: 2500, achievementCount: 6 },
  { id: 'user16', name: 'Emily Lewis', totalPoints: 2200, achievementCount: 6 },
  { id: 'user17', name: 'Matthew Robinson', totalPoints: 1900, achievementCount: 5 },
  { id: 'user18', name: 'Abigail Walker', totalPoints: 1600, achievementCount: 5 },
  { id: 'user19', name: 'Andrew Hall', totalPoints: 1300, achievementCount: 4 },
  { id: 'user20', name: 'Elizabeth Young', totalPoints: 1000, achievementCount: 3 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, monthly, weekly
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId') || 'demo-user';

    // Apply period filter (simulated - in production, filter by date)
    let multiplier = 1;
    if (period === 'monthly') multiplier = 0.3;
    if (period === 'weekly') multiplier = 0.1;

    // Build leaderboard
    const leaderboard = sampleUsers
      .map((user, index) => {
        const adjustedPoints = Math.floor(user.totalPoints * multiplier);
        const levelInfo = calculateLevel(adjustedPoints);
        return {
          rank: index + 1,
          userId: user.id,
          userName: user.name,
          totalPoints: adjustedPoints,
          level: levelInfo.level,
          levelTitle: getLevelTitle(levelInfo.level),
          achievementCount: user.achievementCount,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    // Find current user's rank
    const demoUser = {
      id: userId,
      name: 'You',
      totalPoints: Math.floor(2350 * multiplier),
      achievementCount: 6,
    };
    const demoLevelInfo = calculateLevel(demoUser.totalPoints);
    const allWithDemo = [
      ...leaderboard,
      {
        ...demoUser,
        rank: 0,
        level: demoLevelInfo.level,
        levelTitle: getLevelTitle(demoLevelInfo.level),
        userName: demoUser.name,
        userId: demoUser.id,
      },
    ]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    const currentUserRank = allWithDemo.find((e) => e.userId === userId);

    // Paginate
    const paginatedLeaderboard = leaderboard.slice(offset, offset + limit);

    return NextResponse.json({
      leaderboard: paginatedLeaderboard,
      currentUser: currentUserRank
        ? {
            rank: currentUserRank.rank,
            totalPoints: currentUserRank.totalPoints,
            level: currentUserRank.level,
            levelTitle: currentUserRank.levelTitle,
            achievementCount: currentUserRank.achievementCount,
          }
        : null,
      pagination: {
        total: leaderboard.length,
        limit,
        offset,
        hasMore: offset + limit < leaderboard.length,
      },
      period,
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
