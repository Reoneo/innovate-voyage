import React from 'react';
import SocialLinkItem from './social/SocialLinkItem';
import EnsLink from './social/EnsLink';
import WebLink from './social/WebLink';
import NoLinks from './social/NoLinks';

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
      {socials.github && (
        <SocialLinkItem platformType="github" url={socials.github} />
      )}
      
      {socials.twitter && (
        <SocialLinkItem platformType="twitter" url={socials.twitter} />
      )}
      
      {socials.linkedin && (
        <SocialLinkItem platformType="linkedin" url={socials.linkedin} />
      )}
      
      {socials.facebook && (
        <SocialLinkItem platformType="facebook" url={socials.facebook} />
      )}
      
      {socials.instagram && (
        <SocialLinkItem platformType="instagram" url={socials.instagram} />
      )}
      
      {socials.youtube && (
        <SocialLinkItem platformType="youtube" url={socials.youtube} />
      )}
      
      {socials.bluesky && (
        <SocialLinkItem platformType="bluesky" url={socials.bluesky} />
      )}
      
      {socials.website && (
        <SocialLinkItem platformType="globe" url={socials.website} />
      )}
      
      {/* Show a message if no links are available */}
      {!hasSocialLinks && <NoLinks />}
    </div>
  );
};

export default SocialLinks;
