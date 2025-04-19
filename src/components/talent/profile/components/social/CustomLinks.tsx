
import React from 'react';
import SocialLinkItem from './SocialLinkItem';

interface CustomLinksProps {
  normalizedSocials: Record<string, string>;
  standardPlatforms: string[];
}

const CustomLinks: React.FC<CustomLinksProps> = ({ normalizedSocials, standardPlatforms }) => {
  return (
    <>
      {Object.entries(normalizedSocials).map(([key, value]) => {
        // Skip if this platform is already handled or if value is empty
        if (!value || standardPlatforms.includes(key)) {
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

export default CustomLinks;
