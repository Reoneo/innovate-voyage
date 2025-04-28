import React from 'react';
import { SocialIcon } from "@/components/ui/social-icon";

interface SocialLinkItemProps {
  platform: string;
  url?: string;
  username?: string;
  size?: "sm" | "md" | "lg";
  showUsername?: boolean;
}

const normalizeUrl = (platform: string, url?: string, username?: string): string => {
  if (!url && !username) return '#';
  
  switch (platform.toLowerCase()) {
    case 'telegram':
      if (username) {
        return `https://t.me/${username.replace(/^@/, '')}`;
      }
      if (url && url.includes('t.me/')) {
        const telegramUsername = url.split('t.me/')[1]?.split('/')[0];
        if (telegramUsername) {
          return `https://t.me/${telegramUsername}`;
        }
      }
      return url || '#';
      
    case 'twitter':
    case 'x':
      if (username) {
        return `https://twitter.com/${username.replace(/^@/, '')}`;
      }
      return url || '#';
      
    case 'instagram':
      if (username) {
        return `https://instagram.com/${username.replace(/^@/, '')}`;
      }
      return url || '#';
      
    case 'github':
      if (username) {
        return `https://github.com/${username}`;
      }
      return url || '#';
      
    case 'linkedin':
      return url || (username ? `https://linkedin.com/in/${username}` : '#');
      
    case 'discord':
      return url || '#';
      
    case 'bluesky':
      if (username) {
        return `https://bsky.app/profile/${username.replace(/^@/, '')}`;
      }
      return url || '#';
      
    default:
      if (url?.match(/^(https?:)?\/\//)) {
        return url;
      }
      return url ? `https://${url.replace(/^https?:\/\//, '')}` : '#';
  }
};

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({
  platform,
  url,
  username,
  size = "md",
  showUsername = true
}) => {
  const finalUrl = normalizeUrl(platform, url, username);
  const displayName = username || (url ? new URL(finalUrl).hostname.replace(/^www\./, '') : platform);
  
  const iconSizeMap = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  const containerClass = showUsername ? "flex items-center space-x-2" : "";
  
  return (
    <a 
      href={finalUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={containerClass}
    >
      <SocialIcon
        platform={platform.toLowerCase()}
        className={iconSizeMap[size]}
      />
      {showUsername && (
        <span className="text-sm text-muted-foreground">
          {displayName}
        </span>
      )}
    </a>
  );
};

export default SocialLinkItem;
