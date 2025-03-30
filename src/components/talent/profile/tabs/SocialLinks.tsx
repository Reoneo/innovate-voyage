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
      {/* Social media icons in a horizontal row */}
      {Object.keys(socials).length > 0 && (
        <div className="flex flex-wrap gap-3">
          {socialPlatforms.map(platform => 
            socials[platform.key] && (
              <a 
                key={platform.key}
                href={socials[platform.key]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity p-1 bg-secondary/30 rounded-full"
                aria-label={`Visit ${platform.key}`}
              >
                <SocialIcon 
                  type={platform.type as any} 
                  size={20}
                />
              </a>
            )
          )}
        </div>
      )}
      
      {/* ENS Domains */}
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
