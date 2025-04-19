
import React from 'react';
import PlatformLinks from './PlatformLinks';
import CustomLinks from './CustomLinks';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  // Filter out empty values and create a normalized social object
  const normalizedSocials: Record<string, string> = {};
  
  // Log the received social links
  console.log('SocialLinksSection - Received socials:', socials);

  if (socials) {
    Object.entries(socials).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        normalizedSocials[key.toLowerCase()] = value;
      }
    });
  }
  
  // Check if we have any actual social links after normalization
  const hasSocialLinks = Object.keys(normalizedSocials).length > 0;
  
  // For debugging
  console.log('Rendering social links:', normalizedSocials);
  
  if (!hasSocialLinks) {
    return null;
  }

  const standardPlatforms = [
    'github', 'twitter', 'linkedin', 'facebook', 'instagram', 
    'youtube', 'telegram', 'bluesky', 'discord', 'website', 
    'whatsapp', 'email', 'telephone', 'location'
  ];
  
  return (
    <div className="w-full mt-4 pt-3 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-500 mb-3 px-4">Social Links</h4>
      <div className="grid grid-cols-4 gap-3 px-4">
        <PlatformLinks normalizedSocials={normalizedSocials} />
        <CustomLinks 
          normalizedSocials={normalizedSocials} 
          standardPlatforms={standardPlatforms} 
        />
      </div>
    </div>
  );
};

export default SocialLinksSection;
