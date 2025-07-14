import { GamifyEngine } from '../src/core/GamifyEngine';
import { GameRule, Mission, Badge, Achievement } from '../src/types';

/**
 * Advanced Gamification Example
 * 
 * This example demonstrates all the features of the @gamify-ui/core engine
 * including custom rules, missions, achievements, analytics, and plugins.
 */

// Initialize the gamification engine with advanced configuration
const engine = new GamifyEngine({
  debug: true,
  theme: {
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#fff',
      surface: '#f0f0f0',
      text: '#222'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem'
    },
    animations: {
      badgePopup: 'fade-in 0.5s',
      xpGain: 'slide-up 0.3s',
      levelUp: 'bounce 0.5s',
      achievement: 'pop 0.5s'
    },
    sounds: {}
  }
});

// ==================== CUSTOM RULES ====================

// Rule 1: Daily login streak bonus
const dailyLoginRule: GameRule = {
  id: 'daily-login-streak',
  trigger: { type: 'login', reward: { xp: 50 } },
  enabled: true,
  priority: 1
};

// Rule 2: Social interaction bonus
const socialInteractionRule: GameRule = {
  id: 'social-interaction',
  trigger: { type: 'like', reward: { xp: 10 } },
  enabled: true,
  priority: 2
};

// Rule 3: Achievement unlock
const achievementRule: GameRule = {
  id: 'achievement-unlock',
  trigger: { type: 'xp', condition: { threshold: 1000 }, reward: { badge: 'milestone-1000' } },
  enabled: true,
  priority: 3
};

// Add rules to the engine
engine.addRule(dailyLoginRule);
engine.addRule(socialInteractionRule);
engine.addRule(achievementRule);

// ==================== MISSIONS ====================

// Mission 1: Complete profile
const completeProfileMission: Mission = {
  id: 'complete-profile',
  title: 'Complete Your Profile',
  description: 'Fill out your profile information to earn rewards',
  goal: { type: 'custom', value: 1 },
  reward: {
    xp: 100,
    badge: 'profile-complete',
    custom: (user) => { /* custom logic for unlockFeature: 'custom-themes' */ }
  },
  repeatable: false,
  difficulty: 'easy'
};

// Mission 2: Social butterfly
const socialButterflyMission: Mission = {
  id: 'social-butterfly',
  title: 'Social Butterfly',
  description: 'Interact with other users to become a social butterfly',
  goal: { type: 'custom', value: 1 },
  reward: {
    xp: 250,
    badge: 'social-butterfly',
    custom: (user) => { /* custom logic for unlockFeature: 'advanced-social-tools' */ }
  },
  repeatable: false,
  difficulty: 'medium'
};

// Add missions to the engine
engine.addMission(completeProfileMission);
engine.addMission(socialButterflyMission);

// ==================== ACHIEVEMENTS ====================

// Achievement 1: First steps
const firstStepsAchievement = {
  id: 'first-steps',
  title: 'First Steps',
  description: 'Complete your first action in the platform',
  conditions: [
    {
      type: 'event_count',
      value: 1,
      operator: 'greater_than_or_equal',
      metadata: { eventType: 'any' }
    }
  ],
  rewards: {
    xp: 25,
    badge: 'first-steps',
    custom: (user) => { /* custom logic for welcomeMessage */ }
  },
  rarity: 'common',
  category: 'beginner',
  icon: '👣'
};

// Achievement 2: XP collector
const xpCollectorAchievement = {
  id: 'xp-collector',
  title: 'XP Collector',
  description: 'Earn 1000 total XP',
  conditions: [
    {
      type: 'xp_threshold',
      value: 1000,
      operator: 'greater_than_or_equal'
    }
  ],
  rewards: {
    xp: 100,
    badge: 'xp-collector',
    custom: (user) => { /* custom logic for unlockFeature: 'xp-boost' */ }
  },
  rarity: 'uncommon',
  category: 'progression',
  icon: '⭐'
};

// Achievement 3: Streak master
const streakMasterAchievement = {
  id: 'streak-master',
  title: 'Streak Master',
  description: 'Maintain a 7-day login streak',
  conditions: [
    {
      type: 'streak_duration',
      value: 7,
      operator: 'greater_than_or_equal',
      metadata: { streakType: 'daily' }
    }
  ],
  rewards: {
    xp: 200,
    badge: 'streak-master',
    custom: (user) => { /* custom logic for unlockFeature: 'streak-protection' */ }
  },
  rarity: 'rare',
  category: 'dedication',
  icon: '🔥'
};

// Register achievements
engine.registerAchievement(firstStepsAchievement);
engine.registerAchievement(xpCollectorAchievement);
engine.registerAchievement(streakMasterAchievement);

// ==================== CUSTOM PLUGIN ====================

