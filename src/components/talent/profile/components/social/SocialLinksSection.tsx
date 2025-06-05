
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
        console.log(`Fetching comprehensive social links for ${identity}`);
        
        // Fetch from multiple sources including all ENS text records
        const [web3BioProfile, ensLinks] = await Promise.all([
          fetchWeb3BioProfile(identity),
          getEnsLinks(identity)
        ]);

        const combinedSocials: Record<string, string> = { ...socials };

        // Add web3.bio data
        if (web3BioProfile) {
          const web3BioFields = [
            'github', 'twitter', 'linkedin', 'website', 'facebook', 'instagram', 
            'youtube', 'telegram', 'discord', 'email', 'whatsapp', 'bluesky'
          ];
          
          web3BioFields.forEach(field => {
            if (web3BioProfile[field]) {
              combinedSocials[field] = web3BioProfile[field];
            }
          });

          // Handle links object
          if (web3BioProfile.links) {
            Object.entries(web3BioProfile.links).forEach(([key, value]: [string, any]) => {
              if (value && value.link) {
                combinedSocials[key] = value.link;
              }
            });
          }
        }

        // Add ALL ENS links data
        if (ensLinks && ensLinks.socials) {
          Object.entries(ensLinks.socials).forEach(([key, value]) => {
            if (value && !combinedSocials[key]) {
              combinedSocials[key] = value;
            }
          });
        }

        console.log(`Comprehensive social links for ${identity}:`, combinedSocials);
        setAllSocials(combinedSocials);
        
        // Refresh once more after 2 seconds to ensure we get all data
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
            console.log(`Refreshed social links for ${identity}:`, refreshedSocials);
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
    { key: 'email', type: 'mail' },
    { key: 'bluesky', type: 'website' },
    { key: 'farcaster', type: 'website' },
    { key: 'location', type: 'website' },
    { key: 'portfolio', type: 'website' },
    { key: 'resume', type: 'website' }
  ];

  const hasLinks = Object.values(allSocials).some(link => link && link.trim() !== '');

  if (!hasLinks && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {socialPlatforms.map((platform) => {
        const link = allSocials[platform.key];
        if (!link || link.trim() === '') return null;

        let href = link;
        if (platform.key === 'email') {
          href = link.startsWith('mailto:') ? link : `mailto:${link}`;
        } else if (platform.key === 'whatsapp') {
          href = link.startsWith('https://') ? link : `https://wa.me/${link}`;
        } else if (platform.key === 'telegram') {
          href = link.startsWith('https://') ? link : `https://t.me/${link}`;
        } else if (platform.key === 'discord') {
          href = link.includes('discord.com') ? link : `https://discord.com/users/${link}`;
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
            title={`Visit ${platform.key}: ${link}`}
          >
            <SocialIcon type={platform.type as any} size={54} />
          </a>
        );
      })}
      
      {isLoading && (
        <div className="text-xs text-muted-foreground">
          Loading all social links...
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;
