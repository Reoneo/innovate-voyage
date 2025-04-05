
import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { socialPlatforms } from '@/constants/socialPlatforms';
import { Loader2 } from 'lucide-react';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
  isLoading?: boolean;
  onCopyDiscord?: (discordHandle: string) => void;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ 
  socials, 
  isLoading = false,
  onCopyDiscord
}) => {
  if (isLoading) {
    return (
      <div className="col-span-full flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading social links...</span>
      </div>
    );
  }
  
  // Check if we have any actual social links
  const hasSocialLinks = Object.entries(socials || {}).some(([key, val]) => val && val.trim() !== '');
  
  if (!hasSocialLinks) {
    return <span className="text-sm text-muted-foreground col-span-full">No social links available</span>;
  }
  
  return (
    <>
      {/* Display standard social platforms first */}
      {socialPlatforms.map(platform => 
        socials[platform.key] && (
          <SocialLinkItem 
            key={platform.key}
            platformType={platform.type} 
            url={socials[platform.key]}
            onCopy={platform.key === 'discord' ? () => onCopyDiscord?.(socials[platform.key]) : undefined}
          />
        )
      )}
      
      {/* Add special handling for WhatsApp */}
      {socials.whatsapp && (
        <SocialLinkItem
          key="whatsapp"
          platformType="whatsapp"
          url={socials.whatsapp}
          iconUrl="https://cdn.worldvectorlogo.com/logos/whatsapp-3.svg"
        />
      )}
      
      {/* Add special handling for Bluesky */}
      {socials.bluesky && (
        <SocialLinkItem
          key="bluesky"
          platformType="bluesky"
          url={socials.bluesky}
          iconUrl="https://cdn.worldvectorlogo.com/logos/bluesky-1.svg"
        />
      )}
      
      {/* Handle any custom social links not in our predefined list */}
      {Object.entries(socials).map(([key, value]) => {
        // Skip if this platform is already handled above or if value is empty
        if (!value || 
            socialPlatforms.some(p => p.key === key) || 
            key === 'whatsapp' || 
            key === 'bluesky') {
          return null;
        }
        
        return (
          <SocialLinkItem
            key={key}
            platformType={key}
            url={value}
          />
        );
      })}
    </>
  );
};

export default SocialMediaLinks;
