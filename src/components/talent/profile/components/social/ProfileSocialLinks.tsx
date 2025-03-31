
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';

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
          const profile = await fetchWeb3BioProfile(passportId);
          
          if (profile) {
            console.log("Received profile:", profile);
            const newSocials: Record<string, string> = {};
            
            if (profile.github) newSocials.github = profile.github;
            if (profile.twitter) newSocials.twitter = profile.twitter;
            if (profile.linkedin) newSocials.linkedin = profile.linkedin;
            if (profile.website) newSocials.website = profile.website;
            if (profile.facebook) newSocials.facebook = profile.facebook;
            if (profile.instagram) newSocials.instagram = profile.instagram;
            if (profile.youtube) newSocials.youtube = profile.youtube;
            if (profile.telegram) newSocials.telegram = profile.telegram;
            if (profile.bluesky) newSocials.bluesky = profile.bluesky;
            if (profile.email) newSocials.email = profile.email;
            
            if (profile.links) {
              if (profile.links.website?.link) newSocials.website = profile.links.website.link;
              if (profile.links.github?.link) newSocials.github = profile.links.github.link;
              if (profile.links.twitter?.link) newSocials.twitter = profile.links.twitter.link;
              if (profile.links.linkedin?.link) newSocials.linkedin = profile.links.linkedin.link;
              if (profile.links.facebook?.link) newSocials.facebook = profile.links.facebook.link;
              
              const anyLinks = profile.links as any;
              if (anyLinks.instagram?.link) newSocials.instagram = anyLinks.instagram.link;
              if (anyLinks.youtube?.link) newSocials.youtube = anyLinks.youtube.link;
              if (anyLinks.telegram?.link) newSocials.telegram = anyLinks.telegram.link;
              if (anyLinks.bluesky?.link) newSocials.bluesky = anyLinks.bluesky.link;
            }
            
            console.log("Mapped social links:", newSocials);
            
            if (Object.keys(newSocials).length > 0) {
              setSocialLinks(prevLinks => ({
                ...prevLinks,
                ...newSocials
              }));
            }
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
    <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-border pt-2">
      {socialPlatforms.map((platform) => 
        socialLinks[platform.key] && (
          <a 
            key={platform.key}
            href={socialLinks[platform.key]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity bg-secondary/30 p-1.5 rounded-full"
            aria-label={`Visit ${platform.key}`}
          >
            <SocialIcon 
              type={platform.type as any} 
              size={20}
            />
          </a>
        )
      )}
      {socialLinks?.email && (
        <a 
          href={`mailto:${socialLinks.email}`}
          className="hover:opacity-80 transition-opacity bg-secondary/30 p-1.5 rounded-full"
          aria-label="Send email"
        >
          <SocialIcon type="mail" size={20} />
        </a>
      )}
      
      {Object.keys(socialLinks).length === 0 && !loading && (
        <span className="text-sm text-muted-foreground">No social links available</span>
      )}
      
      {loading && (
        <span className="text-sm text-muted-foreground">Loading social links...</span>
      )}
    </div>
  );
};

export default ProfileSocialLinks;
