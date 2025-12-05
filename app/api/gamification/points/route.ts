/**
 * Gamification Points API
 * Get user points and award new points
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateLevel, getLevelTitle, POINTS_CONFIG, PointsType } from '@/lib/gamification/types';

// In-memory storage for demo (in production, use database)
const userPoints = new Map<
  string,
  {
    totalPoints: number;
    streak: number;
    lastLoginDate: string;
    transactions: Array<{
      id: string;
      type: PointsType;
      points: number;
      description: string;
      createdAt: string;
    }>;
  }
>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    // Get or initialize user data
    let userData = userPoints.get(userId);
    if (!userData) {
      userData = {
        totalPoints: 0,
        streak: 0,
        lastLoginDate: '',
        transactions: [],
      };
      userPoints.set(userId, userData);
    }

    const levelInfo = calculateLevel(userData.totalPoints);

    return NextResponse.json({
      userId,
      totalPoints: userData.totalPoints,
      level: levelInfo.level,
      levelTitle: getLevelTitle(levelInfo.level),
      currentLevelPoints: levelInfo.currentLevelPoints,
      pointsToNextLevel: levelInfo.pointsToNextLevel,
      streak: userData.streak,
      recentTransactions: userData.transactions.slice(-10).reverse(),
    });
  } catch (error) {
    console.error('Points API error:', error);
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', type, description } = body;

    // Validate points type
    if (!type || !(type in POINTS_CONFIG)) {
      return NextResponse.json({ error: 'Invalid points type' }, { status: 400 });
    }

    // Get or initialize user data
    let userData = userPoints.get(userId);
    if (!userData) {
      userData = {
        totalPoints: 0,
        streak: 0,
        lastLoginDate: '',
        transactions: [],
      };
      userPoints.set(userId, userData);
    }

    // Calculate points (with streak bonus for daily login)
    let points: number = POINTS_CONFIG[type as keyof typeof POINTS_CONFIG] || 0;
    const today = new Date().toISOString().split('T')[0];

    if (type === 'daily_login') {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (userData.lastLoginDate === today) {
        return NextResponse.json({
          message: 'Already logged in today',
          pointsAwarded: 0,
          totalPoints: userData.totalPoints,
        });
      }

      if (userData.lastLoginDate === yesterday) {
        userData.streak++;
        // Apply streak bonus
        points = Math.floor(points * (1 + (userData.streak - 1) * 0.1));
      } else {
        userData.streak = 1;
      }

      userData.lastLoginDate = today;
    }

    // Award points
    userData.totalPoints += points;

    // Record transaction
    const transaction = {
      id: `txn_${Date.now()}`,
      type: type as PointsType,
      points,
      description: description || getDefaultDescription(type as PointsType),
      createdAt: new Date().toISOString(),
    };
    userData.transactions.push(transaction);

    // Keep only last 100 transactions
    if (userData.transactions.length > 100) {
      userData.transactions = userData.transactions.slice(-100);
    }

    const levelInfo = calculateLevel(userData.totalPoints);
    const previousLevel = calculateLevel(userData.totalPoints - points).level;
    const leveledUp = levelInfo.level > previousLevel;

    return NextResponse.json({
      success: true,
      pointsAwarded: points,
      totalPoints: userData.totalPoints,
      level: levelInfo.level,
      levelTitle: getLevelTitle(levelInfo.level),
      leveledUp,
      streak: userData.streak,
      transaction,
    });
  } catch (error) {
    console.error('Award points API error:', error);
    return NextResponse.json({ error: 'Failed to award points' }, { status: 500 });
  }
}

function getDefaultDescription(type: PointsType): string {
  const descriptions: Record<PointsType, string> = {
    program_view: 'Viewed a program',
    program_click: 'Clicked through to a program',
    review_submit: 'Submitted a review',
    review_helpful: 'Review marked as helpful',
    daily_login: 'Daily login bonus',
    streak_bonus: 'Streak bonus',
    achievement_unlock: 'Unlocked an achievement',
    referral_signup: 'Friend signed up via referral',
    referral_conversion: 'Referral made a conversion',
    level_up: 'Level up bonus',
    special_event: 'Special event bonus',
  };
  return descriptions[type] || 'Points awarded';
}
