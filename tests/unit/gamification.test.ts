/**
 * Gamification System Tests
 */

import {
  ACHIEVEMENTS,
  getAchievementsByCategory,
  getAchievementById,
  getAchievementByCode,
  getTierColor,
  getTierBgClass,
} from '@/lib/gamification/achievements';

import {
  POINTS_CONFIG,
  LEVEL_THRESHOLDS,
  calculateLevel,
  getLevelTitle,
} from '@/lib/gamification/types';

describe('Gamification System', () => {
  describe('ACHIEVEMENTS', () => {
    it('contains exploration achievements', () => {
      const explorationAchievements = ACHIEVEMENTS.filter((a) => a.category === 'exploration');
      expect(explorationAchievements.length).toBeGreaterThan(0);
      expect(explorationAchievements.some((a) => a.code === 'FIRST_VIEW')).toBe(true);
    });

    it('contains engagement achievements', () => {
      const engagementAchievements = ACHIEVEMENTS.filter((a) => a.category === 'engagement');
      expect(engagementAchievements.length).toBeGreaterThan(0);
      expect(engagementAchievements.some((a) => a.code === 'FIRST_CLICK')).toBe(true);
    });

    it('contains social achievements', () => {
      const socialAchievements = ACHIEVEMENTS.filter((a) => a.category === 'social');
      expect(socialAchievements.length).toBeGreaterThan(0);
      expect(socialAchievements.some((a) => a.code === 'FIRST_REFERRAL')).toBe(true);
    });

    it('contains loyalty achievements', () => {
      const loyaltyAchievements = ACHIEVEMENTS.filter((a) => a.category === 'loyalty');
      expect(loyaltyAchievements.length).toBeGreaterThan(0);
      expect(loyaltyAchievements.some((a) => a.code === 'STREAK_7')).toBe(true);
    });

    it('contains milestone achievements', () => {
      const milestoneAchievements = ACHIEVEMENTS.filter((a) => a.category === 'milestone');
      expect(milestoneAchievements.length).toBeGreaterThan(0);
      expect(milestoneAchievements.some((a) => a.code === 'LEVEL_10')).toBe(true);
    });

    it('contains secret achievements', () => {
      const secretAchievements = ACHIEVEMENTS.filter((a) => a.isSecret === true);
      expect(secretAchievements.length).toBeGreaterThan(0);
      expect(secretAchievements.some((a) => a.code === 'NIGHT_OWL')).toBe(true);
    });

    it('all achievements have required fields', () => {
      ACHIEVEMENTS.forEach((achievement) => {
        expect(achievement.id).toBeDefined();
        expect(achievement.code).toBeDefined();
        expect(achievement.name).toBeDefined();
        expect(achievement.description).toBeDefined();
        expect(achievement.icon).toBeDefined();
        expect(achievement.points).toBeGreaterThan(0);
        expect(achievement.category).toBeDefined();
        expect(achievement.tier).toBeDefined();
        expect(achievement.requirement).toBeGreaterThan(0);
      });
    });

    it('all achievements have unique ids', () => {
      const ids = ACHIEVEMENTS.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all achievements have unique codes', () => {
      const codes = ACHIEVEMENTS.map((a) => a.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });
  });

  describe('getAchievementsByCategory', () => {
    it('returns only non-secret achievements for exploration', () => {
      const achievements = getAchievementsByCategory('exploration');
      expect(achievements.length).toBeGreaterThan(0);
      achievements.forEach((a) => {
        expect(a.category).toBe('exploration');
        expect(a.isSecret).toBeFalsy();
      });
    });

    it('returns only non-secret achievements for engagement', () => {
      const achievements = getAchievementsByCategory('engagement');
      expect(achievements.length).toBeGreaterThan(0);
      achievements.forEach((a) => {
        expect(a.category).toBe('engagement');
        expect(a.isSecret).toBeFalsy();
      });
    });

    it('returns only non-secret achievements for social', () => {
      const achievements = getAchievementsByCategory('social');
      expect(achievements.length).toBeGreaterThan(0);
      achievements.forEach((a) => {
        expect(a.category).toBe('social');
        expect(a.isSecret).toBeFalsy();
      });
    });

    it('returns only non-secret achievements for loyalty', () => {
      const achievements = getAchievementsByCategory('loyalty');
      expect(achievements.length).toBeGreaterThan(0);
      achievements.forEach((a) => {
        expect(a.category).toBe('loyalty');
        expect(a.isSecret).toBeFalsy();
      });
    });

    it('returns only non-secret achievements for milestone', () => {
      const achievements = getAchievementsByCategory('milestone');
      expect(achievements.length).toBeGreaterThan(0);
      achievements.forEach((a) => {
        expect(a.category).toBe('milestone');
        expect(a.isSecret).toBeFalsy();
      });
    });
  });

  describe('getAchievementById', () => {
    it('returns achievement by valid id', () => {
      const achievement = getAchievementById('exp_first_view');
      expect(achievement).toBeDefined();
      expect(achievement?.code).toBe('FIRST_VIEW');
      expect(achievement?.name).toBe('First Steps');
    });

    it('returns undefined for invalid id', () => {
      const achievement = getAchievementById('invalid_id');
      expect(achievement).toBeUndefined();
    });

    it('returns secret achievements by id', () => {
      const achievement = getAchievementById('sec_night_owl');
      expect(achievement).toBeDefined();
      expect(achievement?.isSecret).toBe(true);
    });
  });

  describe('getAchievementByCode', () => {
    it('returns achievement by valid code', () => {
      const achievement = getAchievementByCode('FIRST_VIEW');
      expect(achievement).toBeDefined();
      expect(achievement?.id).toBe('exp_first_view');
      expect(achievement?.name).toBe('First Steps');
    });

    it('returns undefined for invalid code', () => {
      const achievement = getAchievementByCode('INVALID_CODE');
      expect(achievement).toBeUndefined();
    });

    it('returns secret achievements by code', () => {
      const achievement = getAchievementByCode('NIGHT_OWL');
      expect(achievement).toBeDefined();
      expect(achievement?.isSecret).toBe(true);
    });
  });

  describe('getTierColor', () => {
    it('returns correct color for bronze tier', () => {
      expect(getTierColor('bronze')).toBe('#CD7F32');
    });

    it('returns correct color for silver tier', () => {
      expect(getTierColor('silver')).toBe('#C0C0C0');
    });

    it('returns correct color for gold tier', () => {
      expect(getTierColor('gold')).toBe('#FFD700');
    });

    it('returns correct color for platinum tier', () => {
      expect(getTierColor('platinum')).toBe('#E5E4E2');
    });

    it('returns correct color for diamond tier', () => {
      expect(getTierColor('diamond')).toBe('#B9F2FF');
    });
  });

  describe('getTierBgClass', () => {
    it('returns correct class for bronze tier', () => {
      const classes = getTierBgClass('bronze');
      expect(classes).toContain('bg-orange');
      expect(classes).toContain('border-orange');
    });

    it('returns correct class for silver tier', () => {
      const classes = getTierBgClass('silver');
      expect(classes).toContain('bg-gray');
      expect(classes).toContain('border-gray');
    });

    it('returns correct class for gold tier', () => {
      const classes = getTierBgClass('gold');
      expect(classes).toContain('bg-yellow');
      expect(classes).toContain('border-yellow');
    });

    it('returns correct class for platinum tier', () => {
      const classes = getTierBgClass('platinum');
      expect(classes).toContain('bg-purple');
      expect(classes).toContain('border-purple');
    });

    it('returns correct class for diamond tier', () => {
      const classes = getTierBgClass('diamond');
      expect(classes).toContain('bg-cyan');
      expect(classes).toContain('border-cyan');
    });
  });

  describe('POINTS_CONFIG', () => {
    it('has correct point values', () => {
      expect(POINTS_CONFIG.program_view).toBe(1);
      expect(POINTS_CONFIG.program_click).toBe(5);
      expect(POINTS_CONFIG.review_submit).toBe(50);
      expect(POINTS_CONFIG.review_helpful).toBe(10);
      expect(POINTS_CONFIG.daily_login).toBe(10);
      expect(POINTS_CONFIG.streak_bonus_multiplier).toBe(1.5);
      expect(POINTS_CONFIG.referral_signup).toBe(100);
      expect(POINTS_CONFIG.referral_conversion).toBe(500);
    });
  });

  describe('LEVEL_THRESHOLDS', () => {
    it('has 20 levels', () => {
      expect(LEVEL_THRESHOLDS.length).toBe(20);
    });

    it('starts at 0 for level 1', () => {
      expect(LEVEL_THRESHOLDS[0]).toBe(0);
    });

    it('is monotonically increasing', () => {
      for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
        expect(LEVEL_THRESHOLDS[i]).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1]);
      }
    });

    it('ends at 100000 for level 20', () => {
      expect(LEVEL_THRESHOLDS[19]).toBe(100000);
    });
  });

  describe('calculateLevel', () => {
    it('returns level 1 for 0 points', () => {
      const result = calculateLevel(0);
      expect(result.level).toBe(1);
      expect(result.currentLevelPoints).toBe(0);
      expect(result.pointsToNextLevel).toBe(100);
    });

    it('returns level 1 for 50 points', () => {
      const result = calculateLevel(50);
      expect(result.level).toBe(1);
      expect(result.currentLevelPoints).toBe(50);
      expect(result.pointsToNextLevel).toBe(50);
    });

    it('returns level 2 for 100 points', () => {
      const result = calculateLevel(100);
      expect(result.level).toBe(2);
      expect(result.currentLevelPoints).toBe(0);
      expect(result.pointsToNextLevel).toBe(200);
    });

    it('returns level 5 for 1000 points', () => {
      const result = calculateLevel(1000);
      expect(result.level).toBe(5);
      expect(result.currentLevelPoints).toBe(0);
      expect(result.pointsToNextLevel).toBe(500);
    });

    it('returns level 10 for 5500 points', () => {
      const result = calculateLevel(5500);
      expect(result.level).toBe(10);
      expect(result.currentLevelPoints).toBe(0);
      expect(result.pointsToNextLevel).toBe(2000);
    });

    it('returns level 20 for 100000 points', () => {
      const result = calculateLevel(100000);
      expect(result.level).toBe(20);
      expect(result.currentLevelPoints).toBe(0); // 100000 - 100000 threshold = 0
      expect(result.pointsToNextLevel).toBe(0);
    });

    it('returns level 20 for points exceeding max', () => {
      const result = calculateLevel(150000);
      expect(result.level).toBe(20);
      expect(result.pointsToNextLevel).toBe(0);
    });

    it('calculates correct mid-level points', () => {
      const result = calculateLevel(450);
      expect(result.level).toBe(3);
      expect(result.currentLevelPoints).toBe(150);
      expect(result.pointsToNextLevel).toBe(150);
    });
  });

  describe('getLevelTitle', () => {
    it('returns correct title for level 1', () => {
      expect(getLevelTitle(1)).toBe('Newcomer');
    });

    it('returns correct title for level 5', () => {
      expect(getLevelTitle(5)).toBe('Enthusiast');
    });

    it('returns correct title for level 10', () => {
      expect(getLevelTitle(10)).toBe('Legend');
    });

    it('returns correct title for level 15', () => {
      expect(getLevelTitle(15)).toBe('Mythic');
    });

    it('returns correct title for level 20', () => {
      expect(getLevelTitle(20)).toBe('Ultimate');
    });

    it('returns Ultimate for levels above 20', () => {
      expect(getLevelTitle(25)).toBe('Ultimate');
      expect(getLevelTitle(100)).toBe('Ultimate');
    });

    it('returns all expected titles', () => {
      const expectedTitles = [
        'Newcomer',
        'Explorer',
        'Seeker',
        'Apprentice',
        'Enthusiast',
        'Specialist',
        'Expert',
        'Master',
        'Champion',
        'Legend',
        'Elite',
        'Grandmaster',
        'Virtuoso',
        'Titan',
        'Mythic',
        'Immortal',
        'Ascendant',
        'Celestial',
        'Transcendent',
        'Ultimate',
      ];

      for (let i = 1; i <= 20; i++) {
        expect(getLevelTitle(i)).toBe(expectedTitles[i - 1]);
      }
    });
  });
});
