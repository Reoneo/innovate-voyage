
import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { getEnsLinks } from '@/utils/ens/ensLinks';

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
  
  // Check if there are any social links
  const hasSocialLinks = Object.entries(socialLinks || {}).some(([key, val]) => val && val.trim() !== '');
  
  if (!hasSocialLinks) {
    return null; // Hide the entire section if no links available
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SocialLinksSection;
