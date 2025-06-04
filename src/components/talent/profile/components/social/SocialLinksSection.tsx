
import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import { Badge } from '@/components/ui/badge';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(socials || {});
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (identity && (identity.includes('.eth') || identity.includes('.box') || identity.includes('.lens'))) {
      setIsLoading(true);
      getEnsLinks(identity)
        .then(links => {
          console.log('ENS Links fetched:', links);
          if (links && links.socials) {
            // Merge existing socials with ENS socials, giving priority to ENS data
            setSocialLinks(prevLinks => ({
              ...prevLinks,
              ...Object.fromEntries(
                Object.entries(links.socials).filter(([_, value]) => value && value.trim() !== '')
              )
            }));
          }
          
          // Extract keywords from ENS records
          if (links && links.keywords) {
            setKeywords(Array.isArray(links.keywords) ? links.keywords : [links.keywords]);
          }
        })
        .catch(error => {
          console.error(`Error fetching social links for ${identity}:`, error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // If no valid identity, just use the provided socials
      setSocialLinks(socials || {});
    }
  }, [identity, socials]);

  // Check if there are any social links
  const hasSocialLinks = Object.entries(socialLinks || {}).some(([key, val]) => val && val.trim() !== '');
  
  if (!hasSocialLinks && keywords.length === 0) {
    return null; // Hide the entire section if no links or keywords available
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-4">
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />
      </div>
      
      {keywords.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;
