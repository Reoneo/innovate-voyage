
import React from 'react';
import SocialLinkItem from './SocialLinkItem';

interface SocialMediaLinksProps {
  socials: Record<string, string>;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socials }) => {
  // Define the social platforms we want to display
  const socialPlatforms = [
    { key: 'github', type: 'github' },
    { key: 'twitter', type: 'twitter' },
    { key: 'linkedin', type: 'linkedin' },
    { key: 'facebook', type: 'facebook' },
    { key: 'instagram', type: 'instagram' },
    { key: 'youtube', type: 'youtube' },
    { key: 'bluesky', type: 'bluesky' },
    { key: 'website', type: 'globe' }
  ];

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
