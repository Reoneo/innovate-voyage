
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';
import { Network, Link as LinkIcon } from 'lucide-react';
import EnsLink from './social/EnsLink';
import WebLink from './social/WebLink';
import NoLinks from './social/NoLinks';

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
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  name, 
  blockchainProfile,
  address,
  avatarUrl,
  ensName
}) => {
  // Extract links from blockchain profile if available
  const links = blockchainProfile?.ensLinks || [];
  const hasSocialLinks = ensName || links.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {/* ENS Domain */}
            {ensName && <EnsLink ensName={ensName} />}
            
            {/* Other links */}
            {links.map((link, index) => (
              <WebLink key={index} url={link} />
            ))}
            
            {/* Show a message if no links are available */}
            {!hasSocialLinks && <NoLinks />}
          </div>
        </CardContent>
      </Card>

      {/* ID Network */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Network className="h-5 w-5" />
            Identity Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <IdNetworkGraph 
              name={name} 
              avatarUrl={avatarUrl}
              ensName={ensName}
              address={address}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
