
import React from 'react';
import PlatformLinks from './PlatformLinks';
import CustomLinks from './CustomLinks';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  displayIdentity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, displayIdentity }) => {
  // Filter out empty values and create a normalized social object
  const normalizedSocials: Record<string, string> = {};
  Object.entries(socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  // Check if we have any actual social links
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

  // Style: links/text/buttons should use #8E9196 (Neutral Gray from palette)
  return (
    <div className="w-full max-w-full px-3">
      <h4 className="text-sm font-medium mb-2" style={{ color: '#8E9196' }}>
        Social Links
      </h4>
      <div className="grid grid-cols-4 gap-3 justify-items-center">
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
