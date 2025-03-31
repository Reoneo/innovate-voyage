
import React from 'react';
import EnsLink from './social/EnsLink';
import WebLink from './social/WebLink';
import NoLinks from './social/NoLinks';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';

interface SocialLinksProps {
  ensName?: string;
  links: string[];
  socials: Record<string, string>;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ ensName, links, socials }) => {
  const hasSocialLinks = ensName || links.length > 0 || Object.keys(socials).length > 0;
  
  return (
    <div className="space-y-4">
      {/* ENS Domain */}
      {ensName && <EnsLink ensName={ensName} />}
      
      {/* Other links */}
      {links.map((link, index) => (
        <WebLink key={index} url={link} />
      ))}
      
      {/* Show a message if no links are available */}
      {!hasSocialLinks && <NoLinks />}
    </div>
  );
};

export default SocialLinks;
