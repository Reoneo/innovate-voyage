
import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { socialPlatforms } from '@/constants/socialPlatforms';
import { Loader2 } from 'lucide-react';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
  isLoading?: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socials, isLoading = false }) => {
  // Filter platforms that have values in socials
  const availablePlatforms = socialPlatforms.filter(platform => socials[platform.key]);
  
  if (isLoading) {
    return (
      <div className="col-span-full flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading social links...</span>
      </div>
    );
  }
  
  if (availablePlatforms.length === 0) {
    return <span className="text-sm text-muted-foreground col-span-full">No social links available</span>;
  }
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {availablePlatforms.map(platform => 
        socials[platform.key] && (
          <SocialLinkItem 
            key={platform.key}
            platformType={platform.type} 
            url={socials[platform.key]} 
          />
        )
      )}
      {socials.email && (
        <SocialLinkItem 
          platformType="mail" 
          url={`mailto:${socials.email}`} 
        />
      )}
    </div>
  );
};

export default SocialMediaLinks;
