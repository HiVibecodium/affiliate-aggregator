'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getTierBgClass } from '@/lib/gamification/achievements';
import { AchievementTier } from '@/lib/gamification/types';

interface UserPoints {
  totalPoints: number;
  level: number;
  levelTitle: string;
  currentLevelPoints: number;
  pointsToNextLevel: number;
  streak: number;
}

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  tier: AchievementTier;
  category: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  progressPercent: number;
  requirement: number;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalPoints: number;
  level: number;
  levelTitle: string;
  achievementCount: number;
}

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard'>(
    'overview'
  );
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementStats, setAchievementStats] = useState({
    total: 0,
    unlocked: 0,
    totalPoints: 0,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<{
    rank: number;
    totalPoints: number;
  } | null>(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pointsRes, achievementsRes, leaderboardRes] = await Promise.all([
        fetch('/api/gamification/points'),
        fetch(
          `/api/gamification/achievements${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
        ),
        fetch(`/api/gamification/leaderboard?period=${leaderboardPeriod}&limit=10`),
      ]);

      if (pointsRes.ok) {
        const points = await pointsRes.json();
        setUserPoints(points);
      }

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData.achievements);
        setAchievementStats(achievementsData.stats);
      }

      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json();
        setLeaderboard(leaderboardData.leaderboard);
        setCurrentUserRank(leaderboardData.currentUser);
      }
    } catch (error) {
      console.error('Failed to fetch rewards data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, leaderboardPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const claimDailyBonus = async () => {
    try {
      const res = await fetch('/api/gamification/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'daily_login' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.pointsAwarded > 0) {
          fetchData();
          alert(`+${data.pointsAwarded} points! ${data.leveledUp ? '🎉 Level Up!' : ''}`);
        } else {
          alert('You already claimed your daily bonus today!');
        }
      }
    } catch (error) {
      console.error('Failed to claim bonus:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/" className="text-white/80 hover:text-white text-sm mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Rewards & Achievements</h1>
          <p className="text-white/80 mt-1">
            Earn points, unlock achievements, and climb the leaderboard!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 -mt-12">
          {/* Level Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white">
                {userPoints?.level || 1}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Level</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {userPoints?.levelTitle || 'Newcomer'}
                </p>
              </div>
            </div>
            {/* Progress to next level */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{userPoints?.currentLevelPoints || 0} XP</span>
                <span>
                  {(userPoints?.currentLevelPoints || 0) + (userPoints?.pointsToNextLevel || 100)}{' '}
                  XP
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${((userPoints?.currentLevelPoints || 0) / ((userPoints?.currentLevelPoints || 0) + (userPoints?.pointsToNextLevel || 100))) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Points</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {(userPoints?.totalPoints || 0).toLocaleString()}
            </p>
            <button
              onClick={claimDailyBonus}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              🎁 Claim Daily Bonus
            </button>
          </div>

          {/* Streak Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Streak</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-orange-500">{userPoints?.streak || 0}</p>
              <p className="text-lg text-gray-500">days</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {userPoints?.streak
                ? `🔥 ${Math.floor((userPoints.streak - 1) * 10)}% bonus on daily login!`
                : 'Start your streak today!'}
            </p>
          </div>

          {/* Achievements Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Achievements</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-purple-600">{achievementStats.unlocked}</p>
              <p className="text-lg text-gray-500">/ {achievementStats.total}</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(achievementStats.unlocked / achievementStats.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {(['overview', 'achievements', 'leaderboard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 -mb-px capitalize ${
                activeTab === tab
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab === 'overview'
                ? '🏠 Overview'
                : tab === 'achievements'
                  ? '🏆 Achievements'
                  : '📊 Leaderboard'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {achievements
                  .filter((a) => a.unlocked)
                  .slice(0, 5)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${getTierBgClass(achievement.tier)}`}
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-gray-500">{achievement.description}</p>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        +{achievement.points}
                      </span>
                    </div>
                  ))}
                {achievements.filter((a) => a.unlocked).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No achievements yet. Start exploring!
                  </p>
                )}
              </div>
            </div>

            {/* Next Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Next Achievements
              </h3>
              <div className="space-y-3">
                {achievements
                  .filter((a) => !a.unlocked && a.progressPercent > 0)
                  .sort((a, b) => b.progressPercent - a.progressPercent)
                  .slice(0, 5)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl opacity-50">{achievement.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {achievement.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {achievement.progress} / {achievement.requirement}
                          </p>
                        </div>
                        <span className="text-sm text-gray-400">+{achievement.points}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${achievement.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            {/* Category Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', 'exploration', 'engagement', 'social', 'loyalty', 'milestone'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all ${
                    achievement.unlocked
                      ? getTierBgClass(achievement.tier)
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.name}
                        </h4>
                        {achievement.unlocked && <span className="text-green-500">✓</span>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full capitalize ${getTierBgClass(achievement.tier)}`}
                        >
                          {achievement.tier}
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          +{achievement.points} pts
                        </span>
                      </div>
                      {!achievement.unlocked && achievement.progressPercent > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{ width: `${achievement.progressPercent}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {achievement.progress} / {achievement.requirement}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            {/* Period Filter */}
            <div className="flex gap-2 mb-6">
              {(['all', 'monthly', 'weekly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setLeaderboardPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    leaderboardPeriod === period
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {period === 'all' ? 'All Time' : period}
                </button>
              ))}
            </div>

            {/* Your Rank */}
            {currentUserRank && (
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Your Rank</p>
                    <p className="text-4xl font-bold">#{currentUserRank.rank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Total Points</p>
                    <p className="text-2xl font-bold">
                      {currentUserRank.totalPoints.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Level
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Points
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Achievements
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leaderboard.map((entry) => (
                    <tr key={entry.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <span
                          className={`text-lg font-bold ${
                            entry.rank === 1
                              ? 'text-yellow-500'
                              : entry.rank === 2
                                ? 'text-gray-400'
                                : entry.rank === 3
                                  ? 'text-orange-500'
                                  : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {entry.rank === 1
                            ? '🥇'
                            : entry.rank === 2
                              ? '🥈'
                              : entry.rank === 3
                                ? '🥉'
                                : `#${entry.rank}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {entry.userName}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-500">{entry.levelTitle}</span>
                        <span className="ml-2 text-sm font-bold text-purple-600">
                          Lv.{entry.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                        {entry.totalPoints.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500">
                        🏆 {entry.achievementCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
