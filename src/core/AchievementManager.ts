import { Achievement, User, GameEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface AchievementCondition {
  type: 'xp_threshold' | 'badge_count' | 'streak_duration' | 'event_count' | 'custom';
  value: number;
  operator: 'equals' | 'greater_than' | 'less_than' | 'greater_than_or_equal';
  metadata?: Record<string, any>;
}

export interface AchievementTemplate {
  id: string;
  title: string;
  description: string;
  conditions: AchievementCondition[];
  rewards: {
    xp?: number;
    badges?: string[];
    custom?: Record<string, any>;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: string;
  icon?: string;
  secret?: boolean;
}

/**
 * Manages achievements and their conditions
 */
export class AchievementManager {
  private readonly achievements = new Map<string, AchievementTemplate>();
  private readonly userAchievements = new Map<string, Achievement[]>();

  /**
   * Register an achievement template
   */
  registerAchievement(template: AchievementTemplate): void {
    this.achievements.set(template.id, template);
  }

  /**
   * Get all achievement templates
   */
  getAchievementTemplates(): AchievementTemplate[] {
    return Array.from(this.achievements.values());
  }

  /**
   * Get achievement template by ID
   */
  getAchievementTemplate(id: string): AchievementTemplate | undefined {
    return this.achievements.get(id);
  }

  /**
   * Check if user has earned an achievement
   */
  hasAchievement(userId: string, achievementId: string): boolean {
    const userAchievements = this.userAchievements.get(userId) || [];
    return userAchievements.some(a => a.id === achievementId);
  }

  /**
   * Get user's achievements
   */
  getUserAchievements(userId: string): Achievement[] {
    return this.userAchievements.get(userId) || [];
  }

  /**
   * Process user data and check for new achievements
   */
  processUserAchievements(user: User, event?: GameEvent): Achievement[] {
    const newAchievements: Achievement[] = [];
    const userAchievements = this.userAchievements.get(user.id) || [];

    for (const template of this.achievements.values()) {
      // Skip if user already has this achievement
      if (userAchievements.some(a => a.id === template.id)) {
        continue;
      }

      // Check if all conditions are met
      if (this.checkAchievementConditions(user, template, event)) {
        const achievement: Achievement = {
          id: template.id,
          name: template.title,
          title: template.title,
          description: template.description,
          rarity: template.rarity,
          icon: template.icon,
          xpReward: template.rewards?.xp || 0,
          progress: 1,
          maxProgress: 1,
          completed: true,
          completedAt: new Date(),
          metadata: template.rewards
        };

        newAchievements.push(achievement);
        userAchievements.push(achievement);
      }
    }

    this.userAchievements.set(user.id, userAchievements);
    return newAchievements;
  }

  /**
   * Check if achievement conditions are met
   */
  private checkAchievementConditions(user: User, template: AchievementTemplate, event?: GameEvent): boolean {
    return template.conditions.every(condition => {
      switch (condition.type) {
        case 'xp_threshold':
          return this.checkXpCondition(user.xp, condition);
        case 'badge_count':
          return this.checkBadgeCountCondition(user.badges.length, condition);
        case 'streak_duration':
          return this.checkStreakCondition(user.streaks, condition);
        case 'event_count':
          return this.checkEventCountCondition(user, condition);
        case 'custom':
          return this.checkCustomCondition(user, condition, event);
        default:
          return false;
      }
    });
  }

  private checkXpCondition(userXp: number, condition: AchievementCondition): boolean {
    switch (condition.operator) {
      case 'equals':
        return userXp === condition.value;
      case 'greater_than':
        return userXp > condition.value;
      case 'less_than':
        return userXp < condition.value;
      case 'greater_than_or_equal':
        return userXp >= condition.value;
      default:
        return false;
    }
  }

  private checkBadgeCountCondition(badgeCount: number, condition: AchievementCondition): boolean {
    switch (condition.operator) {
      case 'equals':
        return badgeCount === condition.value;
      case 'greater_than':
        return badgeCount > condition.value;
      case 'less_than':
        return badgeCount < condition.value;
      case 'greater_than_or_equal':
        return badgeCount >= condition.value;
      default:
        return false;
    }
  }

  private checkStreakCondition(streaks: any[], condition: AchievementCondition): boolean {
    const streakType = condition.metadata?.streakType || 'daily';
    const streak = streaks.find(s => s.type === streakType);
    
    if (!streak) return false;

    switch (condition.operator) {
      case 'equals':
        return streak.currentCount === condition.value;
      case 'greater_than':
        return streak.currentCount > condition.value;
      case 'less_than':
        return streak.currentCount < condition.value;
      case 'greater_than_or_equal':
        return streak.currentCount >= condition.value;
      default:
        return false;
    }
  }

  private checkEventCountCondition(user: User, condition: AchievementCondition): boolean {
    // This would need to be implemented with event tracking
    // For now, return false
    return false;
  }

  private checkCustomCondition(user: User, condition: AchievementCondition, event?: GameEvent): boolean {
    // Custom condition logic would be implemented here
    // For now, return false
    return false;
  }

  /**
   * Get achievement statistics
   */
  getAchievementStats(userId: string): {
    total: number;
    earned: number;
    progress: number;
    byRarity: Record<string, number>;
  } {
    const userAchievements = this.userAchievements.get(userId) || [];
    const totalAchievements = this.achievements.size;
    const earnedAchievements = userAchievements.length;
    
    const byRarity: Record<string, number> = {};
    userAchievements.forEach(achievement => {
      if (achievement.rarity) {
        byRarity[achievement.rarity] = (byRarity[achievement.rarity] || 0) + 1;
      }
    });

    return {
      total: totalAchievements,
      earned: earnedAchievements,
      progress: totalAchievements > 0 ? (earnedAchievements / totalAchievements) * 100 : 0,
      byRarity
    };
  }

  /**
   * Reset user achievements (for testing)
   */
  resetUserAchievements(userId: string): void {
    this.userAchievements.delete(userId);
  }
} 