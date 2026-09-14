import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import theme from '../theme/theme';

export type ThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const readMode = (): ThemeMode => {
  try {
    const value = localStorage.getItem('capacity-connect-theme');
    return value === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(readMode);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem('capacity-connect-theme', next);
    } catch {
      // ignore storage failures
    }
  };

  const resolvedTheme = useMemo(
    () =>
      createTheme(theme, {
        palette: {
          mode,
          background:
            mode === 'dark'
              ? { default: '#0E1A24', paper: '#152532' }
              : { default: '#F5F7FA', paper: '#FFFFFF' },
          text:
            mode === 'dark'
              ? { primary: '#F4F8FB', secondary: '#B9C9D4' }
              : { primary: '#172B3A', secondary: '#5B6B7A' },
          divider: mode === 'dark' ? '#29404F' : '#D9E4EB',
        },
      }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const value = useContext(ThemeModeContext);
  if (!value) throw new Error('useThemeMode must be used inside ThemeModeProvider');
  return value;
};
