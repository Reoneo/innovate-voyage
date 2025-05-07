
import React from 'react';
import { Mail, Globe, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-gray-200 mt-8">
      <div className="flex flex-col items-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="mailto:hello@smith.box" aria-label="Email" className="text-gray-600 hover:text-primary">
            <Mail className="h-6 w-6" />
          </a>
          <a href="https://www.smith.box" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-gray-600 hover:text-primary">
            <Globe className="h-6 w-6" />
          </a>
        </div>
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <Link to="/privacy-policy" className="hover:text-primary flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
