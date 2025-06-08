
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';

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
        // Fetch from Web3Bio for additional social links
        const web3BioResponse = await fetch(`https://api.web3.bio/profile/${identity}`).catch(() => null);
        
        if (web3BioResponse?.ok) {
          const web3BioProfile = await web3BioResponse.json();
          const profileData = Array.isArray(web3BioProfile) ? web3BioProfile[0] : web3BioProfile;
          
          if (profileData && typeof profileData === 'object') {
            const socialFields = [
              'github', 'twitter', 'linkedin', 'discord', 'telegram', 'instagram', 
              'youtube', 'facebook', 'whatsapp', 'farcaster'
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
    { key: 'github', type: 'github' },
    { key: 'linkedin', type: 'linkedin' },
    { key: 'twitter', type: 'twitter' },
    { key: 'farcaster', type: 'farcaster' },
    { key: 'discord', type: 'discord' },
    { key: 'telegram', type: 'telegram' },
    { key: 'instagram', type: 'instagram' },
    { key: 'youtube', type: 'youtube' },
    { key: 'facebook', type: 'facebook' },
    { key: 'whatsapp', type: 'whatsapp' }
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
