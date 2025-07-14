// Core Types
export interface User {
  id: string;
  name?: string;
  email?: string;
  xp: number;
  level: number;
  badges: Badge[];
  streaks: Streak[];
  achievements: Achievement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
  metadata?: Record<string, any>;
}

export interface Achievement {
  id: string;
  name: string;
  title?: string; // Added for compatibility with code/tests
  description: string;
  icon?: string;
  xpReward: number;
  badgeReward?: Badge;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: Date;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'; // Added for compatibility
  metadata?: Record<string, any>;
}

export interface Streak {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  currentCount: number;
  maxCount: number;
  lastActivity: Date;
  lastUpdated?: Date; // Added for test compatibility
  multiplier: number;
  metadata?: Record<string, any>;
}

// Event System
export interface GameEvent {
  type: string;
  userId: string;
  timestamp: Date;
  data?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface EventTrigger {
  type: string;
  condition?: EventCondition;
  reward: Reward;
  cooldown?: number;
  metadata?: Record<string, any>;
}

export interface EventCondition {
  threshold?: number;
  combo?: string[];
  timeWindow?: number;
  duration?: number;
  custom?: (event: GameEvent) => boolean;
}

export interface Reward {
  xp?: number;
  badge?: string | Badge;
  streak?: number;
  multiplier?: number;
  custom?: (user: User) => void;
}

// Rule Engine
export interface GameRule {
  id: string;
  trigger: EventTrigger;
  enabled: boolean;
  priority: number;
  metadata?: Record<string, any>;
}

// Leaderboard
export interface LeaderboardEntry {
  userId: string;
  userName?: string;
  score: number;
  rank: number;
  level: number;
  badges: Badge[];
  metadata?: Record<string, any>;
}

export interface LeaderboardConfig {
  scope: 'global' | 'local' | 'team' | 'custom';
  updateInterval: number;
  display: {
    topUsers: number;
    showUserRank: boolean;
    showLevel: boolean;
    showBadges: boolean;
  };
  filters?: Record<string, any>;
}

// Mission System
export interface Mission {
  id: string;
  title: string;
  description: string;
  goal: MissionGoal;
  reward: Reward;
  objectives?: any[]; // Added for compatibility
  rewards?: Reward;   // Added for compatibility
  timeLimit?: number;
  repeatable: boolean;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  metadata?: Record<string, any>;
}

export interface MissionGoal {
  type: 'streak' | 'xp' | 'badge' | 'event' | 'custom';
  value: number;
  condition?: (user: User) => boolean;
}

// Analytics
export interface AnalyticsConfig {
  tracking: {
    events: boolean;
    conversions: boolean;
    retention: boolean;
    engagement: boolean;
  };
  export: {
    formats: ('csv' | 'pdf' | 'json')[];
    schedule?: 'daily' | 'weekly' | 'monthly';
  };
  integrations?: {
    googleAnalytics?: string;
    mixpanel?: string;
    amplitude?: string;
  };
}

export interface AnalyticsInsight {
  metric: string;
  value: number;
  change: number;
  period: string;
  metadata?: Record<string, any>;
}

// Theme & UI
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
  };
  animations: {
    badgePopup: string;
    xpGain: string;
    levelUp: string;
    achievement: string;
  };
  sounds: {
    levelUp?: string;
    achievement?: string;
    badge?: string;
    streak?: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Notifications
export interface NotificationConfig {
  integrations: {
    slack?: {
      webhook: string;
      channel: string;
    };
    discord?: {
      webhook: string;
      channel: string;
    };
    email?: {
      provider: string;
      apiKey: string;
    };
  };
  templates?: Record<string, string>;
}

// LMS Integration
export interface LMSConfig {
  platform: 'canvas' | 'blackboard' | 'moodle' | 'custom';
  apiKey: string;
  baseUrl: string;
  syncOptions: {
    grades: boolean;
    attendance: boolean;
    achievements: boolean;
    courses: boolean;
  };
}

// AI Add-on
export interface AIConfig {
  enabled: boolean;
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  features: {
    missionSuggestions: boolean;
    badgeRecommendations: boolean;
    retentionOptimization: boolean;
    aBTesting: boolean;
  };
}

// Core Engine Configuration
export interface GamifyConfig {
  rules?: Record<string, GameRule>;
  theme?: Theme;
  analytics?: AnalyticsConfig;
  notifications?: NotificationConfig;
  lms?: LMSConfig;
  ai?: AIConfig;
  leaderboards?: Record<string, LeaderboardConfig>;
  missions?: Mission[];
  debug?: boolean;
}

// Hook Return Types
export interface GamifyHookReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  triggerEvent: (type: string, data?: Record<string, any>) => void;
  achievements: Achievement[];
  badges: Badge[];
  streaks: Streak[];
  level: number;
  xp: number;
  nextLevelXp: number;
  progress: number;
}

// Plugin Types
export interface GamifyPlugin {
  name: string;
  version: string;
  install: (engine: any) => void;
  uninstall?: (engine: any) => void;
} 