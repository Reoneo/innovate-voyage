import React from 'react';
import EnsLink from './social/EnsLink';
import WebLink from './social/WebLink';
import NoLinks from './social/NoLinks';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ListFilter } from 'lucide-react';

interface SocialLinksProps {
  ensName?: string;
  links: string[];
  socials: Record<string, string>;
  additionalEnsDomains?: string[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ 
  ensName, 
  links, 
  socials,
  additionalEnsDomains = []
}) => {
  const hasSocialLinks = ensName || links.length > 0 || Object.keys(socials).length > 0 || additionalEnsDomains.length > 0;
  
  return (
    <div className="space-y-4">
      {/* Primary ENS Domain */}
      {ensName && <EnsLink ensName={ensName} />}
      
      {/* Additional ENS Domains */}
      {additionalEnsDomains && additionalEnsDomains.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
            <ListFilter className="h-4 w-4" /> 
            Additional ENS Domains
          </h4>
          <div className="flex flex-wrap gap-2">
            {additionalEnsDomains.map((domain, index) => (
              <a 
                key={index}
                href={`https://app.ens.domains/name/${domain}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={`https://metadata.ens.domains/mainnet/avatar/${domain}`} alt={domain} />
                  <AvatarFallback>{domain.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{domain}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      
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
