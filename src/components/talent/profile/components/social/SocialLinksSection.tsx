
import React, { useState, useEffect } from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import { Badge } from '@/components/ui/badge';
import { mainnetProvider } from '@/utils/ethereumProviders';
import { SocialIcon } from '@/components/ui/social-icon';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
  identity?: string;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials, identity }) => {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(socials || {});
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [ensLoaded, setEnsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSocialLinks = async () => {
      if (identity && (identity.includes('.eth') || identity.includes('.box'))) {
        setIsLoading(true);
        try {
          // Fetch all social links from ENS text records including xyz.farcaster.ens
          const ensLinksResult = await getEnsLinks(identity);
          if (cancelled) return;

          // Merge socials: Essential to avoid duplicates and prefer on-chain/ENS when present
          let updated = { ...socials, ...(ensLinksResult.socials || {}) };

          // Also check for Farcaster handle in ENS, fallback to known record
          let farcaster = updated.farcaster;
          if (!farcaster) {
            try {
              const resolver = await mainnetProvider.getResolver(identity);
              if (resolver) {
                const fcHandle = await resolver.getText('xyz.farcaster.ens');
                if (fcHandle && typeof fcHandle === 'string' && fcHandle.trim() !== '') {
                  updated.farcaster = fcHandle.trim().replace(/^@/, '');
                  farcaster = updated.farcaster;
                  console.log('Found Farcaster handle via direct ENS lookup:', farcaster);
                }
              }
            } catch (err) {
              // fail silently, not always set
            }
          }

          setSocialLinks(updated);

          // Store keywords for badge display
          setKeywords(Array.isArray(ensLinksResult.keywords) ? ensLinksResult.keywords : (ensLinksResult.keywords ? [ensLinksResult.keywords] : []));
          setEnsLoaded(true);
        } catch (error) {
          // Log error and move on
          console.error('Error fetching ENS social links:', error);
          setEnsLoaded(true);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchSocialLinks();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [identity]);

  // Only show Farcaster if found on ENS
  const farcasterHandle = socialLinks.farcaster && socialLinks.farcaster.trim() !== '' 
    ? socialLinks.farcaster.replace(/^@/, '')  // remove leading @ if present
    : undefined;

  // Check for any links to display
  const hasLinks = Object.entries(socialLinks || {}).some(([key, val]) => val && val.trim() !== '') || keywords.length > 0 || !!farcasterHandle;

  if (!hasLinks && ensLoaded) {
    return null;
  }

  return (
    <div className="mt-4" data-testid="social-links-section">
      <div className="flex flex-row flex-wrap items-center gap-2">
        {/* Social Media Links */}
        <SocialMediaLinks socials={socialLinks} isLoading={isLoading} />

        {/* Farcaster special icon/link if Farcaster found */}
        {farcasterHandle && (
          <a
            href={`https://warpcast.com/${farcasterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Farcaster: @${farcasterHandle}`}
            className="flex items-center justify-center"
            data-social-link="farcaster"
          >
            <SocialIcon type="farcaster" size={32} />
            <span className="ml-1 text-xs text-fg/80">@{farcasterHandle}</span>
          </a>
        )}
      </div>
      {/* Keyword badges from ENS */}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.map((keyword, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;
