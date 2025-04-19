
import React from 'react';
import PlatformLinks from './PlatformLinks';
import CustomLinks from './CustomLinks';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  // Log the received social links
  console.log('SocialLinksSection - Received socials:', socials);

  // Check if we have any actual social links
  const hasSocialLinks = socials && Object.values(socials).some(value => 
    value && typeof value === 'string' && value.trim() !== '');
  
  if (!hasSocialLinks) {
    return (
      <div className="w-full mt-4 pt-3 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-500 mb-3 px-4">Social Links</h4>
        <p className="text-sm text-gray-400 px-4">No social links available</p>
      </div>
    );
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
        <PlatformLinks normalizedSocials={socials} />
        <CustomLinks 
          normalizedSocials={socials} 
          standardPlatforms={standardPlatforms} 
        />
      </div>
    </div>
  );
};

export default SocialLinksSection;
