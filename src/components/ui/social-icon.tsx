
import React from 'react';
import { 
  Twitter, 
  Github, 
  Instagram, 
  Linkedin, 
  Telegram, 
  Discord, 
  Globe,
  MessageSquare
} from 'lucide-react';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  platform, 
  className = 'h-6 w-6'
}) => {
  // Normalize the platform name to lowercase for case-insensitive matching
  const normalizedPlatform = platform.toLowerCase();

  const IconComponent = () => {
    switch (normalizedPlatform) {
      case 'twitter':
      case 'x':
        return <Twitter className={className} />;
      case 'github':
        return <Github className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'linkedin':
        return <Linkedin className={className} />;
      case 'telegram':
        return <Telegram className={className} />;
      case 'discord':
        return <Discord className={className} />;
      case 'bluesky':
        // Custom SVG for Bluesky
        return (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
          >
            <path d="M12 2L8 6l4 4-4 4 4 4-4 4h8l4-4-4-4 4-4-4-4 4-4h-8z" />
          </svg>
        );
      default:
        // Default to globe icon for any other platform
        return <Globe className={className} />;
    }
  };

  return <IconComponent />;
};
