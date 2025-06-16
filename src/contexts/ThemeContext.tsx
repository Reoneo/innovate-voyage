
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

interface ThemeContextType {
  isDayMode: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Initialize context with undefined first
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the provider component
const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const [isDayMode, setIsDayMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'day') {
        setIsDayMode(true);
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    try {
      const newMode = !isDayMode;
      setIsDayMode(newMode);
      localStorage.setItem('theme', newMode ? 'day' : 'night');
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [isDayMode]);

  const contextValue = useMemo(() => ({
    isDayMode,
    toggleTheme
  }), [isDayMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Define the hook
const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export both components
export { ThemeProvider, useTheme };
