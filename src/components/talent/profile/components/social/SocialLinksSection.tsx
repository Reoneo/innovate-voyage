
import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { Link, Shield } from 'lucide-react';
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

  // Extract owner address from socials or use the identity directly if it's an address
  const ownerAddress = socials?.ethereum || socials?.walletAddress || 
                      (identity && !identity.includes('.') ? identity : undefined);

  return (
    <div className="w-full mt-6 pb-4">
      {/* Links Section */}
      <h3 className="flex items-center justify-center md:justify-start gap-2 text-xl font-medium mb-4">
        <Link className="h-5 w-5" /> Links
      </h3>
      
      {/* Social links grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />
      </div>
      
      {/* Security Section - as separate section */}
      {ownerAddress && (
        <div className="mt-8">
          <h3 className="flex items-center justify-center md:justify-start gap-2 text-xl font-medium mb-4">
            <Shield className="h-5 w-5" /> Security
          </h3>
          <WebacySecurity walletAddress={ownerAddress} />
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;
