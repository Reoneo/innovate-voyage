
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';
import { getEnsSocialLinks } from '@/api/services/ens/ensApiClient';

interface ProfileSocialLinksProps {
  passportId: string;
  initialSocials: Record<string, string>;
}

const ProfileSocialLinks: React.FC<ProfileSocialLinksProps> = ({ 
  passportId, 
  initialSocials
}) => {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(initialSocials || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (passportId?.includes('.eth') || passportId?.includes('.box')) {
        setLoading(true);
        try {
          console.log("Fetching social links for", passportId);
          
          // Use ENS API to get social links
          const links = await getEnsSocialLinks(passportId);
          
          if (links && Object.keys(links).length > 0) {
            console.log("Received social links:", links);
            setSocialLinks(prevLinks => ({
              ...prevLinks,
              ...links
            }));
          }
        } catch (error) {
          console.error("Error fetching social links:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchSocialLinks();
  }, [passportId]);

  return (
    <div className="mt-2 grid grid-cols-4 gap-2 border-t border-border pt-2">
      {socialPlatforms.map((platform) => 
        socialLinks[platform.key] && (
          <a 
            key={platform.key}
            href={platform.key === 'whatsapp' ? `https://wa.me/${socialLinks[platform.key]}` : socialLinks[platform.key]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity flex items-center justify-center"
            aria-label={`Visit ${platform.key}`}
          >
            <SocialIcon 
              type={platform.type as any} 
              size={32}
            />
          </a>
        )
      )}
      {socialLinks?.email && (
        <a 
          href={`mailto:${socialLinks.email}`}
          className="hover:opacity-80 transition-opacity flex items-center justify-center"
          aria-label="Send email"
        >
          <SocialIcon type="mail" size={32} />
        </a>
      )}
      
      {Object.keys(socialLinks).length === 0 && !loading && (
        <span className="text-sm text-muted-foreground col-span-4">No social links available</span>
      )}
      
      {loading && (
        <span className="text-sm text-muted-foreground col-span-4">Loading social links...</span>
      )}
    </div>
  );
};

export default ProfileSocialLinks;
