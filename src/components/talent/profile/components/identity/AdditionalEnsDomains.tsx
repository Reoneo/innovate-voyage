
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AdditionalEnsDomainsProps {
  domains?: string[];
}

const AdditionalEnsDomains: React.FC<AdditionalEnsDomainsProps> = ({ domains = [] }) => {
  if (!domains || domains.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-2 max-w-full">
      {domains.map((domain, index) => (
        <a 
          key={index}
          href={`https://app.ens.domains/name/${domain}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors text-xs"
        >
          <Avatar className="h-4 w-4">
            <AvatarImage src={`https://metadata.ens.domains/mainnet/avatar/${domain}`} alt={domain} />
            <AvatarFallback>{domain.substring(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          {domain}
        </a>
      ))}
    </div>
  );
};

export default AdditionalEnsDomains;
