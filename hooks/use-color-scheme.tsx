import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colorScheme: 'light' | 'dark';
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useDeviceColorScheme() ?? 'light';
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');

  const value = useMemo(() => {
    const colorScheme: 'light' | 'dark' =
      themePreference === 'system' ? (deviceScheme === 'dark' ? 'dark' : 'light') : themePreference;

    const toggleColorScheme = () => {
      setThemePreference(prev => {
        if (prev === 'system') {
          return deviceScheme === 'dark' ? 'light' : 'dark';
        }
        return prev === 'dark' ? 'light' : 'dark';
      });
    };

    return {
      colorScheme,
      themePreference,
      setThemePreference,
      toggleColorScheme,
    };
  }, [deviceScheme, themePreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export function useColorScheme() {
  return useTheme().colorScheme;
}
