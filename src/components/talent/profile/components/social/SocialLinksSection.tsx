
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { getENSProfile } from '@/services/ens';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';

interface SocialLinksSectionProps {
  socials?: Record<string, string>;
  identity?: string;
}

type SocialPlatformType = 'github' | 'linkedin' | 'twitter' | 'farcaster' | 'discord' | 'telegram' | 'instagram' | 'youtube' | 'facebook' | 'whatsapp' | 'website';

interface SocialPlatform {
  key: string;
  type: SocialPlatformType;
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
        return;
      }

      console.log('Fetching social links for identity:', identity);
      setLoading(true);
      
      let combinedSocials: Record<string, string> = { ...socials };

      try {
        // Always fetch from both sources in parallel for reliability
        const promises: Array<Promise<unknown>> = [];
        
        if (identity.endsWith('.eth') || identity.endsWith('.box')) {
          promises.push(
            getENSProfile(identity).catch(err => {
              console.warn('ENS profile fetch failed:', err);
              return null;
            })
          );
        }
        
        promises.push(
          fetchWeb3BioProfile(identity).catch(err => {
            console.warn('Web3Bio profile fetch failed:', err);
            return null;
          })
        );

        const results = await Promise.allSettled(promises);
        console.log('Social links fetch results:', results);

        let resultIndex = 0;
        
        // Process ENS results if applicable
        if (identity.endsWith('.eth') || identity.endsWith('.box')) {
          const ensResult = results[resultIndex];
          if (ensResult.status === 'fulfilled' && ensResult.value) {
            const ensProfile = ensResult.value as Record<string, unknown>;
            if (ensProfile?.socials && typeof ensProfile.socials === 'object') {
              Object.entries(ensProfile.socials as Record<string, unknown>).forEach(([key, value]) => {
                if (value && typeof value === 'string' && value.trim()) {
                  combinedSocials[key.toLowerCase()] = value;
                }
              });
            }
          }
          resultIndex++;
        }

        // Process Web3Bio results
        const web3BioResult = results[resultIndex];
        if (web3BioResult.status === 'fulfilled' && web3BioResult.value) {
          const web3BioProfile = web3BioResult.value as Record<string, unknown>;
          const profileData = Array.isArray(web3BioProfile) ? web3BioProfile[0] : web3BioProfile;
          
          if (profileData && typeof profileData === 'object') {
            const socialFields = [
              'github', 'twitter', 'linkedin', 'discord', 'telegram', 'instagram', 
              'youtube', 'facebook', 'whatsapp', 'bluesky', 'farcaster', 'reddit'
            ];
            
            socialFields.forEach(field => {
              const fieldValue = (profileData as Record<string, unknown>)[field];
              if (fieldValue && typeof fieldValue === 'string') {
                combinedSocials[field] = fieldValue;
              }
            });

            // Process links object
            const links = (profileData as Record<string, unknown>).links;
            if (links && typeof links === 'object') {
              Object.entries(links as Record<string, unknown>).forEach(([key, value]) => {
                if (value && typeof value === 'object') {
                  const linkValue = (value as Record<string, unknown>).link;
                  if (linkValue && typeof linkValue === 'string') {
                    combinedSocials[key.toLowerCase()] = linkValue;
                  }
                }
              });
            }
          }
        }

        console.log('Final combined socials:', combinedSocials);
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
    { key: 'github', type: 'github' as SocialPlatformType },
    { key: 'linkedin', type: 'linkedin' as SocialPlatformType },
    { key: 'twitter', type: 'twitter' as SocialPlatformType },
    { key: 'farcaster', type: 'farcaster' as SocialPlatformType },
    { key: 'discord', type: 'discord' as SocialPlatformType },
    { key: 'telegram', type: 'telegram' as SocialPlatformType },
    { key: 'instagram', type: 'instagram' as SocialPlatformType },
    { key: 'youtube', type: 'youtube' as SocialPlatformType },
    { key: 'facebook', type: 'facebook' as SocialPlatformType },
    { key: 'whatsapp', type: 'whatsapp' as SocialPlatformType },
    { key: 'bluesky', type: 'website' as SocialPlatformType },
    { key: 'reddit', type: 'website' as SocialPlatformType }
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
