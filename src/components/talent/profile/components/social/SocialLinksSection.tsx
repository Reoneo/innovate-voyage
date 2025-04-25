import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import WebacySecurity from '../security/WebacySecurity';
import { fetchPoapsByAddress } from '@/api/services/poapService';
import PoapCarousel from '../poap/PoapCarousel';

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
  const [poaps, setPoaps] = useState([]);

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

  useEffect(() => {
    const ownerAddress = socials?.ethereum || socials?.walletAddress;
    if (ownerAddress) {
      fetchPoapsByAddress(ownerAddress)
        .then(poapData => {
          setPoaps(poapData);
        })
        .catch(error => {
          console.error('Error fetching POAPs:', error);
        });
    }
  }, [socials]);

  // Extract owner address from socials or use undefined
  const ownerAddress = socials?.ethereum || socials?.walletAddress;

  return (
    <div className="w-full mt-6">
      <h3 className={linkHeaderClasses}>
        Links
      </h3>
      <div className="mb-4">
        <WebacySecurity walletAddress={ownerAddress} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />
      </div>
      
      {/* POAPs Section */}
      {poaps.length > 0 && (
        <div className="mt-6">
          <h3 className={linkHeaderClasses}>POAPs</h3>
          <div className="relative rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-4">
            <PoapCarousel poaps={poaps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;
