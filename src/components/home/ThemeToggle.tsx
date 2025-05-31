import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
const ThemeToggle: React.FC = () => {
  const {
    isDayMode,
    toggleTheme
  } = useTheme();
  return <div className="fixed top-4 right-4 z-50">
      
    </div>;
};
export default ThemeToggle;