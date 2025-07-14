import { Subject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Badge,
  Achievement,
  Streak,
  GameEvent,
  EventTrigger,
  GameRule,
  GamifyConfig,
  GamifyPlugin,
  LeaderboardEntry,
  Mission,
  Theme
} from '../types';
import { EventProcessor } from './EventProcessor';
import { UserManager } from './UserManager';
import { RuleEngine } from './RuleEngine';
import { MissionManager } from './MissionManager';
import { PluginManager } from './PluginManager';
import { ThemeManager } from './ThemeManager';
import { AchievementManager } from './AchievementManager';
import { AnalyticsManager } from './AnalyticsManager';

/**
 * Main Gamification Engine
 * 
 * This is the core class that orchestrates all gamification features.
 * It provides a clean API for managing users, events, rules, and rewards.
 */
export class GamifyEngine {
  // Core managers for separation of concerns
  private readonly userManager: UserManager;
  private readonly eventProcessor: EventProcessor;
  private readonly ruleEngine: RuleEngine;
  private readonly missionManager: MissionManager;
  private readonly pluginManager: PluginManager;
  private readonly themeManager: ThemeManager;
  private readonly achievementManager: AchievementManager;
  private readonly analyticsManager: AnalyticsManager;

  // Configuration
  private readonly config: GamifyConfig;

  // Event streams
  private readonly eventStream = new Subject<GameEvent>();
  private readonly userStream = new Subject<User>();

