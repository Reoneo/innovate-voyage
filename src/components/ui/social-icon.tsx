
import React from 'react';
import { Github, Twitter, Linkedin, Globe, Mail } from 'lucide-react';

type SocialIconType = 'github' | 'twitter' | 'linkedin' | 'globe' | 'mail';

interface SocialIconProps {
  type: SocialIconType;
  size?: number;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  type, 
  size = 20,
  className = ""
}) => {
  const iconClasses = `${className}`;
  
  switch (type) {
    case 'github':
      return <Github size={size} className={`text-gray-800 ${iconClasses}`} />;
    case 'twitter':
      return <Twitter size={size} className={`text-blue-400 ${iconClasses}`} />;
    case 'linkedin':
      return <Linkedin size={size} className={`text-blue-700 ${iconClasses}`} />;
    case 'globe':
      return <Globe size={size} className={`text-green-600 ${iconClasses}`} />;
    case 'mail':
      return <Mail size={size} className={`text-purple-500 ${iconClasses}`} />;
    default:
      return null;
  }
};
