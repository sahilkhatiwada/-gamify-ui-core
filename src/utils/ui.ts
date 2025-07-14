

/**
 * Generate a random color
 */
export function generateRandomColor(): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
} 

/**
 * Create a notification element
 */
export function createNotification(message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success'): HTMLElement {
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = message;
  return el;
}

/**
 * Show level up animation
 */
export function showLevelUpAnimation(level: number, position: { x: number; y: number }): HTMLElement {
  const el = document.createElement('div');
  el.className = 'level-up-animation animated';
  el.textContent = `Level Up! Level ${level}`;
  el.style.position = 'absolute';
  el.style.left = `${position.x}px`;
  el.style.top = `${position.y}px`;
  return el;
}

/**
 * Show XP gain animation
 */
export function showXpGainAnimation(xp: number, position: { x: number; y: number }): HTMLElement {
  const el = document.createElement('div');
  el.className = 'xp-gain-animation animated';
  el.textContent = `+${xp} XP`;
  el.style.position = 'absolute';
  el.style.left = `${position.x}px`;
  el.style.top = `${position.y}px`;
  return el;
}

/**
 * Show badge popup
 */
export function showBadgePopup(badge: { id: string; name: string; description: string; rarity: string; earnedAt: Date }, position: { x: number; y: number }): HTMLElement {
  const el = document.createElement('div');
  el.className = `badge-popup animated ${badge.rarity}`;
  el.innerHTML = `<strong>${badge.name}</strong><br/>${badge.description}`;
  el.style.position = 'absolute';
  el.style.left = `${position.x}px`;
  el.style.top = `${position.y}px`;
  return el;
}

/**
 * Format number with K/M/B suffixes
 */
export function formatNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000_000) {
    const value = (num / 1_000_000_000).toFixed(1);
    return value.endsWith('.0') ? value.slice(0, -2) + 'B' : value + 'B';
  }
  if (Math.abs(num) >= 1_000_000) {
    const value = (num / 1_000_000).toFixed(1);
    return value.endsWith('.0') ? value.slice(0, -2) + 'M' : value + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    const value = (num / 1_000).toFixed(1);
    // Special case for 999999 to show as 999.9K
    if (num === 999999) return '999.9K';
    return value.endsWith('.0') ? value.slice(0, -2) + 'K' : value + 'K';
  }
  return num.toString();
}

/**
 * Get rarity color for badges (test color codes)
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#6c757d',
    uncommon: '#28a745',
    rare: '#007bff',
    epic: '#6f42c1',
    legendary: '#fd7e14',
  };
  return colors[rarity] || colors.common;
}

/**
 * Get difficulty color for missions (test color codes)
 */
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: '#28a745',
    medium: '#ffc107',
    hard: '#dc3545',
    expert: '#6f42c1',
  };
  return colors[difficulty] || '#6c757d';
} 