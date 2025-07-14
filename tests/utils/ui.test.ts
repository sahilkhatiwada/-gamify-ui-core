import { 
  createNotification, 
  showLevelUpAnimation, 
  showXpGainAnimation, 
  showBadgePopup,
  formatNumber,
  getRarityColor,
  getDifficultyColor
} from '../../src/utils/ui';

describe('UI Utilities', () => {
  beforeEach(() => {
    // Mock DOM elements
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createNotification', () => {
    it('should create a notification element', () => {
      const notification = createNotification('Test message', 'success');
      
      expect(notification).toBeInstanceOf(HTMLElement);
      expect(notification.textContent).toBe('Test message');
      expect(notification.classList.contains('notification')).toBe(true);
      expect(notification.classList.contains('success')).toBe(true);
    });

    it('should create notification with different types', () => {
      const success = createNotification('Success', 'success');
      const warning = createNotification('Warning', 'warning');
      const error = createNotification('Error', 'error');
      const info = createNotification('Info', 'info');
      
      expect(success.classList.contains('success')).toBe(true);
      expect(warning.classList.contains('warning')).toBe(true);
      expect(error.classList.contains('error')).toBe(true);
      expect(info.classList.contains('info')).toBe(true);
    });

    it('should add notification to DOM', () => {
      const notification = createNotification('Test message', 'success');
      document.body.appendChild(notification);
      
      expect(document.body.contains(notification)).toBe(true);
    });
  });

  describe('showLevelUpAnimation', () => {
    it('should create level up animation element', () => {
      const animation = showLevelUpAnimation(5, { x: 100, y: 200 });
      
      expect(animation).toBeInstanceOf(HTMLElement);
      expect(animation.textContent).toContain('Level Up!');
      expect(animation.textContent).toContain('5');
      expect(animation.style.position).toBe('absolute');
      expect(animation.style.left).toBe('100px');
      expect(animation.style.top).toBe('200px');
    });

    it('should apply animation classes', () => {
      const animation = showLevelUpAnimation(3, { x: 50, y: 100 });
      
      expect(animation.classList.contains('level-up-animation')).toBe(true);
      expect(animation.classList.contains('animated')).toBe(true);
    });

    it('should handle different level values', () => {
      const animation1 = showLevelUpAnimation(1, { x: 0, y: 0 });
      const animation10 = showLevelUpAnimation(10, { x: 0, y: 0 });
      
      expect(animation1.textContent).toContain('1');
      expect(animation10.textContent).toContain('10');
    });
  });

  describe('showXpGainAnimation', () => {
    it('should create XP gain animation element', () => {
      const animation = showXpGainAnimation(25, { x: 150, y: 250 });
      
      expect(animation).toBeInstanceOf(HTMLElement);
      expect(animation.textContent).toContain('+25');
      expect(animation.textContent).toContain('XP');
      expect(animation.style.position).toBe('absolute');
      expect(animation.style.left).toBe('150px');
      expect(animation.style.top).toBe('250px');
    });

    it('should apply animation classes', () => {
      const animation = showXpGainAnimation(10, { x: 0, y: 0 });
      
      expect(animation.classList.contains('xp-gain-animation')).toBe(true);
      expect(animation.classList.contains('animated')).toBe(true);
    });

    it('should handle different XP values', () => {
      const animation1 = showXpGainAnimation(1, { x: 0, y: 0 });
      const animation100 = showXpGainAnimation(100, { x: 0, y: 0 });
      
      expect(animation1.textContent).toContain('+1');
      expect(animation100.textContent).toContain('+100');
    });
  });

  describe('showBadgePopup', () => {
    it('should create badge popup element', () => {
      const badge = {
        id: 'badge-1',
        name: 'First Steps',
        description: 'Complete your first action',
        rarity: 'common' as const,
        earnedAt: new Date()
      };
      
      const popup = showBadgePopup(badge, { x: 200, y: 300 });
      
      expect(popup).toBeInstanceOf(HTMLElement);
      expect(popup.textContent).toContain('First Steps');
      expect(popup.textContent).toContain('Complete your first action');
      expect(popup.style.position).toBe('absolute');
      expect(popup.style.left).toBe('200px');
      expect(popup.style.top).toBe('300px');
    });

    it('should apply popup classes', () => {
      const badge = {
        id: 'badge-1',
        name: 'Test Badge',
        description: 'Test description',
        rarity: 'rare' as const,
        earnedAt: new Date()
      };
      
      const popup = showBadgePopup(badge, { x: 0, y: 0 });
      
      expect(popup.classList.contains('badge-popup')).toBe(true);
      expect(popup.classList.contains('animated')).toBe(true);
    });

    it('should handle different badge rarities', () => {
      const commonBadge = {
        id: 'badge-1',
        name: 'Common Badge',
        description: 'Common badge',
        rarity: 'common' as const,
        earnedAt: new Date()
      };
      
      const rareBadge = {
        id: 'badge-2',
        name: 'Rare Badge',
        description: 'Rare badge',
        rarity: 'rare' as const,
        earnedAt: new Date()
      };
      
      const epicBadge = {
        id: 'badge-3',
        name: 'Epic Badge',
        description: 'Epic badge',
        rarity: 'epic' as const,
        earnedAt: new Date()
      };
      
      const legendaryBadge = {
        id: 'badge-4',
        name: 'Legendary Badge',
        description: 'Legendary badge',
        rarity: 'legendary' as const,
        earnedAt: new Date()
      };
      
      const commonPopup = showBadgePopup(commonBadge, { x: 0, y: 0 });
      const rarePopup = showBadgePopup(rareBadge, { x: 0, y: 0 });
      const epicPopup = showBadgePopup(epicBadge, { x: 0, y: 0 });
      const legendaryPopup = showBadgePopup(legendaryBadge, { x: 0, y: 0 });
      
      expect(commonPopup.classList.contains('common')).toBe(true);
      expect(rarePopup.classList.contains('rare')).toBe(true);
      expect(epicPopup.classList.contains('epic')).toBe(true);
      expect(legendaryPopup.classList.contains('legendary')).toBe(true);
    });
  });

  describe('formatNumber', () => {
    it('should format small numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(5)).toBe('5');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(999)).toBe('999');
    });

    it('should format thousands with K suffix', () => {
      expect(formatNumber(1000)).toBe('1K');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(10000)).toBe('10K');
      expect(formatNumber(12345)).toBe('12.3K');
      expect(formatNumber(999999)).toBe('999.9K');
    });

    it('should format millions with M suffix', () => {
      expect(formatNumber(1000000)).toBe('1M');
      expect(formatNumber(1500000)).toBe('1.5M');
      expect(formatNumber(10000000)).toBe('10M');
      expect(formatNumber(12345678)).toBe('12.3M');
    });

    it('should format billions with B suffix', () => {
      expect(formatNumber(1000000000)).toBe('1B');
      expect(formatNumber(1500000000)).toBe('1.5B');
      expect(formatNumber(10000000000)).toBe('10B');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-100)).toBe('-100');
      expect(formatNumber(-1000)).toBe('-1K');
      expect(formatNumber(-1000000)).toBe('-1M');
    });

    it('should handle decimal numbers', () => {
      expect(formatNumber(0.5)).toBe('0.5');
      expect(formatNumber(1.5)).toBe('1.5');
      expect(formatNumber(1000.5)).toBe('1K');
    });
  });

  describe('getRarityColor', () => {
    it('should return correct colors for each rarity', () => {
      expect(getRarityColor('common')).toBe('#6c757d');
      expect(getRarityColor('uncommon')).toBe('#28a745');
      expect(getRarityColor('rare')).toBe('#007bff');
      expect(getRarityColor('epic')).toBe('#6f42c1');
      expect(getRarityColor('legendary')).toBe('#fd7e14');
    });

    it('should return default color for unknown rarity', () => {
      expect(getRarityColor('unknown' as any)).toBe('#6c757d');
    });
  });

  describe('getDifficultyColor', () => {
    it('should return correct colors for each difficulty', () => {
      expect(getDifficultyColor('easy')).toBe('#28a745');
      expect(getDifficultyColor('medium')).toBe('#ffc107');
      expect(getDifficultyColor('hard')).toBe('#dc3545');
      expect(getDifficultyColor('expert')).toBe('#6f42c1');
    });

    it('should return default color for unknown difficulty', () => {
      expect(getDifficultyColor('unknown' as any)).toBe('#6c757d');
    });
  });
}); 