import { Theme } from '../types';

/**
 * Manages theme configuration and customization
 */
export class ThemeManager {
  private theme: Theme;

  constructor(customTheme?: Partial<Theme>) {
    this.theme = this.initializeTheme(customTheme);
  }

  /**
   * Get the current theme
   */
  getTheme(): Theme {
    return this.theme;
  }

  /**
   * Update the theme
   */
  updateTheme(updates: Partial<Theme>): void {
    this.theme = { ...this.theme, ...updates };
  }

  /**
   * Get theme colors
   */
  getColors() {
    return this.theme.colors;
  }

  /**
   * Get theme animations
   */
  getAnimations() {
    return this.theme.animations;
  }

  /**
   * Get theme sounds
   */
  getSounds() {
    return this.theme.sounds;
  }

  /**
   * Get theme spacing
   */
  getSpacing() {
    return this.theme.spacing;
  }

  /**
   * Get theme border radius
   */
  getBorderRadius() {
    return this.theme.borderRadius;
  }

  /**
   * Get a specific color
   */
  getColor(colorName: keyof Theme['colors']): string {
    return this.theme.colors[colorName];
  }

  /**
   * Get a specific animation
   */
  getAnimation(animationName: keyof Theme['animations']): string {
    return this.theme.animations[animationName];
  }

  /**
   * Get a specific sound
   */
  getSound(soundName: keyof Theme['sounds']): string | undefined {
    return this.theme.sounds[soundName];
  }

  /**
   * Get a specific spacing value
   */
  getSpacingValue(spacingName: keyof Theme['spacing']): string {
    return this.theme.spacing[spacingName];
  }

  /**
   * Get a specific border radius value
   */
  getBorderRadiusValue(radiusName: keyof Theme['borderRadius']): string {
    return this.theme.borderRadius[radiusName];
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Initialize theme with defaults and custom overrides
   */
  private initializeTheme(customTheme?: Partial<Theme>): Theme {
    const defaultTheme: Theme = {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b'
      },
      animations: {
        badgePopup: 'bounce-in 0.5s ease-out',
        xpGain: 'slide-up 0.3s ease-out',
        levelUp: 'scale-in 0.4s ease-out',
        achievement: 'fade-in 0.6s ease-out'
      },
      sounds: {},
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem'
      }
    };

    return { ...defaultTheme, ...customTheme };
  }
} 