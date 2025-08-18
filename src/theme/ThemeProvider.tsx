import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (next: ThemeMode) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'theme-mode';

function computeIsDark(mode: ThemeMode, mql: MediaQueryList): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return mql.matches; // auto
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) : null;
    return stored ?? 'auto';
  });

  // Media query for system theme
  const mql = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), []);
  const [isDark, setIsDark] = useState<boolean>(() => computeIsDark(mode, mql));

  // Apply class and persist preference
  useLayoutEffect(() => {
    const root = document.documentElement;
    const nextIsDark = computeIsDark(mode, mql);
    setIsDark(nextIsDark);
    root.classList.toggle('dark', nextIsDark);
    localStorage.setItem(STORAGE_KEY, mode);
    root.setAttribute('data-theme-mode', mode);
  }, [mode, mql]);

  // React to system changes in auto mode
  useEffect(() => {
    function handleChange() {
      if (mode === 'auto') {
        const next = computeIsDark('auto', mql);
        document.documentElement.classList.toggle('dark', next);
        setIsDark(next);
      }
    }
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [mode, mql]);

  const value: ThemeContextValue = useMemo(() => ({ mode, setMode, isDark }), [mode, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}


