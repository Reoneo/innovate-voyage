
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

  useEffect(() => {
    const fetchAllSocialLinks = async () => {
      if (!identity) return;

      const combinedSocials: Record<string, string> = { ...socials };

      try {
        // Fetch both sources in parallel with fast timeouts
        const [web3BioResult, ensLinksResult] = await Promise.allSettled([
          Promise.race([
            fetchWeb3BioProfile(identity),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 800))
          ]),
          Promise.race([
            getEnsLinks(identity),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 800))
          ])
        ]);

        // Process web3.bio data with proper type checking
        if (web3BioResult.status === 'fulfilled' && web3BioResult.value && typeof web3BioResult.value === 'object') {
          const profile = web3BioResult.value as any;
          const web3BioFields = [
            'github', 'twitter', 'linkedin', 'website', 'facebook', 'instagram', 
            'youtube', 'telegram', 'discord', 'email', 'whatsapp', 'bluesky'
          ];
          
          web3BioFields.forEach(field => {
            if (profile[field] && typeof profile[field] === 'string' && !combinedSocials[field]) {
              combinedSocials[field] = profile[field];
            }
          });

          if (profile.links && typeof profile.links === 'object') {
            Object.entries(profile.links).forEach(([key, value]: [string, any]) => {
              if (value && typeof value === 'object' && value.link && typeof value.link === 'string' && !combinedSocials[key]) {
                combinedSocials[key] = value.link;
              }
            });
          }
        }

        // Process ENS links data with proper type checking
        if (ensLinksResult.status === 'fulfilled' && ensLinksResult.value && typeof ensLinksResult.value === 'object') {
          const ensData = ensLinksResult.value as any;
          if (ensData.socials && typeof ensData.socials === 'object') {
            Object.entries(ensData.socials).forEach(([key, value]) => {
              if (value && typeof value === 'string' && !combinedSocials[key]) {
                combinedSocials[key] = value;
              }
            });
          }
        }

        setAllSocials(combinedSocials);

      } catch (error) {
        // Silently fail and use existing socials
        setAllSocials(combinedSocials);
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

  if (!hasLinks) {
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
