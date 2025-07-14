import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Theme } from '../types';

// Theme context
const ThemeContext = createContext<Theme | null>(null);

// Theme provider props
interface ThemeProviderProps {
  theme: Theme;
  children: ReactNode;
}

/**
 * Theme provider component that injects CSS variables
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  // Inject CSS variables for the theme
  useEffect(() => {
    injectThemeVariables(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme
 */
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

/**
 * Hook to use theme colors
 */
export const useThemeColors = () => {
  const theme = useTheme();
  return theme.colors;
};

/**
 * Hook to use theme animations
 */
export const useThemeAnimations = () => {
  const theme = useTheme();
  return theme.animations;
};

/**
 * Hook to use theme sounds
 */
export const useThemeSounds = () => {
  const theme = useTheme();
  return theme.sounds;
};

/**
 * Hook to use theme spacing
 */
export const useThemeSpacing = () => {
  const theme = useTheme();
  return theme.spacing;
};

/**
 * Hook to use theme border radius
 */
export const useThemeBorderRadius = () => {
  const theme = useTheme();
  return theme.borderRadius;
};

// ==================== PRIVATE FUNCTIONS ====================

/**
 * Inject theme variables into CSS
 */
function injectThemeVariables(theme: Theme): void {
  const root = document.documentElement;
  
  // Set color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--gamify-color-${key}`, value);
  });
  
  // Set spacing variables
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--gamify-spacing-${key}`, value);
  });
  
  // Set border radius variables
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--gamify-radius-${key}`, value);
  });
  
  // Set animation variables
  Object.entries(theme.animations).forEach(([key, value]) => {
    root.style.setProperty(`--gamify-animation-${key}`, value);
  });
} 