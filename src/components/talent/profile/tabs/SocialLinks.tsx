import React from 'react';
import SocialLinkItem from './social/SocialLinkItem';
import EnsLink from './social/EnsLink';
import WebLink from './social/WebLink';
import NoLinks from './social/NoLinks';
import SocialMediaLinks from './social/SocialMediaLinks';

interface SocialLinksProps {
  ensName?: string;
  links: string[];
  socials: Record<string, string>;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ ensName, links, socials }) => {
  const hasSocialLinks = ensName || links.length > 0 || Object.keys(socials).length > 0;
  
  return (
    <div className="space-y-4">
      {/* ENS Domains */}
      {ensName && <EnsLink ensName={ensName} />}
      
      {/* Other links */}
      {links.map((link, index) => (
        <WebLink key={index} url={link} />
      ))}
      
      {/* Social media links */}
      <SocialMediaLinks socials={socials} />
      
      {/* Show a message if no links are available */}
      {!hasSocialLinks && <NoLinks />}
    </div>
  );
};

export default SocialLinks;
