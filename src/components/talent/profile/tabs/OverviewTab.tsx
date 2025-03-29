import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';
import { Network, Link as LinkIcon, Globe, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const socials = blockchainProfile?.socials || {};

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
            {/* ENS Domains */}
            {ensName && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <a 
                  href={`https://app.ens.domains/name/${ensName}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {ensName}
                </a>
              </div>
            )}
            
            {/* Other links */}
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {new URL(link).hostname}
                </a>
              </div>
            ))}
            
            {/* Social links */}
            {socials.github && (
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <a 
                  href={socials.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GitHub
                </a>
              </div>
            )}
            
            {socials.twitter && (
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                <a 
                  href={socials.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Twitter
                </a>
              </div>
            )}
            
            {socials.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                <a 
                  href={socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            )}
            
            {socials.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <a 
                  href={socials.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Website
                </a>
              </div>
            )}
            
            {/* Show a message if no links are available */}
            {!ensName && links.length === 0 && Object.keys(socials).length === 0 && (
              <div className="text-muted-foreground text-sm py-4">
                No web3 links available for this profile
              </div>
            )}
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
              address={ensName?.includes('.eth') ? undefined : ensName}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
