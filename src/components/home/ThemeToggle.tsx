
import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';

const ThemeToggle: React.FC = () => {
  const { isDayMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Menu Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className={`h-10 w-10 rounded-full transition-all duration-300 ${
            isDayMode 
              ? 'bg-white/80 hover:bg-white text-slate-800 shadow-lg' 
              : 'bg-slate-800/80 hover:bg-slate-700 text-white shadow-lg'
          } backdrop-blur-sm border border-white/20`}
        >
          <div className="relative">
            <Menu 
              className={`h-5 w-5 transition-all duration-300 ${
                isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
              }`} 
            />
            <X 
              className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
                isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
              }`} 
            />
          </div>
        </Button>
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className={`h-10 w-10 rounded-full transition-all duration-300 ${
            isDayMode 
              ? 'bg-white/80 hover:bg-white text-slate-800 shadow-lg' 
              : 'bg-slate-800/80 hover:bg-slate-700 text-white shadow-lg'
          } backdrop-blur-sm border border-white/20`}
        >
          <div className="relative">
            <Sun 
              className={`h-5 w-5 transition-all duration-300 ${
                isDayMode ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
              }`} 
            />
            <Moon 
              className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
                isDayMode ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'
              }`} 
            />
          </div>
        </Button>
      </div>

      {/* Animated Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Background Overlay */}
        <div 
          className={`absolute inset-0 ${
            isDayMode ? 'bg-white/90' : 'bg-slate-900/90'
          } backdrop-blur-md`}
          onClick={toggleMenu}
        />
        
        {/* Menu Content */}
        <div
          className={`absolute top-20 left-4 p-6 rounded-2xl shadow-2xl border transition-all duration-300 transform ${
            isMenuOpen ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-4'
          } ${
            isDayMode 
              ? 'bg-white border-slate-200' 
              : 'bg-slate-800 border-slate-700'
          }`}
        >
          <nav className="space-y-4">
            <Link
              to="/privacy-policy"
              onClick={toggleMenu}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                isDayMode
                  ? 'hover:bg-slate-100 text-slate-800'
                  : 'hover:bg-slate-700 text-white'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Privacy Policy</span>
            </Link>
            
            <Link
              to="/smith.box"
              onClick={toggleMenu}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                isDayMode
                  ? 'hover:bg-slate-100 text-slate-800'
                  : 'hover:bg-slate-700 text-white'
              }`}
            >
              <Mail className="h-5 w-5" />
              <span className="font-medium">Contact Us</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default ThemeToggle;
