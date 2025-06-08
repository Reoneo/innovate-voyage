
import React, { useState, useEffect } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';
import { getCompleteENSData } from '@/services/ens/unifiedTextRecords';

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
      if (!identity || !identity.includes('.')) {
        setAllSocials(socials);
        return;
      }

      console.log('Fetching social links via unified ENS for identity:', identity);
      setLoading(true);
      
      let combinedSocials: Record<string, string> = { ...socials };

      try {
        // Use unified ENS data fetcher
        const ensData = await getCompleteENSData(identity);
        
        console.log('ENS data for social links:', ensData);
        
        // Merge ENS socials with existing socials
        Object.entries(ensData.socials).forEach(([platform, value]) => {
          if (value && value.trim()) {
            combinedSocials[platform] = value;
          }
        });

        // Add Farcaster handle if available
        if (ensData.farcasterHandle) {
          combinedSocials['farcaster'] = ensData.farcasterHandle;
        }

        console.log('Final combined socials:', combinedSocials);
        setAllSocials(combinedSocials);

      } catch (error) {
        console.error('Error fetching social links via ENS:', error);
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
          href = link.startsWith('https://') ? link : `https://warpcast.com/${link}`;
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
