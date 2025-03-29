
import React from 'react';
import SocialLinkItem from './SocialLinkItem';
import { socialPlatforms } from '@/constants/socialPlatforms';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socials }) => {
  return (
    <>
      {socialPlatforms.map(platform => 
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
