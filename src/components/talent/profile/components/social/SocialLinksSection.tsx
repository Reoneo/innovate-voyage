
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { getENSProfile } from '@/services/ensService';
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
    const fetchAllSocialLinks = async () => {
      if (!identity) return;

      setLoading(true);
      const combinedSocials: Record<string, string> = { ...socials };

      try {
        // Fetch from multiple sources in parallel
        const [ensProfile, web3BioProfile] = await Promise.allSettled([
          getENSProfile(identity),
          fetchWeb3BioProfile(identity)
        ]);

        // Process ENS profile data
        if (ensProfile.status === 'fulfilled' && ensProfile.value) {
          const profile = ensProfile.value;
          
          // Merge ENS socials
          Object.entries(profile.socials).forEach(([key, value]) => {
            if (value && typeof value === 'string' && !combinedSocials[key]) {
              combinedSocials[key] = value;
            }
          });

          // Add additional fields from text records
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
          
          // Handle different response formats
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

        setAllSocials(combinedSocials);

      } catch (error) {
        console.error('Error fetching social links:', error);
        setAllSocials(combinedSocials);
      } finally {
        setLoading(false);
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
    { key: 'reddit', type: 'website' },
    { key: 'location', type: 'website' },
    { key: 'portfolio', type: 'website' },
    { key: 'resume', type: 'website' }
  ];

  const hasLinks = Object.values(allSocials).some(link => link && link.trim() !== '');

  if (!hasLinks && !loading) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {loading && (
        <div className="text-sm text-muted-foreground">Loading social links...</div>
      )}
      
      {!loading && socialPlatforms.map((platform) => {
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
            <SocialIcon type={platform.type as any} size={60} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinksSection;
