
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';
import { getEnsLinks } from '@/utils/ens/ensLinks';

interface SocialLinksSectionProps {
  socials?: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ 
  socials = {}, 
  identity 
}) => {
  const [allSocials, setAllSocials] = useState<Record<string, string>>(socials);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllSocialLinks = async () => {
      if (!identity) return;

      setIsLoading(true);
      
      try {
        // Fetch from multiple sources including all ENS text records
        const [web3BioProfile, ensLinks] = await Promise.all([
          fetchWeb3BioProfile(identity),
          getEnsLinks(identity)
        ]);

        const combinedSocials: Record<string, string> = { ...socials };

        // Add web3.bio data
        if (web3BioProfile) {
          if (web3BioProfile.github) combinedSocials.github = web3BioProfile.github;
          if (web3BioProfile.twitter) combinedSocials.twitter = web3BioProfile.twitter;
          if (web3BioProfile.linkedin) combinedSocials.linkedin = web3BioProfile.linkedin;
          if (web3BioProfile.website) combinedSocials.website = web3BioProfile.website;
          if (web3BioProfile.facebook) combinedSocials.facebook = web3BioProfile.facebook;
          if (web3BioProfile.instagram) combinedSocials.instagram = web3BioProfile.instagram;
          if (web3BioProfile.youtube) combinedSocials.youtube = web3BioProfile.youtube;
          if (web3BioProfile.telegram) combinedSocials.telegram = web3BioProfile.telegram;
          if (web3BioProfile.discord) combinedSocials.discord = web3BioProfile.discord;
          if (web3BioProfile.email) combinedSocials.email = web3BioProfile.email;
          if (web3BioProfile.whatsapp) combinedSocials.whatsapp = web3BioProfile.whatsapp;

          // Handle links object
          if (web3BioProfile.links) {
            Object.entries(web3BioProfile.links).forEach(([key, value]: [string, any]) => {
              if (value && value.link) {
                combinedSocials[key] = value.link;
              }
            });
          }
        }

        // Add ENS links data (this should now fetch ALL text records)
        if (ensLinks && ensLinks.socials) {
          Object.entries(ensLinks.socials).forEach(([key, value]) => {
            if (value && !combinedSocials[key]) {
              combinedSocials[key] = value;
            }
          });
        }

        setAllSocials(combinedSocials);
        
        // Refresh once more after 2 seconds to catch any delayed data
        setTimeout(async () => {
          try {
            const [refreshedProfile, refreshedEnsLinks] = await Promise.all([
              fetchWeb3BioProfile(identity),
              getEnsLinks(identity)
            ]);
            
            const refreshedSocials = { ...combinedSocials };
            
            if (refreshedProfile) {
              Object.entries(refreshedProfile).forEach(([key, value]) => {
                if (value && typeof value === 'string' && !refreshedSocials[key]) {
                  refreshedSocials[key] = value;
                }
              });
            }
            
            if (refreshedEnsLinks && refreshedEnsLinks.socials) {
              Object.entries(refreshedEnsLinks.socials).forEach(([key, value]) => {
                if (value && !refreshedSocials[key]) {
                  refreshedSocials[key] = value;
                }
              });
            }
            
            setAllSocials(refreshedSocials);
          } catch (error) {
            console.error('Error during refresh:', error);
          }
        }, 2000);

      } catch (error) {
        console.error('Error fetching social links:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSocialLinks();
  }, [identity, socials]);

  const socialPlatforms = [
    { key: 'twitter', type: 'twitter' },
    { key: 'github', type: 'github' },
    { key: 'linkedin', type: 'linkedin' },
    { key: 'website', type: 'website' },
    { key: 'discord', type: 'discord' },
    { key: 'telegram', type: 'telegram' },
    { key: 'instagram', type: 'instagram' },
    { key: 'youtube', type: 'youtube' },
    { key: 'facebook', type: 'facebook' },
    { key: 'whatsapp', type: 'whatsapp' },
    { key: 'email', type: 'mail' }
  ];

  const hasLinks = Object.values(allSocials).some(link => link && link.trim() !== '');

  if (!hasLinks && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {socialPlatforms.map((platform) => {
        const link = allSocials[platform.key];
        if (!link || link.trim() === '') return null;

        let href = link;
        if (platform.key === 'email') {
          href = link.startsWith('mailto:') ? link : `mailto:${link}`;
        } else if (platform.key === 'whatsapp') {
          href = link.startsWith('https://') ? link : `https://wa.me/${link}`;
        } else if (!link.startsWith('http://') && !link.startsWith('https://')) {
          href = `https://${link}`;
        }

        return (
          <a
            key={platform.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
            title={`Visit ${platform.key}`}
          >
            <SocialIcon type={platform.type as any} size={36} />
          </a>
        );
      })}
      
      {isLoading && (
        <div className="text-xs text-muted-foreground">
          Loading social links...
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;
