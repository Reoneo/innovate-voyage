
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { getENSProfile } from '@/services/ens';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';

interface SocialLinksSectionProps {
  socials?: Record<string, string>;
  identity?: string;
}

interface SocialPlatform {
  key: string;
  type: 'github' | 'linkedin' | 'twitter' | 'farcaster' | 'discord' | 'telegram' | 'instagram' | 'youtube' | 'facebook' | 'whatsapp' | 'website';
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ 
  socials = {}, 
  identity 
}) => {
  const [allSocials, setAllSocials] = useState<Record<string, string>>(socials);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllSocialLinks = async () => {
      if (!identity) {
        setAllSocials(socials);
        setLoading(false);
        return;
      }

      console.log('Fetching social links for identity:', identity);
      setLoading(true);
      
      let combinedSocials: Record<string, string> = { ...socials };

      try {
        const promises: Promise<any>[] = [];
        
        if (identity.endsWith('.eth') || identity.endsWith('.box')) {
          promises.push(getENSProfile(identity));
        }
        
        promises.push(fetchWeb3BioProfile(identity));

        const results = await Promise.allSettled(promises);

        let ensIndex = 0;
        if (identity.endsWith('.eth') || identity.endsWith('.box')) {
          if (results[ensIndex]?.status === 'fulfilled') {
            const ensProfile = (results[ensIndex] as PromiseFulfilledResult<any>).value;
            if (ensProfile?.socials) {
              Object.entries(ensProfile.socials).forEach(([key, value]) => {
                if (value && typeof value === 'string' && value.trim()) {
                  combinedSocials[key.toLowerCase()] = value;
                }
              });
            }
          }
          ensIndex++;
        }

        if (results[ensIndex]?.status === 'fulfilled') {
          const web3BioProfile = (results[ensIndex] as PromiseFulfilledResult<any>).value;
          if (web3BioProfile) {
            const profileData = Array.isArray(web3BioProfile) ? web3BioProfile[0] : web3BioProfile;
            
            if (profileData && typeof profileData === 'object') {
              const socialFields = [
                'github', 'twitter', 'linkedin', 'discord', 'telegram', 'instagram', 
                'youtube', 'facebook', 'whatsapp', 'bluesky', 'farcaster', 'reddit'
              ];
              
              socialFields.forEach(field => {
                const fieldValue = profileData[field];
                if (fieldValue && typeof fieldValue === 'string') {
                  combinedSocials[field] = fieldValue;
                }
              });

              if (profileData.links && typeof profileData.links === 'object') {
                Object.entries(profileData.links).forEach(([key, value]: [string, any]) => {
                  if (value && typeof value === 'object' && value.link && typeof value.link === 'string') {
                    combinedSocials[key.toLowerCase()] = value.link;
                  }
                });
              }
            }
          }
        }

        console.log('Combined socials:', combinedSocials);
        setAllSocials(combinedSocials);

      } catch (error) {
        console.error('Error fetching social links:', error);
        setAllSocials(combinedSocials);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSocialLinks();
  }, [identity, JSON.stringify(socials)]);

  const socialPlatforms: SocialPlatform[] = [
    { key: 'github', type: 'github' },
    { key: 'linkedin', type: 'linkedin' },
    { key: 'twitter', type: 'twitter' },
    { key: 'farcaster', type: 'farcaster' },
    { key: 'discord', type: 'discord' },
    { key: 'telegram', type: 'telegram' },
    { key: 'instagram', type: 'instagram' },
    { key: 'youtube', type: 'youtube' },
    { key: 'facebook', type: 'facebook' },
    { key: 'whatsapp', type: 'whatsapp' },
    { key: 'bluesky', type: 'website' },
    { key: 'reddit', type: 'website' }
  ].filter(platform => {
    const link = allSocials[platform.key];
    return link && link.trim() !== '';
  });

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="text-xs text-muted-foreground">Loading social links...</div>
      </div>
    );
  }

  if (socialPlatforms.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="text-xs text-muted-foreground">No social links found</div>
      </div>
    );
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
