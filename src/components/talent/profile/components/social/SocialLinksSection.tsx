
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
    const fetchPrioritySocialLinks = async () => {
      if (!identity) return;

      setLoading(true);
      let combinedSocials: Record<string, string> = { ...socials };

      try {
        // First: Fetch priority ENS records (GitHub, LinkedIn, Twitter) super fast
        if (identity.endsWith('.eth') || identity.endsWith('.box')) {
          const priorityProfile = await getPriorityENSRecords(identity);
          
          if (priorityProfile.socials) {
            Object.entries(priorityProfile.socials).forEach(([key, value]) => {
              if (value && typeof value === 'string' && !combinedSocials[key]) {
                combinedSocials[key] = value;
              }
            });
            
            // Update state immediately with priority socials
            setAllSocials(combinedSocials);
            setPriorityLoaded(true);
          }
        }

        // Second: Fetch remaining data in background
        const [ensProfile, web3BioProfile] = await Promise.allSettled([
          getENSProfile(identity),
          fetchWeb3BioProfile(identity)
        ]);

        // Process complete ENS profile data
        if (ensProfile.status === 'fulfilled' && ensProfile.value) {
          const profile = ensProfile.value;
          
          Object.entries(profile.socials).forEach(([key, value]) => {
            if (value && typeof value === 'string' && !combinedSocials[key]) {
              combinedSocials[key] = value;
            }
          });

          if (profile.avatar && !combinedSocials.avatar) {
            combinedSocials.avatar = profile.avatar;
          }
          if (profile.description && !combinedSocials.description) {
            combinedSocials.description = profile.description;
          }
        }

        // Process Web3Bio profile data
        if (web3BioProfile.status === 'fulfilled' && web3BioProfile.value) {
          const profile = web3BioProfile.value;
          
          if (profile && typeof profile === 'object') {
            const profileData = Array.isArray(profile) ? profile[0] : profile;
            
            if (profileData && typeof profileData === 'object') {
              const web3BioFields = [
                'github', 'twitter', 'linkedin', 'website', 'facebook', 'instagram', 
                'youtube', 'telegram', 'discord', 'email', 'whatsapp', 'bluesky', 
                'farcaster', 'reddit', 'location'
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

        setAllSocials(combinedSocials);

      } catch (error) {
        console.error('Error fetching social links:', error);
        setAllSocials(combinedSocials);
      } finally {
        setLoading(false);
      }
    };

    fetchPrioritySocialLinks();
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
