
import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { socialPlatforms } from '@/constants/socialPlatforms';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socials }) => {
  // Filter platforms that have values in socials
  const availablePlatforms = socialPlatforms.filter(platform => socials[platform.key]);
  
  if (availablePlatforms.length === 0) {
    return <span className="text-sm text-muted-foreground col-span-full">No social links available</span>;
  }
  
  return (
    <>
      {availablePlatforms.map(platform => 
        socials[platform.key] && (
          <SocialLinkItem 
            key={platform.key}
            platformType={platform.type} 
            url={socials[platform.key]} 
          />
        )
      )}
    </>
  );
};

export default SocialMediaLinks;
