import { UserManager } from '../../src/core/UserManager';
import { User, Badge, Streak } from '../../src/types';

describe('UserManager', () => {
  let userManager: UserManager;

  beforeEach(() => {
    userManager = new UserManager();
  });

  describe('User Creation', () => {
    it('should create a new user with basic information', () => {
      const user = userManager.createUser('user-1', 'John Doe', 'john@example.com');
      
      expect(user.id).toBe('user-1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.xp).toBe(0);
      expect(user.level).toBe(1);
      expect(user.badges).toEqual([]);
      expect(user.streaks).toEqual([]);
      expect(user.achievements).toEqual([]);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with only ID', () => {
      const user = userManager.createUser('user-1');
      
      expect(user.id).toBe('user-1');
      expect(user.name).toBeUndefined();
      expect(user.email).toBeUndefined();
      expect(user.xp).toBe(0);
      expect(user.level).toBe(1);
    });

    it('should create unique users', () => {
      const user1 = userManager.createUser('user-1', 'John');
      const user2 = userManager.createUser('user-2', 'Jane');
      
      expect(user1.id).toBe('user-1');
      expect(user2.id).toBe('user-2');
      expect(user1.name).toBe('John');
      expect(user2.name).toBe('Jane');
    });
  });

  describe('User Retrieval', () => {
    it('should get a user by ID', () => {
      const createdUser = userManager.createUser('user-1', 'John');
      const retrievedUser = userManager.getUser('user-1');
      
      expect(retrievedUser).toEqual(createdUser);
    });

    it('should return undefined for non-existent user', () => {
      const user = userManager.getUser('non-existent');
      expect(user).toBeUndefined();
    });
  });

  describe('User Updates', () => {
    it('should update user information', () => {
      const user = userManager.createUser('user-1', 'John');
      const updatedUser = userManager.updateUser('user-1', { 
        name: 'Jane', 
        email: 'jane@example.com',
        xp: 100 
      });
      
      expect(updatedUser?.name).toBe('Jane');
      expect(updatedUser?.email).toBe('jane@example.com');
      expect(updatedUser?.xp).toBe(100);
      expect(updatedUser?.updatedAt).toBeInstanceOf(Date);
      expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(user.updatedAt.getTime());
    });

    it('should return null when updating non-existent user', () => {
      const result = userManager.updateUser('non-existent', { name: 'Jane' });
      expect(result).toBeNull();
    });

    it('should preserve unchanged fields', () => {
      const user = userManager.createUser('user-1', 'John', 'john@example.com');
      const updatedUser = userManager.updateUser('user-1', { name: 'Jane' });
      
      expect(updatedUser?.email).toBe('john@example.com');
      expect(updatedUser?.xp).toBe(0);
      expect(updatedUser?.level).toBe(1);
    });
  });

  describe('User Listing', () => {
    it('should get all users', () => {
      userManager.createUser('user-1', 'John');
      userManager.createUser('user-2', 'Jane');
      userManager.createUser('user-3', 'Bob');
      
      const users = userManager.getAllUsers();
      expect(users).toHaveLength(3);
      expect(users.map(u => u.name)).toEqual(['John', 'Jane', 'Bob']);
    });

    it('should return empty array when no users exist', () => {
      const users = userManager.getAllUsers();
      expect(users).toEqual([]);
    });
  });

  describe('XP Management', () => {
    it('should add XP to user', () => {
      const user = userManager.createUser('user-1');
      const updatedUser = userManager.addXp('user-1', 100);
      
      expect(updatedUser?.xp).toBe(100);
      expect(updatedUser?.level).toBe(2); // Level 2 with 100 XP
    });

    it('should level up user when XP threshold is reached', () => {
      const user = userManager.createUser('user-1');
      const updatedUser = userManager.addXp('user-1', 283);
      
      expect(updatedUser?.xp).toBe(283);
      expect(updatedUser?.level).toBe(3); // Level 3 with 283 XP
    });

    it('should return null when adding XP to non-existent user', () => {
      const result = userManager.addXp('non-existent', 100);
      expect(result).toBeNull();
    });

    it('should handle multiple level ups', () => {
      const user = userManager.createUser('user-1');
      const updatedUser = userManager.addXp('user-1', 500);
      
      expect(updatedUser?.level).toBeGreaterThan(2);
    });
  });

  describe('Badge Management', () => {
    it('should add a badge to user', () => {
      const user = userManager.createUser('user-1');
      const badge: Badge = {
        id: 'badge-1',
        name: 'First Steps',
        description: 'Complete your first action',
        rarity: 'common',
        earnedAt: new Date()
      };
      
      const updatedUser = userManager.addBadge('user-1', badge);
      
      expect(updatedUser?.badges).toHaveLength(1);
      expect(updatedUser?.badges[0]).toEqual(badge);
    });

    it('should not add duplicate badges', () => {
      const user = userManager.createUser('user-1');
      const badge: Badge = {
        id: 'badge-1',
        name: 'First Steps',
        description: 'Complete your first action',
        rarity: 'common',
        earnedAt: new Date()
      };
      
      // Add badge twice
      userManager.addBadge('user-1', badge);
      const updatedUser = userManager.addBadge('user-1', badge);
      
      expect(updatedUser?.badges).toHaveLength(1);
    });

    it('should return null when adding badge to non-existent user', () => {
      const badge: Badge = {
        id: 'badge-1',
        name: 'First Steps',
        description: 'Complete your first action',
        rarity: 'common',
        earnedAt: new Date()
      };
      
      const result = userManager.addBadge('non-existent', badge);
      expect(result).toBeNull();
    });
  });

  describe('Streak Management', () => {
    it('should create a new streak', () => {
      const user = userManager.createUser('user-1');
      const updatedUser = userManager.updateStreak('user-1', 'daily');
      
      expect(updatedUser?.streaks).toHaveLength(1);
      expect(updatedUser?.streaks[0].type).toBe('daily');
      expect(updatedUser?.streaks[0].currentCount).toBe(1);
      expect(updatedUser?.streaks[0].maxCount).toBe(1);
      expect(updatedUser?.streaks[0].multiplier).toBe(1.1);
    });

    it('should increment existing streak on same day', () => {
      const user = userManager.createUser('user-1');
      
      // Update streak twice on same day
      userManager.updateStreak('user-1', 'daily');
      const updatedUser = userManager.updateStreak('user-1', 'daily');
      
      expect(updatedUser?.streaks[0].currentCount).toBe(2);
      expect(updatedUser?.streaks[0].maxCount).toBe(2);
      expect(updatedUser?.streaks[0].multiplier).toBe(1.2);
    });

    it('should reset streak after 24 hours', () => {
      const user = userManager.createUser('user-1');
      
      // Create initial streak
      userManager.updateStreak('user-1', 'daily');
      
      // Mock time to be 25 hours later
      const originalDate = Date;
      const mockDate = new Date(Date.now() + 25 * 60 * 60 * 1000);
      global.Date = jest.fn(() => mockDate) as any;
      
      const updatedUser = userManager.updateStreak('user-1', 'daily');
      
      expect(updatedUser?.streaks[0].currentCount).toBe(1);
      expect(updatedUser?.streaks[0].multiplier).toBe(1.0);
      
      // Restore original Date
      global.Date = originalDate;
    });

    it('should handle different streak types', () => {
      const user = userManager.createUser('user-1');
      
      userManager.updateStreak('user-1', 'daily');
      userManager.updateStreak('user-1', 'weekly');
      userManager.updateStreak('user-1', 'monthly');
      
      const updatedUser = userManager.getUser('user-1');
      expect(updatedUser?.streaks).toHaveLength(3);
      expect(updatedUser?.streaks.map(s => s.type)).toEqual(['daily', 'weekly', 'monthly']);
    });

    it('should return null when updating streak for non-existent user', () => {
      const result = userManager.updateStreak('non-existent', 'daily');
      expect(result).toBeNull();
    });
  });

  describe('Level Progress', () => {
    it('should calculate level progress correctly', () => {
      const user = userManager.createUser('user-1');
      user.xp = 150; // Level 2 user
      
      const progress = userManager.getLevelProgress(user);
      
      expect(progress.current).toBe(100); // XP for level 2
      expect(progress.next).toBe(283); // XP for level 3
      expect(progress.progress).toBeGreaterThan(0);
      expect(progress.progress).toBeLessThan(1);
    });

    it('should handle level 1 user', () => {
      const user = userManager.createUser('user-1');
      const progress = userManager.getLevelProgress(user);
      
      expect(progress.current).toBe(0);
      expect(progress.next).toBe(100);
      expect(progress.progress).toBe(0);
    });

    it('should handle high level user', () => {
      const user = userManager.createUser('user-1');
      user.xp = 1100; // High XP - partway through level 5
      
      const progress = userManager.getLevelProgress(user);
      
      expect(progress.current).toBeGreaterThan(0);
      expect(progress.next).toBeGreaterThan(progress.current);
      expect(progress.progress).toBeGreaterThan(0);
      expect(progress.progress).toBeLessThanOrEqual(1);
    });
  });

  describe('Leaderboard', () => {
    it('should generate leaderboard sorted by XP', () => {
      userManager.createUser('user-1', 'John');
      userManager.createUser('user-2', 'Jane');
      userManager.createUser('user-3', 'Bob');
      
      // Add XP to users
      userManager.addXp('user-1', 100);
      userManager.addXp('user-2', 300);
      userManager.addXp('user-3', 200);
      
      const leaderboard = userManager.getLeaderboard(10);
      
      expect(leaderboard).toHaveLength(3);
      expect(leaderboard[0].userName).toBe('Jane'); // Highest XP
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[0].score).toBe(300);
      expect(leaderboard[1].userName).toBe('Bob');
      expect(leaderboard[1].rank).toBe(2);
      expect(leaderboard[1].score).toBe(200);
      expect(leaderboard[2].userName).toBe('John');
      expect(leaderboard[2].rank).toBe(3);
      expect(leaderboard[2].score).toBe(100);
    });

    it('should limit leaderboard size', () => {
      userManager.createUser('user-1', 'John');
      userManager.createUser('user-2', 'Jane');
      userManager.createUser('user-3', 'Bob');
      
      const leaderboard = userManager.getLeaderboard(2);
      expect(leaderboard).toHaveLength(2);
    });

    it('should handle empty leaderboard', () => {
      const leaderboard = userManager.getLeaderboard(10);
      expect(leaderboard).toEqual([]);
    });

    it('should include user badges in leaderboard', () => {
      const user = userManager.createUser('user-1', 'John');
      const badge: Badge = {
        id: 'badge-1',
        name: 'First Steps',
        description: 'Complete your first action',
        rarity: 'common',
        earnedAt: new Date()
      };
      
      userManager.addBadge('user-1', badge);
      
      const leaderboard = userManager.getLeaderboard(10);
      expect(leaderboard[0].badges).toHaveLength(1);
      expect(leaderboard[0].badges[0]).toEqual(badge);
    });
  });
}); 