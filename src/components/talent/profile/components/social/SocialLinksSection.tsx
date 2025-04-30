
import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import WebacySecurity from '../security/WebacySecurity';

// Centered, larger header styles for the links section
const linkHeaderClasses =
  "flex items-center justify-center text-xl font-semibold mb-4 text-gradient-primary tracking-wide";

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(socials || {});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (identity && (identity.includes('.eth') || identity.includes('.box'))) {
      setIsLoading(true);
      getEnsLinks(identity)
        .then(links => {
          if (links && links.socials) {
            setSocialLinks(prevLinks => ({
              ...prevLinks,
              ...links.socials
            }));
          }
        })
        .catch(error => {
          console.error(`Error fetching social links for ${identity}:`, error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [identity]);

  // Extract owner address from socials or use undefined
  const ownerAddress = socials?.ethereum || socials?.walletAddress;
  
  // Check if there are any social links
  const hasSocialLinks = Object.entries(socialLinks || {}).some(([key, val]) => val && val.trim() !== '');
  
  if (!hasSocialLinks) {
    return null; // Hide the entire section if no links available
  }

  return (
    <div>
      <h3 className={linkHeaderClasses}>
        Links
      </h3>
      <div className="mb-4">
        <WebacySecurity walletAddress={ownerAddress} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SocialLinksSection;
