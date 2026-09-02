import { createContext, useContext, useEffect, useState } from 'react';
import {
  applyAppearanceToDocument,
  getSystemMode,
  normalizeAppearance,
  readAppearancePreference,
  saveAppearancePreference,
  DEFAULT_APPEARANCE
} from './themeDefinitions';

const ThemeContext = createContext(null);

export function ThemeProvider({ children, initialAppearance }) {
  const [appearance, setAppearance] = useState(() => (
    normalizeAppearance(initialAppearance ?? readAppearancePreference())
  ));
  const [systemMode, setSystemMode] = useState(getSystemMode);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemMode(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  const effectiveMode = appearance.mode === 'system' ? systemMode : appearance.mode;

  useEffect(() => {
    applyAppearanceToDocument(appearance, effectiveMode);
    saveAppearancePreference(appearance);
  }, [appearance, effectiveMode]);

  function updateAppearance(changes) {
    setAppearance((current) => normalizeAppearance({ ...current, ...changes }));
  }

  function resetAppearance() {
    setAppearance({ ...DEFAULT_APPEARANCE });
  }

  return (
    <ThemeContext.Provider value={{
      appearance,
      effectiveMode,
      updateAppearance,
      resetAppearance
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return context;
}

