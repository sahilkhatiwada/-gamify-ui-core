import { GameRule, GameEvent } from '../types';

/**
 * Manages game rules and their evaluation
 */
export class RuleEngine {
  private readonly rules = new Map<string, GameRule>();

  /**
   * Add a new rule to the engine
   */
  addRule(rule: GameRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove a rule from the engine
   */
  removeRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Get all rules
   */
  getRules(): GameRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get rules that are applicable to a specific event
   */
  getApplicableRules(event: GameEvent): GameRule[] {
    return Array.from(this.rules.values())
      .filter(rule => rule.enabled && rule.trigger.type === event.type)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get rules by event type
   */
  getRulesByEventType(eventType: string): GameRule[] {
    return Array.from(this.rules.values())
      .filter(rule => rule.enabled && rule.trigger.type === eventType);
  }

  /**
   * Enable a rule
   */
  enableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.enabled = true;
      return true;
    }
    return false;
  }

  /**
   * Disable a rule
   */
  disableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.enabled = false;
      return true;
    }
    return false;
  }

  /**
   * Update rule priority
   */
  updateRulePriority(ruleId: string, priority: number): boolean {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.priority = priority;
      return true;
    }
    return false;
  }

  /**
   * Get rule by ID
   */
  getRule(ruleId: string): GameRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * Check if a rule exists
   */
  hasRule(ruleId: string): boolean {
    return this.rules.has(ruleId);
  }

  /**
   * Get total number of rules
   */
  getRuleCount(): number {
    return this.rules.size;
  }

  /**
   * Get number of enabled rules
   */
  getEnabledRuleCount(): number {
    return Array.from(this.rules.values()).filter(rule => rule.enabled).length;
  }
} 