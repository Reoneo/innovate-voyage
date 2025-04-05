
import React from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { Button } from '@/components/ui/button';
import { extractHandle } from '@/utils/socialLinkUtils';

interface SocialLinkItemProps {
  platformType: string;
  url: string;
  iconUrl?: string;
  onCopy?: () => void;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({ 
  platformType, 
  url,
  iconUrl,
  onCopy
}) => {
  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
  const isDiscord = platformType === 'discord';
  
  // Extract user-friendly display name from URL
  const displayName = extractHandle(formattedUrl, platformType);
  
  return (
    <div className="flex items-center gap-2">
      {iconUrl ? (
        <img src={iconUrl} alt={platformType} className="w-5 h-5" />
      ) : (
        <SocialIcon type={platformType as any} size={20} />
      )}
      
      {isDiscord ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-auto text-xs text-primary hover:text-primary/80 hover:bg-transparent"
          onClick={onCopy}
        >
          {displayName}
        </Button>
      ) : (
        <a
          href={formattedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:text-primary/80"
        >
          {displayName}
        </a>
      )}
    </div>
  );
};

export default SocialLinkItem;
