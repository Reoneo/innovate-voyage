
import React from 'react';
import { Mail, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-gray-200 mt-8">
      <div className="flex justify-center space-x-6">
        <a href="mailto:hello@smith.box" aria-label="Email" className="text-gray-600 hover:text-primary">
          <Mail className="h-6 w-6" />
        </a>
        <a href="https://t.me/recruitmentbox" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-gray-600 hover:text-primary">
          <img src="https://cdn-icons-png.flaticon.com/512/5968/5968804.png" className="h-6 w-6" alt="Telegram" />
        </a>
        <a href="https://www.smith.box" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-gray-600 hover:text-primary">
          <Globe className="h-6 w-6" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
