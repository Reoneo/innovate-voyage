
import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { Link } from 'lucide-react';
import { getEnsLinks } from '@/utils/ens/ensLinks';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
  showHeader?: boolean;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ 
  socials, 
  identity, 
  showHeader = true 
}) => {
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

  return (
    <div className="w-full mt-6">
      {showHeader && (
        <h3 className="flex items-center justify-center gap-2 text-xl font-medium mb-4 text-center">
          <Link className="h-5 w-5" /> Links
        </h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SocialLinksSection;
