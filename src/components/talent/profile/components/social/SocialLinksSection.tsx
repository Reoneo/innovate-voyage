
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { getPriorityENSRecords, getENSProfile } from '@/services/ensService';
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
  const [priorityLoaded, setPriorityLoaded] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      if (!identity) return;

      setLoading(true);
      let combinedSocials: Record<string, string> = { ...socials };

      try {
        // Step 1: Fast priority fetch for immediate display (GitHub, LinkedIn, Twitter)
        if (identity.endsWith('.eth') || identity.endsWith('.box')) {
          console.log(`Fetching priority socials for ${identity}`);
          
          const priorityProfile = await getPriorityENSRecords(identity);
          
          if (priorityProfile.socials) {
            Object.entries(priorityProfile.socials).forEach(([key, value]) => {
              if (value && typeof value === 'string' && value.trim() && !combinedSocials[key]) {
                combinedSocials[key] = value;
              }
            });
            
            // Update state immediately with priority socials for fast loading
            setAllSocials(combinedSocials);
            setPriorityLoaded(true);
            console.log(`Priority socials loaded:`, priorityProfile.socials);
          }
        }

        // Step 2: Background fetch for complete data
        const [ensProfileResult, web3BioResult] = await Promise.allSettled([
          getENSProfile(identity),
          fetchWeb3BioProfile(identity)
        ]);

        // Process complete ENS profile data
        if (ensProfileResult.status === 'fulfilled' && ensProfileResult.value) {
          const profile = ensProfileResult.value;
          console.log(`Complete ENS profile loaded:`, profile);
          
          Object.entries(profile.socials || {}).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.trim() && !combinedSocials[key]) {
              combinedSocials[key] = value;
            }
          });

          // Add profile fields as socials
          if (profile.avatar && !combinedSocials.avatar) {
            combinedSocials.avatar = profile.avatar;
          }
          if (profile.description && !combinedSocials.description) {
            combinedSocials.description = profile.description;
          }
          if (profile.email && !combinedSocials.email) {
            combinedSocials.email = profile.email;
          }
          if (profile.website && !combinedSocials.website) {
            combinedSocials.website = profile.website;
          }
        }

        // Process Web3Bio profile data
        if (web3BioResult.status === 'fulfilled' && web3BioResult.value) {
          const profile = web3BioResult.value;
          console.log(`Web3Bio profile loaded:`, profile);
          
          if (profile && typeof profile === 'object') {
            const profileData = Array.isArray(profile) ? profile[0] : profile;
            
            if (profileData && typeof profileData === 'object') {
              const web3BioFields = [
                'github', 'twitter', 'linkedin', 'website', 'facebook', 'instagram', 
                'youtube', 'telegram', 'discord', 'email', 'whatsapp', 'bluesky', 
                'farcaster', 'reddit', 'location', 'portfolio', 'resume'
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

  const socialPlatforms = [
    { key: 'github', type: 'github', priority: true },
    { key: 'linkedin', type: 'linkedin', priority: true },
    { key: 'twitter', type: 'twitter', priority: true },
    { key: 'website', type: 'website', priority: false },
    { key: 'discord', type: 'discord', priority: false },
    { key: 'telegram', type: 'telegram', priority: false },
    { key: 'instagram', type: 'instagram', priority: false },
    { key: 'youtube', type: 'youtube', priority: false },
    { key: 'facebook', type: 'facebook', priority: false },
    { key: 'whatsapp', type: 'whatsapp', priority: false },
    { key: 'email', type: 'mail', priority: false },
    { key: 'bluesky', type: 'website', priority: false },
    { key: 'farcaster', type: 'website', priority: false },
    { key: 'reddit', type: 'website', priority: false },
    { key: 'location', type: 'website', priority: false },
    { key: 'portfolio', type: 'website', priority: false },
    { key: 'resume', type: 'website', priority: false }
  ];

  const hasLinks = Object.values(allSocials).some(link => link && link.trim() !== '');

  if (!hasLinks && !loading && !priorityLoaded) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {loading && !priorityLoaded && (
        <div className="text-sm text-muted-foreground">Loading social links...</div>
      )}
      
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
            className={`transition-opacity hover:opacity-80 ${platform.priority ? 'order-first' : ''}`}
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
