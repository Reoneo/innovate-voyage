
import React from 'react';
import { SocialIcon } from '@/components/ui/social-icon';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

export default function SocialLinksSection({ socials, identity }: SocialLinksSectionProps) {
  if (!socials || Object.keys(socials).length === 0) {
    return null;
  }
  
  // Mapping of social media keys to their display types
  const socialTypeMappings: Record<string, string> = {
    github: 'github',
    twitter: 'twitter',
    linkedin: 'linkedin',
    website: 'globe',
    email: 'mail',
    facebook: 'facebook',
    instagram: 'instagram',
    youtube: 'youtube',
    bluesky: 'bluesky',
    telegram: 'telegram',
    discord: 'discord',
    whatsapp: 'whatsapp',
    reddit: 'reddit',
    farcaster: 'farcaster',
    lens: 'lens',
    opensea: 'opensea'
  };
  
  // Function to format social media URL correctly
  const formatSocialUrl = (key: string, value: string): string => {
    // Return as-is if it already includes http:// or https://
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    
    // Strip @ from the beginning if present
    const cleanValue = value.startsWith('@') ? value.slice(1) : value;
    
    switch (key) {
      case 'twitter':
        return `https://twitter.com/${cleanValue}`;
      case 'github':
        return `https://github.com/${cleanValue}`;
      case 'linkedin':
        if (cleanValue.includes('linkedin.com/')) {
          return cleanValue.includes('https://') ? cleanValue : `https://${cleanValue}`;
        }
        return `https://linkedin.com/in/${cleanValue}`;
      case 'facebook':
        return `https://facebook.com/${cleanValue}`;
      case 'instagram':
        return `https://instagram.com/${cleanValue}`;
      case 'youtube':
        return cleanValue.includes('youtube.com/') ? 
          (cleanValue.includes('https://') ? cleanValue : `https://${cleanValue}`) : 
          `https://youtube.com/channel/${cleanValue}`;
      case 'bluesky':
        return `https://bsky.app/profile/${cleanValue}`;
      case 'telegram':
        return `https://t.me/${cleanValue}`;
      case 'discord':
        return cleanValue;  // Discord is usually just a username
      case 'reddit':
        return `https://reddit.com/user/${cleanValue}`;
      case 'whatsapp':
        return `https://wa.me/${cleanValue.replace(/\D/g,'')}`;
      case 'farcaster':
        return cleanValue;  // Farcaster might not have a standard URL format yet
      case 'lens':
        return `https://lenster.xyz/u/${cleanValue}`;
      case 'opensea':
        return `https://opensea.io/${cleanValue}`;
      case 'email':
        return `mailto:${cleanValue}`;
      case 'website':
      default:
        if (cleanValue.includes('.')) {
          return cleanValue.includes('https://') ? cleanValue : `https://${cleanValue}`;
        }
        return cleanValue;
    }
  };
  
  const renderSocialLinks = () => {
    return Object.entries(socials).map(([key, value]) => {
      // Skip if empty value
      if (!value || value.trim() === '') {
        return null;
      }
      
      const socialType = socialTypeMappings[key.toLowerCase()] || 'globe';
      const formattedUrl = formatSocialUrl(key.toLowerCase(), value);
      
      // Special case for Discord and email which might not be clickable links
      if (key.toLowerCase() === 'discord' && !formattedUrl.includes('discord.com')) {
        return (
          <div key={key} className="inline-flex items-center mr-2 mb-2">
            <SocialIcon type={socialType} size={24} className="mr-1" />
            <span className="text-sm text-gray-300">{value}</span>
          </div>
        );
      }
      
      return (
        <a
          key={key}
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full bg-gray-800 hover:bg-gray-700 px-3 py-1 mr-2 mb-2 transition-colors"
          data-identity={identity}
          data-social-type={key}
        >
          <SocialIcon type={socialType} size={18} className="mr-1.5" />
          <span className="text-sm text-gray-300">{key.toLowerCase() === 'email' ? 'Email' : key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}</span>
        </a>
      );
    });
  };
  
  return (
    <div className="flex flex-wrap mt-3 justify-center">
      {renderSocialLinks()}
    </div>
  );
}
