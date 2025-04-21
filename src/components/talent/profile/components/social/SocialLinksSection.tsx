
import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { Link } from 'lucide-react';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import WebacySecurity from '../security/WebacySecurity';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(socials || {});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only attempt to fetch additional social links if we have an ENS identity
    if (identity && (identity.includes('.eth') || identity.includes('.box'))) {
      setIsLoading(true);
      
      getEnsLinks(identity)
        .then(links => {
          if (links && links.socials) {
            console.log(`Got additional social links for ${identity}:`, links.socials);
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

  return (
    <div className="w-full mt-6">
      <h3 className="flex items-center gap-2 text-xl font-medium mb-4">
        <Link className="h-5 w-5" /> Links
      </h3>
      
      {/* Security Threat Level - New Component */}
      <div className="mb-4">
        <WebacySecurity walletAddress={ownerAddress} />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SocialLinksSection;
