
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';

import BlockchainTab from './tabs/BlockchainTab';
import SkillsTab from './tabs/SkillsTab';
import BioSection from './components/BioSection';
import WorkExperienceSection from './components/WorkExperienceSection';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';

interface ProfileTabsContainerProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
  };
  blockchainProfile?: BlockchainProfile;
  transactions?: any[] | null;
  resolvedEns?: string;
  onExportPdf: () => void;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
  };
  avatarUrl?: string;
  ownerAddress: string;
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = ({ 
  passport, 
  blockchainProfile, 
  transactions,
  resolvedEns,
  onExportPdf,
  blockchainExtendedData,
  avatarUrl,
  ownerAddress
}) => {
  return (
    <TooltipProvider>
      <div className="space-y-6 mt-6">
        <BioSection 
          ownerAddress={ownerAddress}
          initialBio={passport.bio || ''}
        />
        
        <WorkExperienceSection 
          ownerAddress={ownerAddress}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillsTab 
            skills={passport.skills || []}
            avatarUrl={avatarUrl}
            ensName={resolvedEns || ''}
            ownerAddress={ownerAddress}
          />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Network className="h-5 w-5" />
                Identity Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <IdNetworkGraph 
                  name={passport.name} 
                  avatarUrl={avatarUrl}
                  ensName={resolvedEns}
                  address={ownerAddress}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <BlockchainTab 
          transactions={transactions}
          address={ownerAddress}
        />
      </div>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
