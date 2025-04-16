
import React from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  // Check if we have any actual social links
  const hasSocialLinks = Object.entries(socials || {}).some(([_, val]) => val && val.trim() !== '');
  
  // Don't render anything if no links are available
  if (!hasSocialLinks) {
    return null;
  }
  
  return (
    <div className="w-full mt-2">
      <div className="grid grid-cols-3 gap-2 justify-items-center">
        <SocialMediaLinks socials={socials} />
      </div>
    </div>
  );
};

export default SocialLinksSection;
