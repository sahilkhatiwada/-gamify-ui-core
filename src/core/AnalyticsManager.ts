import { User, GameEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  events: GameEvent[];
  totalXp: number;
  levelUps: number;
  achievements: number;
  badges: number;
}

export interface UserMetrics {
  userId: string;
  totalSessions: number;
  totalPlayTime: number; // in minutes
  averageSessionLength: number; // in minutes
  totalXp: number;
  totalLevelUps: number;
  totalAchievements: number;
  totalBadges: number;
  favoriteEvents: string[];
  lastActive: Date;
  engagementScore: number; // 0-100
}

export interface EventAnalytics {
  eventType: string;
  totalOccurrences: number;
  uniqueUsers: number;
  averageXpPerEvent: number;
  lastOccurrence: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Manages analytics and user behavior tracking
 */
export class AnalyticsManager {
  private readonly sessions = new Map<string, UserSession[]>();
  private readonly eventHistory = new Map<string, GameEvent[]>();
  private readonly userMetrics = new Map<string, UserMetrics>();

  /**
   * Start a new user session
   */
  startSession(userId: string): string {
    const sessionId = uuidv4();
    const session: UserSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      events: [],
      totalXp: 0,
      levelUps: 0,
      achievements: 0,
      badges: 0
    };

    const userSessions = this.sessions.get(userId) || [];
    userSessions.push(session);
    this.sessions.set(userId, userSessions);

    return sessionId;
  }

  /**
   * End a user session
   */
  endSession(userId: string, sessionId: string): void {
    const userSessions = this.sessions.get(userId) || [];
    const session = userSessions.find(s => s.id === sessionId);
    
    if (session) {
      session.endTime = new Date();
      this.updateUserMetrics(userId);
    }
  }

  /**
   * Track an event
   */
  trackEvent(userId: string, event: GameEvent): void {
    // Add to event history
    const userEvents = this.eventHistory.get(userId) || [];
    userEvents.push(event);
    this.eventHistory.set(userId, userEvents);

    // Update current session if exists
    const userSessions = this.sessions.get(userId) || [];
    const currentSession = userSessions.find(s => !s.endTime);
    
    if (currentSession) {
      currentSession.events.push(event);
      
      // Update session metrics
      if (event.data?.xp) {
        currentSession.totalXp += event.data.xp;
      }
      if (event.type === 'level-up') {
        currentSession.levelUps++;
      }
      if (event.type === 'achievement-earned') {
        currentSession.achievements++;
      }
      if (event.type === 'badge-earned') {
        currentSession.badges++;
      }
    }
  }

  /**
   * Get user metrics
   */
  getUserMetrics(userId: string): UserMetrics | null {
    return this.userMetrics.get(userId) || null;
  }

  /**
   * Get all user metrics
   */
  getAllUserMetrics(): UserMetrics[] {
    return Array.from(this.userMetrics.values());
  }

  /**
   * Get event analytics
   */
  getEventAnalytics(): EventAnalytics[] {
    const eventMap = new Map<string, {
      occurrences: number;
      users: Set<string>;
      totalXp: number;
      lastOccurrence: Date;
    }>();

    // Aggregate event data
    for (const [userId, events] of this.eventHistory.entries()) {
      for (const event of events) {
        const existing = eventMap.get(event.type) || {
          occurrences: 0,
          users: new Set(),
          totalXp: 0,
          lastOccurrence: new Date(0)
        };

        existing.occurrences++;
        existing.users.add(userId);
        existing.totalXp += event.data?.xp || 0;
        
        if (event.timestamp > existing.lastOccurrence) {
          existing.lastOccurrence = event.timestamp;
        }

        eventMap.set(event.type, existing);
      }
    }

    // Convert to EventAnalytics format
    return Array.from(eventMap.entries()).map(([eventType, data]) => ({
      eventType,
      totalOccurrences: data.occurrences,
      uniqueUsers: data.users.size,
      averageXpPerEvent: data.occurrences > 0 ? data.totalXp / data.occurrences : 0,
      lastOccurrence: data.lastOccurrence,
      trend: this.calculateTrend(eventType)
    }));
  }

