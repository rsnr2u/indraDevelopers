import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getData } from '../utils/localStorage';

interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  headingColor: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  refreshTheme: () => void;
  // Utility functions for applying colors
  getTextStyle: () => { color: string };
  getHeadingStyle: () => { color: string };
  getButtonStyle: () => { backgroundColor: string; borderColor: string };
  getLinkStyle: () => { color: string };
  getIconStyle: () => { color: string };
  getHoverBorderStyle: () => { borderColor: string };
  getGradientStyle: () => { background: string };
  getActiveStyle: () => { color: string; backgroundColor: string };
}

const defaultColors: ThemeColors = {
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  accentColor: '#3b82f6',
  textColor: '#1f2937',
  headingColor: '#1e3a8a'
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  refreshTheme: () => { },
  getTextStyle: () => ({ color: defaultColors.textColor }),
  getHeadingStyle: () => ({ color: defaultColors.headingColor }),
  getButtonStyle: () => ({ backgroundColor: defaultColors.primaryColor, borderColor: defaultColors.primaryColor }),
  getLinkStyle: () => ({ color: defaultColors.primaryColor }),
  getIconStyle: () => ({ color: defaultColors.primaryColor }),
  getHoverBorderStyle: () => ({ borderColor: defaultColors.primaryColor }),
  getGradientStyle: () => ({ background: `linear-gradient(135deg, ${defaultColors.primaryColor}, ${defaultColors.secondaryColor})` }),
  getActiveStyle: () => ({ color: defaultColors.primaryColor, backgroundColor: `${defaultColors.primaryColor}15` })
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);

  const loadTheme = async () => {
    try {
      const settings = await getData('settings');
      if (settings?.theme) {
        setColors(settings.theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  useEffect(() => {
    loadTheme();

    // Listen for storage changes (different tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'settings') {
        loadTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates
    const handleSettingsUpdate = () => {
      loadTheme();
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const refreshTheme = () => {
    loadTheme();
  };

  // Utility functions
  const getTextStyle = () => ({ color: colors.textColor });

  const getHeadingStyle = () => ({ color: colors.headingColor });

  const getButtonStyle = () => ({
    backgroundColor: colors.primaryColor,
    borderColor: colors.primaryColor
  });

  const getLinkStyle = () => ({ color: colors.primaryColor });

  const getIconStyle = () => ({ color: colors.primaryColor });

  const getHoverBorderStyle = () => ({ borderColor: colors.primaryColor });

  const getGradientStyle = () => ({
    background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`
  });

  const getActiveStyle = () => ({
    color: colors.primaryColor,
    backgroundColor: `${colors.primaryColor}15`
  });

  return (
    <ThemeContext.Provider value={{
      colors,
      refreshTheme,
      getTextStyle,
      getHeadingStyle,
      getButtonStyle,
      getLinkStyle,
      getIconStyle,
      getHoverBorderStyle,
      getGradientStyle,
      getActiveStyle
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
