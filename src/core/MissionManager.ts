import { v4 as uuidv4 } from 'uuid';
import { Mission, User, Achievement, Reward } from '../types';

/**
 * Manages missions and their completion tracking
 */
export class MissionManager {
  private readonly missions = new Map<string, Mission>();

  /**
   * Add a new mission
   */
  addMission(mission: Mission): void {
    this.missions.set(mission.id, mission);
  }

  /**
   * Get all missions
   */
  getMissions(): Mission[] {
    return Array.from(this.missions.values());
  }

  /**
   * Get mission by ID
   */
  getMission(missionId: string): Mission | undefined {
    return this.missions.get(missionId);
  }

  /**
   * Remove a mission
   */
  removeMission(missionId: string): boolean {
    return this.missions.delete(missionId);
  }

  /**
   * Check if user has completed a mission
   */
  isMissionCompleted(user: User, missionId: string): boolean {
    return user.achievements.some(achievement => achievement.id === missionId);
  }

  /**
   * Get user's progress for a specific mission
   */
  getMissionProgress(user: User, missionId: string): number {
    const mission = this.missions.get(missionId);
    if (!mission) return 0;

    return this.calculateProgress(user, mission);
  }

  /**
   * Check all missions for a user and complete any that are finished
   */
  checkMissions(user: User): void {
    for (const mission of this.missions.values()) {
      // Skip if already completed
      if (this.isMissionCompleted(user, mission.id)) {
        continue;
      }

      // Check if mission is completed using objectives
      if (mission.objectives && this.evaluateMissionObjectives(mission.objectives, user)) {
        this.completeMission(user, mission);
      }
      // Fallback to old goal structure
      else if (mission.goal && this.evaluateMissionGoal(mission.goal, user)) {
        this.completeMission(user, mission);
      }
    }
  }

  /**
   * Get available missions for a user (not completed)
   */
  getAvailableMissions(user: User): Mission[] {
    return Array.from(this.missions.values()).filter(mission => 
      !this.isMissionCompleted(user, mission.id)
    );
  }

  /**
   * Get completed missions for a user
   */
  getCompletedMissions(user: User): Mission[] {
    return Array.from(this.missions.values()).filter(mission => 
      this.isMissionCompleted(user, mission.id)
    );
  }

  /**
   * Get missions by category
   */
  getMissionsByCategory(category: string): Mission[] {
    return Array.from(this.missions.values()).filter(mission => 
      mission.category === category
    );
  }

  /**
   * Get missions by difficulty
   */
  getMissionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'epic'): Mission[] {
    return Array.from(this.missions.values()).filter(mission => 
      mission.difficulty === difficulty
    );
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Evaluate if a mission goal is met
   */
  private evaluateMissionGoal(goal: any, user: User): boolean {
    if (!goal || !goal.type) return false;
    
    switch (goal.type) {
      case 'streak':
        return user.streaks.some(streak => streak.currentCount >= goal.value);
      
      case 'xp':
        return user.xp >= goal.value;
      
      case 'badge':
        return user.badges.length >= goal.value;
      
      case 'event':
        return goal.condition ? goal.condition(user) : false;
      
      default:
        return false;
    }
  }

  /**
   * Evaluate if mission objectives are met
   */
  private evaluateMissionObjectives(objectives: any[], user: User): boolean {
    return objectives.every(objective => {
      switch (objective.type) {
        case 'profile_update':
        case 'avatar_upload':
        case 'like':
        case 'comment':
        case 'share':
        case 'seasonal_action':
        case 'test':
          // For test objectives, check if they have actual progress
          return objective.progress >= (objective.target || 1);
        default:
          return false;
      }
    });
  }

  /**
   * Calculate progress for a mission
   */
  private calculateProgress(user: User, mission: Mission): number {
    const goal = mission.goal;
    
    switch (goal.type) {
      case 'streak':
        const maxStreak = Math.max(...user.streaks.map(s => s.currentCount), 0);
        return Math.min(maxStreak / goal.value, 1);
      
      case 'xp':
        return Math.min(user.xp / goal.value, 1);
      
      case 'badge':
        return Math.min(user.badges.length / goal.value, 1);
      
      case 'event':
        // For custom events, assume 0 progress if no condition provided
        return 0;
      
      default:
        return 0;
    }
  }

  /**
   * Complete a mission for a user
   */
  private completeMission(user: User, mission: Mission): void {
    // Create achievement
    const achievement: Achievement = {
      id: mission.id,
      name: mission.title,
      title: mission.title,
      description: mission.description,
      xpReward: mission.reward?.xp || 0,
      progress: 1,
      maxProgress: 1,
      completed: true,
      completedAt: new Date(),
      rarity: 'common', // default, can be improved
    };

    // Add achievement to user
    user.achievements.push(achievement);

    // Apply mission rewards
    if (mission.reward) {
      this.applyMissionReward(user, mission.reward);
    }
  }

  /**
   * Apply mission reward to user
   */
  private applyMissionReward(user: User, reward: Reward): void {
    // Add XP
    if (reward.xp) {
      user.xp += reward.xp;
    }

    // Add badge if provided
    if (reward.badge) {
      const badge = typeof reward.badge === 'string' 
        ? this.createBadge(reward.badge)
        : reward.badge;
      
      if (!user.badges.find(b => b.id === badge.id)) {
        user.badges.push(badge);
      }
    }

    // Apply other rewards
    if (reward.streak) {
      // Handle streak reward
    }

    if (reward.multiplier) {
      user.xp = Math.floor(user.xp * reward.multiplier);
    }

    if (reward.custom) {
      reward.custom(user);
    }
  }

  /**
   * Create a badge from a name
   */
  private createBadge(name: string): any {
    return {
      id: uuidv4(),
      name,
      description: `Earned ${name} badge`,
      rarity: 'common',
      earnedAt: new Date()
    };
  }
} 