  /**
   * Get user engagement score
   */
  getEngagementScore(userId: string): number {
    const metrics = this.getUserMetrics(userId);
    if (!metrics) return 0;

    // Calculate engagement score based on multiple factors
    const sessionScore = Math.min(metrics.totalSessions * 10, 30);
    const timeScore = Math.min(metrics.totalPlayTime / 60, 25); // Cap at 25 hours
    const activityScore = Math.min(metrics.totalXp / 1000, 25); // Cap at 25k XP
    const achievementScore = Math.min(metrics.totalAchievements * 5, 20);

    return Math.min(sessionScore + timeScore + activityScore + achievementScore, 100);
  }

  /**
   * Get leaderboard by engagement
   */
  getEngagementLeaderboard(limit: number = 10): Array<{ userId: string; score: number }> {
    const scores = Array.from(this.userMetrics.entries()).map(([userId, metrics]) => ({
      userId,
      score: this.getEngagementScore(userId)
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get user session history
   */
  getUserSessions(userId: string): UserSession[] {
    return this.sessions.get(userId) || [];
  }

  /**
   * Get user event history
   */
  getUserEvents(userId: string): GameEvent[] {
    return this.eventHistory.get(userId) || [];
  }

  /**
   * Get popular events
   */
  getPopularEvents(limit: number = 10): Array<{ eventType: string; count: number }> {
    const eventCounts = new Map<string, number>();

    for (const events of this.eventHistory.values()) {
      for (const event of events) {
        eventCounts.set(event.type, (eventCounts.get(event.type) || 0) + 1);
      }
    }

    return Array.from(eventCounts.entries())
      .map(([eventType, count]) => ({ eventType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Update user metrics
   */
  private updateUserMetrics(userId: string): void {
    const userSessions = this.sessions.get(userId) || [];
    const userEvents = this.eventHistory.get(userId) || [];

    const totalSessions = userSessions.length;
    const totalPlayTime = userSessions.reduce((total, session) => {
      if (session.endTime) {
        return total + (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60);
      }
      return total;
    }, 0);

    const averageSessionLength = totalSessions > 0 ? totalPlayTime / totalSessions : 0;
    const totalXp = userEvents.reduce((total, event) => total + (event.data?.xp || 0), 0);
    const totalLevelUps = userEvents.filter(e => e.type === 'level-up').length;
    const totalAchievements = userEvents.filter(e => e.type === 'achievement-earned').length;
    const totalBadges = userEvents.filter(e => e.type === 'badge-earned').length;

    const favoriteEvents = this.getFavoriteEvents(userEvents);
    const lastActive = userEvents.length > 0 
      ? userEvents[userEvents.length - 1].timestamp 
      : new Date();

    const metrics: UserMetrics = {
      userId,
      totalSessions,
      totalPlayTime,
      averageSessionLength,
      totalXp,
      totalLevelUps,
      totalAchievements,
      totalBadges,
      favoriteEvents,
      lastActive,
      engagementScore: 0 // Will be calculated on demand
    };

    this.userMetrics.set(userId, metrics);
  }

  /**
   * Get user's favorite events
   */
  private getFavoriteEvents(events: GameEvent[]): string[] {
    const eventCounts = new Map<string, number>();

    for (const event of events) {
      eventCounts.set(event.type, (eventCounts.get(event.type) || 0) + 1);
    }

    return Array.from(eventCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([eventType]) => eventType);
  }

  /**
   * Calculate event trend
   */
  private calculateTrend(eventType: string): 'increasing' | 'decreasing' | 'stable' {
    // This is a simplified trend calculation
    // In a real implementation, you'd compare recent vs historical data
    return 'stable';
  }

  /**
   * Clear analytics data (for testing)
   */
  clearData(): void {
    this.sessions.clear();
    this.eventHistory.clear();
    this.userMetrics.clear();
  }
} 