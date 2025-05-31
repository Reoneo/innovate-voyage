
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDayMode, toggleTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className={`h-10 w-10 transition-all duration-200 ${
          isDayMode 
            ? 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100' 
            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
        }`}
      >
        {isDayMode ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;
