import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { Link as LinkIcon, ListFilter } from 'lucide-react';
import EnsLink from './social/EnsLink';
import WebLink from './social/WebLink';
import NoLinks from './social/NoLinks';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface OverviewTabProps {
  skills: Array<{ name: string; proof?: string }>;
  name: string;
  blockchainProfile?: BlockchainProfile | null;
  transactions?: any[] | null;
  address: string;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
  };
  avatarUrl?: string;
  ensName?: string;
  additionalEnsDomains?: string[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  name, 
  blockchainProfile,
  address,
  avatarUrl,
  ensName,
  additionalEnsDomains = []
}) => {
  // Extract links from blockchain profile if available
  const links = blockchainProfile?.ensLinks || [];
  const hasSocialLinks = ensName || links.length > 0 || additionalEnsDomains.length > 0;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Links */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Web3 Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Primary ENS Domain */}
            {ensName && <EnsLink ensName={ensName} />}
            
            {/* Additional ENS Domains */}
            {additionalEnsDomains && additionalEnsDomains.length > 0 && (
              <div className="mt-4">
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
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
