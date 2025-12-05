/**
 * Gamification System Types
 */

export interface UserPoints {
  id: string;
  userId: string;
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  pointsToNextLevel: number;
  streak: number;
  lastActivityAt: Date;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: AchievementCategory;
  tier: AchievementTier;
  requirement: number;
  isSecret?: boolean;
}

export interface UserAchievement {
  id: string;
  oderId: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: Date;
  progress: number;
}

export type AchievementCategory =
  | 'exploration' // Viewing programs
  | 'engagement' // Reviews, clicks
  | 'social' // Referrals, sharing
  | 'loyalty' // Daily logins, streaks
  | 'milestone'; // Special milestones

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalPoints: number;
  level: number;
  achievementCount: number;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  points: number;
  type: PointsType;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type PointsType =
  | 'program_view'
  | 'program_click'
  | 'review_submit'
  | 'review_helpful'
  | 'daily_login'
  | 'streak_bonus'
  | 'achievement_unlock'
  | 'referral_signup'
  | 'referral_conversion'
  | 'level_up'
  | 'special_event';

export const POINTS_CONFIG = {
  program_view: 1,
  program_click: 5,
  review_submit: 50,
  review_helpful: 10,
  daily_login: 10,
  streak_bonus_multiplier: 1.5,
  referral_signup: 100,
  referral_conversion: 500,
} as const;

export const LEVEL_THRESHOLDS = [
  0, // Level 1
  100, // Level 2
  300, // Level 3
  600, // Level 4
  1000, // Level 5
  1500, // Level 6
  2200, // Level 7
  3000, // Level 8
  4000, // Level 9
  5500, // Level 10
  7500, // Level 11
  10000, // Level 12
  13000, // Level 13
  17000, // Level 14
  22000, // Level 15
  30000, // Level 16
  40000, // Level 17
  55000, // Level 18
  75000, // Level 19
  100000, // Level 20
];

export function calculateLevel(totalPoints: number): {
  level: number;
  currentLevelPoints: number;
  pointsToNextLevel: number;
} {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const currentLevelPoints = totalPoints - currentThreshold;
  const pointsToNextLevel = nextThreshold - totalPoints;

  return { level, currentLevelPoints, pointsToNextLevel: Math.max(0, pointsToNextLevel) };
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: 'Newcomer',
    2: 'Explorer',
    3: 'Seeker',
    4: 'Apprentice',
    5: 'Enthusiast',
    6: 'Specialist',
    7: 'Expert',
    8: 'Master',
    9: 'Champion',
    10: 'Legend',
    11: 'Elite',
    12: 'Grandmaster',
    13: 'Virtuoso',
    14: 'Titan',
    15: 'Mythic',
    16: 'Immortal',
    17: 'Ascendant',
    18: 'Celestial',
    19: 'Transcendent',
    20: 'Ultimate',
  };
  return titles[Math.min(level, 20)] || 'Ultimate';
}
