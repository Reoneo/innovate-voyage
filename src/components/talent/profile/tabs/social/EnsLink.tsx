
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface EnsLinkProps {
  ensName: string;
  isPrimary?: boolean;
}

const EnsLink: React.FC<EnsLinkProps> = ({ ensName, isPrimary = false }) => {
  const ensUrl = `https://app.ens.domains/name/${ensName}`;
  const avatarUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
  
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl} alt={ensName} />
        <AvatarFallback>{ensName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <a 
            href={ensUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-base font-medium hover:underline"
          >
            {ensName}
          </a>
          {isPrimary && <Badge variant="outline" className="text-xs">Primary</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">ENS Domain</p>
      </div>
    </div>
  );
};

export default EnsLink;
