import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { GamifyEngine } from '../core/GamifyEngine';
import { User, Achievement, Badge, Streak, GamifyHookReturn } from '../types';

// Context for the gamification engine
const GamifyContext = createContext<GamifyEngine | null>(null);

// Provider component
export const GamifyProvider: React.FC<{
  engine: GamifyEngine;
  children: React.ReactNode;
}> = ({ engine, children }) => {
  return React.createElement(GamifyContext.Provider, { value: engine }, children);
};

/**
 * Main hook to use the gamification engine
 */
export const useGamify = (userId?: string): GamifyHookReturn => {
  const engine = useContext(GamifyContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (!engine) {
    throw new Error('useGamify must be used within a GamifyProvider');
  }

  // Initialize user if userId is provided
  useEffect(() => {
    if (userId) {
      setLoading(true);
      try {
        let currentUser = engine.getUser(userId);
        
        if (!currentUser) {
          currentUser = engine.createUser(userId);
        }
        
        setUser(currentUser);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [userId, engine]);

  // Subscribe to user updates
  useEffect(() => {
    if (!userId) return;

    const subscription = engine.onUserUpdate().subscribe((updatedUser) => {
      if (updatedUser.id === userId) {
        setUser(updatedUser);
      }
    });

    return () => subscription.unsubscribe();
  }, [userId, engine]);

  // Trigger event function
  const triggerEvent = useCallback((type: string, data?: Record<string, any>) => {
    if (!userId) {
      throw new Error('userId is required to trigger events');
    }
    engine.triggerEvent(userId, type, data);
  }, [userId, engine]);

  // Calculate derived values
  const achievements = user?.achievements || [];
  const badges = user?.badges || [];
  const streaks = user?.streaks || [];
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  
  const levelProgress = user ? engine.getLevelProgress(user) : { current: 0, next: 100, progress: 0 };
  const nextLevelXp = levelProgress.next;
  const progress = levelProgress.progress;

  return {
    user,
    loading,
    error,
    triggerEvent,
    achievements,
    badges,
    streaks,
    level,
    xp,
    nextLevelXp,
    progress
  };
};

/**
 * Hook for level up notifications
 */
export const useLevelUp = (userId?: string) => {
  const engine = useContext(GamifyContext);
  const [levelUpData, setLevelUpData] = useState<{ user: User; level: number } | null>(null);

  if (!engine) {
    throw new Error('useLevelUp must be used within a GamifyProvider');
  }

  useEffect(() => {
    if (!userId) return;

    const subscription = engine.onLevelUp().subscribe((user) => {
      if (user.id === userId) {
        setLevelUpData({ user, level: user.level });
        
        // Clear the notification after 5 seconds
        setTimeout(() => setLevelUpData(null), 5000);
      }
    });

    return () => subscription.unsubscribe();
  }, [userId, engine]);

  return levelUpData;
};

/**
 * Hook for achievement notifications
 */
export const useAchievement = (userId?: string) => {
  const engine = useContext(GamifyContext);
  const [achievementData, setAchievementData] = useState<{ user: User; achievement: Achievement } | null>(null);

  if (!engine) {
    throw new Error('useAchievement must be used within a GamifyProvider');
  }

  useEffect(() => {
    if (!userId) return;

    const subscription = engine.onAchievement().subscribe((data) => {
      if (data.user.id === userId) {
        setAchievementData(data);
        
        // Clear the notification after 5 seconds
        setTimeout(() => setAchievementData(null), 5000);
      }
    });

    return () => subscription.unsubscribe();
  }, [userId, engine]);

  return achievementData;
};

/**
 * Hook for leaderboard data
 */
export const useLeaderboard = (limit: number = 10) => {
  const engine = useContext(GamifyContext);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  if (!engine) {
    throw new Error('useLeaderboard must be used within a GamifyProvider');
  }

  useEffect(() => {
    const updateLeaderboard = () => {
      const data = engine.getLeaderboard(limit);
      setLeaderboard(data);
    };

    // Initial load
    updateLeaderboard();

    // Subscribe to user updates to refresh leaderboard
    const subscription = engine.onUserUpdate().subscribe(() => {
      updateLeaderboard();
    });

    return () => subscription.unsubscribe();
  }, [engine, limit]);

  return leaderboard;
};

/**
 * Hook for missions
 */
export const useMissions = (userId?: string) => {
  const engine = useContext(GamifyContext);
  const [missions, setMissions] = useState<any[]>([]);

  if (!engine) {
    throw new Error('useMissions must be used within a GamifyProvider');
  }

  useEffect(() => {
    const allMissions = engine.getMissions();
    setMissions(allMissions);
  }, [engine]);

  return missions;
};

/**
 * Hook for user statistics
 */
export const useUserStats = (userId?: string) => {
  const { user } = useGamify(userId);

  if (!user) {
    return {
      totalXp: 0,
      totalBadges: 0,
      totalAchievements: 0,
      activeStreaks: 0,
      averageLevel: 0,
      rank: 0
    };
  }

  const totalXp = user.xp;
  const totalBadges = user.badges.length;
  const totalAchievements = user.achievements.length;
  const activeStreaks = user.streaks.filter(streak => 
    new Date().getTime() - streak.lastActivity.getTime() <= 24 * 60 * 60 * 1000
  ).length;

  return {
    totalXp,
    totalBadges,
    totalAchievements,
    activeStreaks,
    averageLevel: user.level,
    rank: 0 // This would need to be calculated from leaderboard
  };
};

/**
 * Hook for theme
 */
export const useTheme = () => {
  const engine = useContext(GamifyContext);

  if (!engine) {
    throw new Error('useTheme must be used within a GamifyProvider');
  }

  return engine.getTheme();
};

/**
 * Hook for configuration
 */
export const useConfig = () => {
  const engine = useContext(GamifyContext);

  if (!engine) {
    throw new Error('useConfig must be used within a GamifyProvider');
  }

  return engine.getConfig();
};

// ==================== PRIVATE FUNCTIONS ====================

/**
 * Initialize a user with the engine
 */
async function initializeUser(userId: string, engine: GamifyEngine, setUser: React.Dispatch<React.SetStateAction<User | null>>): Promise<void> {
  try {
    let currentUser = engine.getUser(userId);
    
    if (!currentUser) {
      currentUser = engine.createUser(userId);
    }
    
    setUser(currentUser);
  } catch (err) {
    console.error('Failed to initialize user:', err);
    throw err;
  }
} 