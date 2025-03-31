
import React from 'react';
import { Github, Twitter, Linkedin, Globe, Mail, Facebook, MessageCircle, Smartphone, Instagram, Youtube, Link, MessageSquare } from 'lucide-react';

type SocialIconType = 'github' | 'twitter' | 'linkedin' | 'globe' | 'mail' | 'facebook' | 'whatsapp' | 'messenger' | 'bluesky' | 'instagram' | 'youtube' | 'telegram' | 'reddit' | 'discord';

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
      // Using a text-based fallback for Discord since the Discord icon is not available
      return <div className={`text-indigo-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>D</div>;
    default:
      return null;
  }
};
