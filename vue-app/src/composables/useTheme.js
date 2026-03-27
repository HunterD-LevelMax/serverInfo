/**
 * Composable for theme management
 * Handles light/dark theme switching with localStorage persistence
 */
import { ref, watch } from 'vue';

const THEME_KEY = 'server-monitor-theme';

// Shared state
const isDark = ref(false);

export function useTheme() {
  /**
   * Initialize theme from localStorage or system preference
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
      // Use saved preference
      isDark.value = savedTheme === 'dark';
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark.value = prefersDark;
    }
    
    applyTheme();
  };
  
  /**
   * Apply theme to document
   */
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };
  
  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light');
    applyTheme();
  };
  
  /**
   * Set specific theme
   * @param {boolean} dark - true for dark theme, false for light
   */
  const setTheme = (dark) => {
    isDark.value = dark;
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    applyTheme();
  };
  
  // Watch for changes and apply theme
  watch(isDark, () => {
    applyTheme();
  });
  
  return {
    isDark,
    initTheme,
    toggleTheme,
    setTheme
  };
}
