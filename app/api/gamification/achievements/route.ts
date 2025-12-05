/**
 * Gamification Achievements API
 * Get achievements list and user's unlocked achievements
 */

import { NextRequest, NextResponse } from 'next/server';
import { ACHIEVEMENTS, getAchievementsByCategory } from '@/lib/gamification/achievements';
import { AchievementCategory } from '@/lib/gamification/types';

// In-memory storage for demo (in production, use database)
const userAchievements = new Map<
  string,
  Map<
    string,
    {
      unlockedAt: string;
      progress: number;
    }
  >
>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const category = searchParams.get('category') as AchievementCategory | null;

    // Get user's achievements
    const userUnlocked = userAchievements.get(userId) || new Map();

    // Filter by category if specified
    const achievements = category
      ? getAchievementsByCategory(category)
      : ACHIEVEMENTS.filter((a) => !a.isSecret);

    // Map achievements with user's progress
    const achievementsWithProgress = achievements.map((achievement) => {
      const userProgress = userUnlocked.get(achievement.id);
      return {
        ...achievement,
        unlocked: !!userProgress,
        unlockedAt: userProgress?.unlockedAt || null,
        progress: userProgress?.progress || 0,
        progressPercent: Math.min(
          100,
          ((userProgress?.progress || 0) / achievement.requirement) * 100
        ),
      };
    });

    // Calculate stats
    const totalAchievements = ACHIEVEMENTS.filter((a) => !a.isSecret).length;
    const unlockedCount = Array.from(userUnlocked.keys()).length;
    const totalPoints = Array.from(userUnlocked.keys()).reduce((sum, id) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      return sum + (achievement?.points || 0);
    }, 0);

    return NextResponse.json({
      achievements: achievementsWithProgress,
      stats: {
        total: totalAchievements,
        unlocked: unlockedCount,
        totalPoints,
        completionPercent: Math.round((unlockedCount / totalAchievements) * 100),
      },
      categories: ['exploration', 'engagement', 'social', 'loyalty', 'milestone'],
    });
  } catch (error) {
    console.error('Achievements API error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', achievementId, progress } = body;

    if (!achievementId) {
      return NextResponse.json({ error: 'Achievement ID required' }, { status: 400 });
    }

    // Find achievement
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Get or initialize user's achievements
    let userUnlocked = userAchievements.get(userId);
    if (!userUnlocked) {
      userUnlocked = new Map();
      userAchievements.set(userId, userUnlocked);
    }

    // Check if already unlocked
    const existing = userUnlocked.get(achievementId);
    if (existing?.unlockedAt) {
      return NextResponse.json({
        success: false,
        message: 'Achievement already unlocked',
        achievement: {
          ...achievement,
          unlocked: true,
          unlockedAt: existing.unlockedAt,
        },
      });
    }

    // Update progress
    const newProgress = progress || achievement.requirement;
    const unlocked = newProgress >= achievement.requirement;

    userUnlocked.set(achievementId, {
      unlockedAt: unlocked ? new Date().toISOString() : '',
      progress: newProgress,
    });

    return NextResponse.json({
      success: true,
      unlocked,
      pointsAwarded: unlocked ? achievement.points : 0,
      achievement: {
        ...achievement,
        unlocked,
        unlockedAt: unlocked ? new Date().toISOString() : null,
        progress: newProgress,
        progressPercent: Math.min(100, (newProgress / achievement.requirement) * 100),
      },
    });
  } catch (error) {
    console.error('Unlock achievement API error:', error);
    return NextResponse.json({ error: 'Failed to unlock achievement' }, { status: 500 });
  }
}
