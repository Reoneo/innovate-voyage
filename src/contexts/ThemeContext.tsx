
import React from 'react';

interface ThemeContextType {
  isDayMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDayMode, setIsDayMode] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'day') {
        setIsDayMode(true);
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
  }, []);

  const toggleTheme = React.useCallback(() => {
    try {
      const newMode = !isDayMode;
      setIsDayMode(newMode);
      localStorage.setItem('theme', newMode ? 'day' : 'night');
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [isDayMode]);

  const contextValue = React.useMemo<ThemeContextType>(() => ({
    isDayMode,
    toggleTheme
  }), [isDayMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
