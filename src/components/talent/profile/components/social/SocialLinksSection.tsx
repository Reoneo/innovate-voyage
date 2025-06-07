
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { getENSProfile } from '@/services/ens';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';

interface SocialLinksSectionProps {
  socials?: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ 
  socials = {}, 
  identity 
}) => {
  const [allSocials, setAllSocials] = useState<Record<string, string>>(socials);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!identity) {
        setAllSocials(socials);
        return;
      }

      setLoading(true);
      let combinedSocials: Record<string, string> = { ...socials };

      try {
        // Fetch all data sources simultaneously
        const promises = [];
        
        if (identity.endsWith('.eth') || identity.endsWith('.box')) {
          promises.push(getENSProfile(identity));
        }
        
        promises.push(fetchWeb3BioProfile(identity));

        const results = await Promise.allSettled(promises);

        // Process ENS data
        if (results[0]?.status === 'fulfilled' && results[0].value) {
          const profile = results[0].value;
          if (profile.socials) {
            Object.entries(profile.socials).forEach(([key, value]) => {
              if (value && typeof value === 'string' && value.trim()) {
                combinedSocials[key] = value;
              }
            });
          }
        }

        // Process Web3Bio data
        const web3BioIndex = promises.length > 1 ? 1 : 0;
        if (results[web3BioIndex]?.status === 'fulfilled' && results[web3BioIndex].value) {
          const profile = results[web3BioIndex].value;
          if (profile && typeof profile === 'object') {
            const profileData = Array.isArray(profile) ? profile[0] : profile;
            
            if (profileData && typeof profileData === 'object') {
              const web3BioFields = [
                'github', 'twitter', 'linkedin', 'discord', 'telegram', 'instagram', 
                'youtube', 'facebook', 'whatsapp', 'bluesky', 'farcaster', 'reddit'
              ];
              
              web3BioFields.forEach(field => {
                const fieldValue = (profileData as any)[field];
                if (fieldValue && typeof fieldValue === 'string') {
                  combinedSocials[field] = fieldValue;
                }
              });

              const links = (profileData as any).links;
              if (links && typeof links === 'object') {
                Object.entries(links).forEach(([key, value]: [string, any]) => {
                  if (value && typeof value === 'object' && value.link && typeof value.link === 'string') {
                    combinedSocials[key] = value.link;
                  }
                });
              }
            }
          }
        }

        setAllSocials(combinedSocials);

      } catch (error) {
        console.error('Error fetching social links:', error);
        setAllSocials(combinedSocials);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, [identity, JSON.stringify(socials)]);

  // Filter out contact info from social links
  const socialPlatforms = [
    { key: 'github', type: 'github' as const },
    { key: 'linkedin', type: 'linkedin' as const },
    { key: 'twitter', type: 'twitter' as const },
    { key: 'farcaster', type: 'farcaster' as const },
    { key: 'discord', type: 'discord' as const },
    { key: 'telegram', type: 'telegram' as const },
    { key: 'instagram', type: 'instagram' as const },
    { key: 'youtube', type: 'youtube' as const },
    { key: 'facebook', type: 'facebook' as const },
    { key: 'whatsapp', type: 'whatsapp' as const },
    { key: 'bluesky', type: 'website' as const },
    { key: 'reddit', type: 'website' as const }
  ].filter(platform => {
    const link = allSocials[platform.key];
    return link && link.trim() !== '';
  });

  if (socialPlatforms.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {socialPlatforms.map((platform) => {
        const link = allSocials[platform.key];
        if (!link || link.trim() === '') return null;

        let href = link;
        if (platform.key === 'whatsapp') {
          href = link.startsWith('https://') ? link : `https://wa.me/${link}`;
        } else if (platform.key === 'telegram') {
          href = link.startsWith('https://') ? link : `https://t.me/${link}`;
        } else if (platform.key === 'discord') {
          href = link.includes('discord.com') ? link : `https://discord.com/users/${link}`;
        } else if (platform.key === 'farcaster') {
          href = link.startsWith('https://') ? link : `https://farcaster.xyz/${link}`;
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
            <SocialIcon type={platform.type} size={60} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinksSection;
