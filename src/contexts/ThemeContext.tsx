
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDayMode: boolean;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
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

  const toggleTheme = () => {
    try {
      const newMode = !isDayMode;
      setIsDayMode(newMode);
      localStorage.setItem('theme', newMode ? 'day' : 'night');
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  const contextValue: ThemeContextType = {
    isDayMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
