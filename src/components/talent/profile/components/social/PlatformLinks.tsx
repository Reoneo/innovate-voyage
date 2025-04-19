
import React from 'react';
import SocialLinkItem from './SocialLinkItem';

interface PlatformLinksProps {
  normalizedSocials: Record<string, string>;
}

const PlatformLinks: React.FC<PlatformLinksProps> = ({ normalizedSocials }) => {
  // Define preferred platform order
  const platformOrder = [
    'github', 'twitter', 'linkedin', 'facebook', 'instagram', 
    'youtube', 'telegram', 'bluesky', 'discord', 'website', 
    'whatsapp', 'email', 'telephone', 'location'
  ];

  // Log the platform links being rendered
  console.log('PlatformLinks - Normalized socials:', normalizedSocials);
  
  return (
    <>
      {platformOrder.map(platformKey => 
        normalizedSocials[platformKey] && (
          <SocialLinkItem 
            key={platformKey}
            platformType={platformKey} 
            url={normalizedSocials[platformKey]} 
          />
        )
      )}
    </>
  );
};

export default PlatformLinks;
