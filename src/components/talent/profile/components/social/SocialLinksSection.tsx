
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { getEnsLinks } from '@/utils/ens/ensLinks';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(socials || {});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleCopyDiscord = (discordHandle: string) => {
    navigator.clipboard.writeText(discordHandle);
    toast({
      title: "Copied to clipboard",
      description: `Discord handle '${discordHandle}' has been copied to clipboard.`
    });
  };

  return (
    <div className="w-full mt-6">
      <h3 className="text-xl font-medium mb-4">Social Links</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SocialMediaLinks 
          socials={socialLinks} 
          isLoading={isLoading} 
          onCopyDiscord={handleCopyDiscord}
        />
      </div>
    </div>
  );
};

export default SocialLinksSection;
