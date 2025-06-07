
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
      if (!identity) return;

      setLoading(true);
      let combinedSocials: Record<string, string> = { ...socials };

      try {
        // Fetch all data in parallel for faster loading
        const [ensProfileResult, web3BioResult] = await Promise.allSettled([
          (identity.endsWith('.eth') || identity.endsWith('.box')) ? getENSProfile(identity) : Promise.resolve(null),
          fetchWeb3BioProfile(identity)
        ]);

        // Process complete ENS profile data
        if (ensProfileResult.status === 'fulfilled' && ensProfileResult.value) {
          const profile = ensProfileResult.value;
          console.log(`ENS profile loaded:`, profile);
          
          Object.entries(profile.socials || {}).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.trim() && !combinedSocials[key]) {
              combinedSocials[key] = value;
            }
          });
        }

        // Process Web3Bio profile data
        if (web3BioResult.status === 'fulfilled' && web3BioResult.value) {
          const profile = web3BioResult.value;
          console.log(`Web3Bio profile loaded:`, profile);
          
          if (profile && typeof profile === 'object') {
            const profileData = Array.isArray(profile) ? profile[0] : profile;
            
            if (profileData && typeof profileData === 'object') {
              const web3BioFields = [
                'github', 'twitter', 'linkedin', 'discord', 'telegram', 'instagram', 
                'youtube', 'facebook', 'whatsapp', 'bluesky', 'farcaster', 'reddit'
              ];
              
              web3BioFields.forEach(field => {
                if (profileData[field] && typeof profileData[field] === 'string' && !combinedSocials[field]) {
                  combinedSocials[field] = profileData[field];
                }
              });

              // Handle links object
              if (profileData.links && typeof profileData.links === 'object') {
                Object.entries(profileData.links).forEach(([key, value]: [string, any]) => {
                  if (value && typeof value === 'object' && value.link && typeof value.link === 'string' && !combinedSocials[key]) {
                    combinedSocials[key] = value.link;
                  }
                });
              }
            }
          }
        }

        console.log(`Final combined socials:`, combinedSocials);
        setAllSocials(combinedSocials);

      } catch (error) {
        console.error('Error fetching social links:', error);
        setAllSocials(combinedSocials);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, [identity, socials]);

  // Filter out contact info (telephone, email, location, website) from social links
  const socialPlatforms = [
    { key: 'github', type: 'github', priority: true },
    { key: 'linkedin', type: 'linkedin', priority: true },
    { key: 'twitter', type: 'twitter', priority: false },
    { key: 'farcaster', type: 'farcaster', priority: false },
    { key: 'discord', type: 'discord', priority: false },
    { key: 'telegram', type: 'telegram', priority: false },
    { key: 'instagram', type: 'instagram', priority: false },
    { key: 'youtube', type: 'youtube', priority: false },
    { key: 'facebook', type: 'facebook', priority: false },
    { key: 'whatsapp', type: 'whatsapp', priority: false },
    { key: 'bluesky', type: 'website', priority: false },
    { key: 'reddit', type: 'website', priority: false }
  ].filter(platform => {
    const link = allSocials[platform.key];
    return link && link.trim() !== '';
  });

  if (socialPlatforms.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {loading && socialPlatforms.length === 0 && (
        <div className="text-sm text-muted-foreground">Loading social links...</div>
      )}
      
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
            <SocialIcon type={platform.type as any} size={60} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinksSection;
