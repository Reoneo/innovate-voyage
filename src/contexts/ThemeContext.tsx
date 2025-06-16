
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDayMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDayMode, setIsDayMode] = useState(false);

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

  return (
    <ThemeContext.Provider value={{ isDayMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
