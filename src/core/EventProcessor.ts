import { v4 as uuidv4 } from 'uuid';
import { GameEvent, User, GameRule, Badge, Reward } from '../types';
import { UserManager } from './UserManager';
import { RuleEngine } from './RuleEngine';
import { MissionManager } from './MissionManager';

/**
 * Processes game events and applies rewards
 */
export class EventProcessor {
  constructor(
    private readonly userManager: UserManager,
    private readonly ruleEngine: RuleEngine,
    private readonly missionManager: MissionManager
  ) {}

  /**
   * Process a game event and apply any applicable rewards
   */
  processEvent(event: GameEvent, user: User): void {
    // Get applicable rules for this event
    const applicableRules = this.ruleEngine.getApplicableRules(event);
    
    // Apply the highest priority rule
    for (const rule of applicableRules) {
      if (this.evaluateCondition(rule.trigger.condition, event)) {
        this.applyReward(user, rule.trigger.reward);
        break; // Only apply the highest priority rule
      }
    }

    // Check missions after applying rewards
    this.missionManager.checkMissions(user);
  }

  /**
   * Evaluate if an event condition is met
   */
  private evaluateCondition(condition: any, event: GameEvent): boolean {
    if (!condition) return true;

    // Custom condition function
    if (condition.custom) {
      return condition.custom(event);
    }

    // Threshold condition
    if (condition.threshold && event.data?.value) {
      return event.data.value >= condition.threshold;
    }

    // Combo condition
    if (condition.combo && event.data?.keys) {
      return condition.combo.every((key: string) => event.data && event.data.keys && event.data.keys.includes(key));
    }

    // Time window condition
    if (condition.timeWindow && event.data?.timestamp) {
      const timeDiff = Date.now() - event.data.timestamp;
      return timeDiff <= condition.timeWindow;
    }

    // Duration condition
    if (condition.duration && event.data?.duration) {
      return event.data.duration >= condition.duration;
    }

    return true;
  }

  /**
   * Apply a reward to a user
   */
  private applyReward(user: User, reward: Reward): void {
    // Apply XP reward
    if (reward.xp) {
      this.userManager.addXp(user.id, reward.xp);
    }

    // Apply badge reward
    if (reward.badge) {
      const badge = typeof reward.badge === 'string' 
        ? this.createBadge(reward.badge)
        : reward.badge;
      
      this.userManager.addBadge(user.id, badge);
    }

    // Apply streak reward
    if (reward.streak && typeof reward.streak === 'string' && ['daily', 'weekly', 'monthly'].includes(reward.streak)) {
      this.userManager.updateStreak(user.id, reward.streak);
    }

    // Apply multiplier
    if (reward.multiplier) {
      user.xp = Math.floor(user.xp * reward.multiplier);
    }

    // Apply custom reward
    if (reward.custom) {
      reward.custom(user);
    }
  }

  /**
   * Create a badge from a name
   */
  private createBadge(name: string): Badge {
    return {
      id: uuidv4(),
      name,
      description: `Earned ${name} badge`,
      rarity: 'common',
      earnedAt: new Date()
    };
  }
} 