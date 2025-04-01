
import React from 'react';
import { Github, Twitter, Linkedin, Globe, Mail, Facebook, MessageCircle, Instagram, Youtube, MessageSquare, ExternalLink } from 'lucide-react';

type SocialIconType = 'github' | 'twitter' | 'linkedin' | 'globe' | 'mail' | 'facebook' | 'whatsapp' | 'messenger' | 'bluesky' | 'instagram' | 'youtube' | 'telegram' | 'reddit' | 'discord' | 'website' | 'email';

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
    case 'website':
      return <Globe size={size} className={`text-green-600 ${iconClasses}`} />;
    case 'mail':
    case 'email':
      return <Mail size={size} className={`text-purple-500 ${iconClasses}`} />;
    case 'facebook':
      return <Facebook size={size} className={`text-blue-600 ${iconClasses}`} />;
    case 'whatsapp':
      return <MessageSquare size={size} className={`text-green-500 ${iconClasses}`} />;
    case 'messenger':
      return <MessageCircle size={size} className={`text-blue-500 ${iconClasses}`} />;
    case 'bluesky':
      // Custom butterfly icon for Bluesky
      return (
        <span className={`inline-flex items-center justify-center text-blue-500 ${iconClasses}`}>
          <span role="img" aria-label="butterfly" style={{ fontSize: `${size * 0.8}px` }}>
            🦋
          </span>
        </span>
      );
    case 'instagram':
      return <Instagram size={size} className={`text-pink-600 ${iconClasses}`} />;
    case 'youtube':
      return <Youtube size={size} className={`text-red-600 ${iconClasses}`} />;
    case 'telegram':
      return <MessageCircle size={size} className={`text-blue-400 ${iconClasses}`} />;
    case 'reddit':
      return <div className={`text-orange-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>R</div>;
    case 'discord':
      // Using a custom icon for Discord since it's not available in Lucide
      return (
        <div className={`text-indigo-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.883-.608 1.283a18.565 18.565 0 0 0-5.487 0c-.164-.4-.397-.893-.617-1.283a.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.028C.533 9.09-.32 13.555.099 17.961a.08.08 0 0 0 .031.055c1.996 1.482 3.922 2.381 5.803 2.981a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106c-.631-.236-1.235-.52-1.82-.838a.077.077 0 0 1-.008-.128c.122-.091.244-.186.36-.284a.074.074 0 0 1 .078-.01c3.927 1.784 8.18 1.784 12.061 0a.074.074 0 0 1 .078.01c.118.098.24.193.36.284a.077.077 0 0 1-.006.127c-.585.319-1.19.602-1.82.838a.076.076 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028c1.89-.6 3.817-1.498 5.812-2.98a.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
          </svg>
        </div>
      );
    default:
      return <ExternalLink size={size} className={`text-gray-500 ${iconClasses}`} />;
  }
};