// Create a custom plugin for seasonal events
const seasonalEventsPlugin = {
  name: 'seasonal-events',
  version: '1.0.0',
  description: 'Adds seasonal events and special rewards',
  
  install(engine: any) {
    console.log('Installing seasonal events plugin...');
    
    // Add seasonal event rule
    const seasonalRule: GameRule = {
      id: 'seasonal-event',
      trigger: { type: 'seasonal', reward: { xp: 100, badge: 'seasonal-participant' } },
      enabled: true,
      priority: 1
    };
    
    engine.addRule(seasonalRule);
    
    // Add seasonal mission
    const seasonalMission: Mission = {
      id: 'seasonal-challenge',
      title: 'Seasonal Challenge',
      description: 'Complete seasonal activities to earn special rewards',
      goal: { type: 'custom', value: 1 },
      reward: {
        xp: 500,
        badge: 'seasonal-champion',
        custom: (user) => { /* custom logic for unlockFeature: 'seasonal-themes' */ }
      },
      repeatable: false,
      difficulty: 'hard'
    };
    
    engine.addMission(seasonalMission);
  },
  
  uninstall(engine: any) {
    console.log('Uninstalling seasonal events plugin...');
    engine.removeRule('seasonal-event');
  }
};

// Install the plugin
engine.use(seasonalEventsPlugin);

// ==================== USER SIMULATION ====================

// Create a test user
const userId = 'advanced-demo-user';
const user = engine.createUser(userId, 'Advanced Player', 'advanced@example.com');

// Start analytics session
const sessionId = engine.startSession(userId);

// Simulate user actions
console.log('=== Starting Advanced Gamification Demo ===');

// Day 1: First login
console.log('\n--- Day 1: First Login ---');
engine.triggerEvent(userId, 'login', { time: new Date() });
console.log(`User XP: ${user.xp}, Level: ${user.level}`);

// Complete profile
console.log('\n--- Completing Profile ---');
engine.triggerEvent(userId, 'profile_update', { field: 'name', value: 'Advanced Player' });
engine.triggerEvent(userId, 'avatar_upload', { avatarUrl: 'https://example.com/avatar.jpg' });
console.log(`User XP: ${user.xp}, Level: ${user.level}`);

// Social interactions
console.log('\n--- Social Interactions ---');
for (let i = 0; i < 5; i++) {
  engine.triggerEvent(userId, 'like', { postId: `post-${i}` });
}
for (let i = 0; i < 3; i++) {
  engine.triggerEvent(userId, 'comment', { postId: `post-${i}`, comment: 'Great post!' });
}
engine.triggerEvent(userId, 'share', { postId: 'post-1', platform: 'twitter' });
console.log(`User XP: ${user.xp}, Level: ${user.level}`);

// Seasonal event
console.log('\n--- Seasonal Event ---');
engine.triggerEvent(userId, 'seasonal', { eventType: 'winter-festival' });
console.log(`User XP: ${user.xp}, Level: ${user.level}`);

// Get analytics data
console.log('\n--- Analytics Data ---');
const metrics = engine.getUserMetrics(userId);
console.log('User Metrics:', {
  totalSessions: metrics?.totalSessions,
  totalPlayTime: metrics?.totalPlayTime,
  totalXp: metrics?.totalXp,
  totalLevelUps: metrics?.totalLevelUps,
  totalAchievements: metrics?.totalAchievements,
  totalBadges: metrics?.totalBadges,
  favoriteEvents: metrics?.favoriteEvents
});

const engagementScore = engine.getEngagementScore(userId);
console.log(`Engagement Score: ${engagementScore}`);

const eventAnalytics = engine.getEventAnalytics();
console.log('Event Analytics:', eventAnalytics);

// Get achievements
console.log('\n--- Achievements ---');
const achievements = engine.getUserAchievements(userId);
console.log('Earned Achievements:', achievements.map(a => a.title));

const achievementStats = engine.getAchievementStats(userId);
console.log('Achievement Stats:', achievementStats);

// Get leaderboard
console.log('\n--- Leaderboard ---');
const leaderboard = engine.getLeaderboard(5);
console.log('Top 5 Players:', leaderboard);

// Get engagement leaderboard
console.log('\n--- Engagement Leaderboard ---');
const engagementLeaderboard = engine.getEngagementLeaderboard(5);
console.log('Top 5 by Engagement:', engagementLeaderboard);

// End session
engine.endSession(userId, sessionId);

console.log('\n=== Advanced Gamification Demo Complete ===');
console.log(`Final User State: Level ${user.level}, ${user.xp} XP, ${user.badges.length} badges, ${user.achievements.length} achievements`);

// Export for use in other examples
export {
  engine,
  user,
  dailyLoginRule,
  socialInteractionRule,
  achievementRule,
  completeProfileMission,
  socialButterflyMission,
  firstStepsAchievement,
  xpCollectorAchievement,
  streakMasterAchievement,
  seasonalEventsPlugin
}; 