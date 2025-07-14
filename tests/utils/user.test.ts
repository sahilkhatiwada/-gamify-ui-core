import { calculateLevel, calculateXpForLevel, calculateLevelProgress, formatUserStats } from '../../src/utils/user';

describe('User Utilities', () => {
  describe('calculateLevel', () => {
    it('should calculate level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should calculate level 1 for XP below threshold', () => {
      expect(calculateLevel(50)).toBe(1);
    });

    it('should calculate level 2 for XP at threshold', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('should calculate level 2 for XP above threshold', () => {
      expect(calculateLevel(150)).toBe(2);
    });

    it('should calculate higher levels correctly', () => {
      expect(calculateLevel(300)).toBe(3);
      expect(calculateLevel(500)).toBe(4);
      expect(calculateLevel(1000)).toBe(5);
    });

    it('should handle negative XP', () => {
      expect(calculateLevel(-50)).toBe(1);
    });
  });

  describe('calculateXpForLevel', () => {
    it('should return 0 for level 1', () => {
      expect(calculateXpForLevel(1)).toBe(0);
    });

    it('should calculate XP for level 2', () => {
      expect(calculateXpForLevel(2)).toBe(100);
    });

    it('should calculate XP for level 3', () => {
      expect(calculateXpForLevel(3)).toBe(283);
    });

    it('should calculate XP for higher levels', () => {
      expect(calculateXpForLevel(4)).toBe(500);
      expect(calculateXpForLevel(5)).toBe(1000);
      expect(calculateXpForLevel(10)).toBe(2250);
    });

    it('should handle level 0 or negative', () => {
      expect(calculateXpForLevel(0)).toBe(0);
      expect(calculateXpForLevel(-1)).toBe(0);
    });
  });

  describe('calculateLevelProgress', () => {
    it('should calculate progress for level 1 user', () => {
      const progress = calculateLevelProgress(50);
      
      expect(progress.current).toBe(0);
      expect(progress.next).toBe(100);
      expect(progress.progress).toBe(0.5);
    });

    it('should calculate progress for level 2 user', () => {
      const progress = calculateLevelProgress(150);
      
      expect(progress.current).toBe(100);
      expect(progress.next).toBe(283);
      expect(progress.progress).toBeGreaterThan(0);
      expect(progress.progress).toBeLessThan(1);
    });

    it('should handle exact level thresholds', () => {
      const progress = calculateLevelProgress(100);
      
      expect(progress.current).toBe(100);
      expect(progress.next).toBe(283);
      expect(progress.progress).toBe(1);
    });

    it('should handle zero XP', () => {
      const progress = calculateLevelProgress(0);
      
      expect(progress.current).toBe(0);
      expect(progress.next).toBe(100);
      expect(progress.progress).toBe(0);
    });

    it('should handle negative XP', () => {
      const progress = calculateLevelProgress(-50);
      
      expect(progress.current).toBe(0);
      expect(progress.next).toBe(100);
      expect(progress.progress).toBe(0);
    });

    it('should handle very high XP', () => {
      const progress = calculateLevelProgress(10000);
      
      expect(progress.current).toBeGreaterThan(0);
      expect(progress.next).toBeGreaterThanOrEqual(progress.current);
      expect(progress.progress).toBeGreaterThan(0);
      expect(progress.progress).toBeLessThanOrEqual(1);
    });
  });

  describe('formatUserStats', () => {
    it('should format basic user stats', () => {
      const stats = formatUserStats({
        xp: 150,
        level: 2,
        badges: [],
        achievements: [],
        streaks: []
      });

      expect(stats).toContain('Level 2');
      expect(stats).toContain('150 XP');
      expect(stats).toContain('0 Badges');
      expect(stats).toContain('0 Achievements');
      expect(stats).toContain('0 Active Streaks');
    });

    it('should format stats with badges', () => {
      const stats = formatUserStats({
        xp: 500,
        level: 4,
        badges: [
          { id: 'badge-1', name: 'First Steps', description: 'First action', rarity: 'common', earnedAt: new Date() },
          { id: 'badge-2', name: 'Pro User', description: 'Advanced user', rarity: 'rare', earnedAt: new Date() }
        ],
        achievements: [],
        streaks: []
      });

      expect(stats).toContain('Level 4');
      expect(stats).toContain('500 XP');
      expect(stats).toContain('2 Badges');
      expect(stats).toContain('0 Achievements');
      expect(stats).toContain('0 Active Streaks');
    });

    it('should format stats with achievements', () => {
      const stats = formatUserStats({
        xp: 1000,
        level: 6,
        badges: [],
        achievements: [
          { id: 'achievement-1', name: 'First Mission', description: 'Complete first mission', completedAt: new Date(), xpReward: 0, progress: 1, maxProgress: 1, completed: true }
        ],
        streaks: []
      });

      expect(stats).toContain('Level 6');
      expect(stats).toContain('1000 XP');
      expect(stats).toContain('0 Badges');
      expect(stats).toContain('1 Achievement');
      expect(stats).toContain('0 Active Streaks');
    });

    it('should format stats with streaks', () => {
      const stats = formatUserStats({
        xp: 750,
        level: 5,
        badges: [],
        achievements: [],
        streaks: [
          { id: 'streak-1', type: 'daily', currentCount: 5, maxCount: 5, multiplier: 1.5, lastActivity: new Date() },
          { id: 'streak-2', type: 'weekly', currentCount: 2, maxCount: 2, multiplier: 1.2, lastActivity: new Date() }
        ]
      });

      expect(stats).toContain('Level 5');
      expect(stats).toContain('750 XP');
      expect(stats).toContain('0 Badges');
      expect(stats).toContain('0 Achievements');
      expect(stats).toContain('2 Active Streaks');
    });

    it('should handle plural forms correctly', () => {
      const stats = formatUserStats({
        xp: 200,
        level: 3,
        badges: [
          { id: 'badge-1', name: 'First Steps', description: 'First action', rarity: 'common', earnedAt: new Date() }
        ],
        achievements: [
          { id: 'achievement-1', name: 'First Mission', description: 'Complete first mission', completedAt: new Date(), xpReward: 0, progress: 1, maxProgress: 1, completed: true },
          { id: 'achievement-2', name: 'Second Mission', description: 'Complete second mission', completedAt: new Date(), xpReward: 0, progress: 1, maxProgress: 1, completed: true }
        ],
        streaks: [
          { id: 'streak-3', type: 'daily', currentCount: 1, maxCount: 1, multiplier: 1.1, lastActivity: new Date() }
        ]
      });

      expect(stats).toContain('1 Badge');
      expect(stats).toContain('2 Achievements');
      expect(stats).toContain('1 Active Streak');
    });

    it('should handle empty user data', () => {
      const stats = formatUserStats({
        xp: 0,
        level: 1,
        badges: [],
        achievements: [],
        streaks: []
      });

      expect(stats).toContain('Level 1');
      expect(stats).toContain('0 XP');
      expect(stats).toContain('0 Badges');
      expect(stats).toContain('0 Achievements');
      expect(stats).toContain('0 Active Streaks');
    });
  });
}); 