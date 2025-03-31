
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';

import BlockchainTab from './tabs/BlockchainTab';
import SkillsTab from './tabs/SkillsTab';
import BioSection from './components/BioSection';
import WorkExperienceSection from './components/WorkExperienceSection';

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
        
        <SkillsTab 
          skills={passport.skills || []}
          avatarUrl={avatarUrl}
          ensName={resolvedEns || ''}
          ownerAddress={ownerAddress}
        />
        
        <BlockchainTab 
          transactions={transactions}
          address={ownerAddress}
        />
      </div>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