  constructor(config: GamifyConfig = {}) {
    this.config = config;
    
    // Initialize managers
    this.themeManager = new ThemeManager(config.theme);
    this.userManager = new UserManager();
    this.ruleEngine = new RuleEngine();
    this.missionManager = new MissionManager();
    this.pluginManager = new PluginManager();
    this.achievementManager = new AchievementManager();
    this.analyticsManager = new AnalyticsManager();
    this.eventProcessor = new EventProcessor(
      this.userManager,
      this.ruleEngine,
      this.missionManager
    );

    // Initialize with configuration
    this.initializeFromConfig(config);
    
    // Enable debug mode if configured
    if (config.debug) {
      this.enableDebugMode();
    }
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Create a new user in the gamification system
   */
  createUser(id: string, name?: string, email?: string): User {
    const user = this.userManager.createUser(id, name, email);
    this.userStream.next(user);
    
    if (this.config.debug) {
      console.log(`[GamifyEngine] Created user: ${id}`);
    }

    return user;
  }

  /**
   * Get a user by their ID
   */
  getUser(id: string): User | undefined {
    return this.userManager.getUser(id);
  }

  /**
   * Update user information
   */
  updateUser(id: string, updates: Partial<User>): User | null {
    const updatedUser = this.userManager.updateUser(id, updates);
    if (updatedUser) {
      this.userStream.next(updatedUser);
    }
    return updatedUser;
  }

  /**
   * Get all users in the system
   */
  getUsers(): User[] {
    return this.userManager.getAllUsers();
  }

  // ==================== EVENT SYSTEM ====================

  /**
   * Trigger an event for a specific user
   */
  triggerEvent(userId: string, eventType: string, data?: Record<string, any>): void {
    const user = this.userManager.getUser(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Add XP if provided in event data
    if (data?.xp && typeof data.xp === 'number') {
      this.userManager.addXp(userId, data.xp);
    }

    const event: GameEvent = {
      type: eventType,
      userId,
      timestamp: new Date(),
      data,
      metadata: {}
    };

    this.eventStream.next(event);
    this.eventProcessor.processEvent(event, user);
    
    // Track analytics
    this.analyticsManager.trackEvent(userId, event);
    
    // Process achievements
    const newAchievements = this.achievementManager.processUserAchievements(user, event);
    if (newAchievements.length > 0) {
      // Emit achievement events
      newAchievements.forEach(achievement => {
        this.eventStream.next({
          type: 'achievement-earned',
          userId,
          timestamp: new Date(),
          data: { achievement },
          metadata: {}
        });
      });
    }
    
    // Update user after processing
    this.userStream.next(user);
  }

  // ==================== RULE MANAGEMENT ====================

  /**
   * Add a new game rule
   */
  addRule(rule: GameRule): void {
    this.ruleEngine.addRule(rule);
  }

  /**
   * Remove a game rule
   */
  removeRule(ruleId: string): boolean {
    return this.ruleEngine.removeRule(ruleId);
  }

  /**
   * Get all active rules
   */
  getRules(): GameRule[] {
    return this.ruleEngine.getRules();
  }

  // ==================== MISSION MANAGEMENT ====================

  /**
   * Add a new mission
   */
  addMission(mission: Mission): void {
    this.missionManager.addMission(mission);
  }

  /**
   * Get all available missions
   */
  getMissions(): Mission[] {
    return this.missionManager.getMissions();
  }

  // ==================== PLUGIN SYSTEM ====================

  /**
   * Install a plugin
   */
  use(plugin: GamifyPlugin): void {
    this.pluginManager.install(plugin, this);
    
    if (this.config.debug) {
      console.log(`[GamifyEngine] Installed plugin: ${plugin.name}`);
    }
  }

  /**
   * Uninstall a plugin
   */
  uninstallPlugin(pluginName: string): boolean {
    return this.pluginManager.uninstall(pluginName);
  }

  // ==================== OBSERVABLES ====================

  /**
   * Subscribe to all events
   */
  onEvent(): Observable<GameEvent> {
    return this.eventStream.asObservable();
  }

  /**
   * Subscribe to user updates
   */
  onUserUpdate(): Observable<User> {
    return this.userStream.asObservable();
  }

  /**
   * Subscribe to level up events
   */
  onLevelUp(): Observable<User> {
    return this.userStream.pipe(
      filter(user => user.level > 1)
    );
  }

  /**
   * Subscribe to achievement events
   */
  onAchievement(): Observable<{ user: User; achievement: Achievement }> {
    return this.userStream.pipe(
      map(user => {
        const latestAchievement = user.achievements[user.achievements.length - 1];
        return latestAchievement ? { user, achievement: latestAchievement } : null;
      }),
      filter(Boolean)
    );
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get level progress for a user
   */
  getLevelProgress(user: User): { current: number; next: number; progress: number } {
    return this.userManager.getLevelProgress(user);
  }

  /**
   * Get leaderboard data
   */
  getLeaderboard(limit: number = 10): LeaderboardEntry[] {
    return this.userManager.getLeaderboard(limit);
  }

  /**
   * Get current theme
   */
  getTheme(): Theme {
    return this.themeManager.getTheme();
  }

  /**
   * Get current configuration
   */
  getConfig(): GamifyConfig {
    return {
      ...this.config,
    };
  }

  // ==================== ACHIEVEMENT MANAGEMENT ====================

  /**
   * Register an achievement template
   */
  registerAchievement(template: any): void {
    this.achievementManager.registerAchievement(template);
  }

  /**
   * Get achievement templates
   */
  getAchievementTemplates(): any[] {
    return this.achievementManager.getAchievementTemplates();
  }

  /**
   * Get user achievements
   */
  getUserAchievements(userId: string): Achievement[] {
    return this.achievementManager.getUserAchievements(userId);
  }

  /**
   * Get achievement statistics
   */
  getAchievementStats(userId: string): any {
    return this.achievementManager.getAchievementStats(userId);
  }

  // ==================== ANALYTICS ====================

  /**
   * Start a user session
   */
  startSession(userId: string): string {
    return this.analyticsManager.startSession(userId);
  }

  /**
   * End a user session
   */
  endSession(userId: string, sessionId: string): void {
    this.analyticsManager.endSession(userId, sessionId);
  }

  /**
   * Get user metrics
   */
  getUserMetrics(userId: string): any {
    return this.analyticsManager.getUserMetrics(userId);
  }

  /**
   * Get engagement score
   */
  getEngagementScore(userId: string): number {
    return this.analyticsManager.getEngagementScore(userId);
  }

  /**
   * Get engagement leaderboard
   */
  getEngagementLeaderboard(limit: number = 10): any[] {
    return this.analyticsManager.getEngagementLeaderboard(limit);
  }

  /**
   * Get event analytics
   */
  getEventAnalytics(): any[] {
    return this.analyticsManager.getEventAnalytics();
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Initialize the engine from configuration
   */
  private initializeFromConfig(config: GamifyConfig): void {
    // Initialize rules
    if (config.rules) {
      Object.values(config.rules).forEach(rule => this.addRule(rule));
    }

    // Initialize missions
    if (config.missions) {
      config.missions.forEach(mission => this.addMission(mission));
    }
  }

  /**
   * Enable debug mode for development
   */
  private enableDebugMode(): void {
    this.eventStream.subscribe(event => {
      console.log(`[GamifyEngine] Event: ${event.type}`, event);
    });
  }
} 