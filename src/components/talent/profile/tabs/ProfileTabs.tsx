
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainPassport } from '@/lib/utils';
import { BlockchainProfile } from '@/api/types/etherscanTypes';

import BioSection from '../components/BioSection';
import WorkExperienceSection from '../components/WorkExperienceSection';
import SkillsOverviewSection from './sections/SkillsOverviewSection';
import IdentityNetworkSection from './sections/IdentityNetworkSection';
import BlockchainSection from './sections/BlockchainSection';

interface ProfileTabsProps {
  passport: BlockchainPassport & {
    category: string;
  };
  blockchainProfile?: BlockchainProfile;
  transactions?: any[] | null;
  resolvedEns?: string;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
    description?: string;
  };
  avatarUrl?: string;
  ownerAddress: string;
  additionalEnsDomains?: string[];
  blockchainError?: Error | null;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  passport, 
  blockchainProfile, 
  transactions,
  resolvedEns,
  blockchainExtendedData,
  avatarUrl,
  ownerAddress,
  additionalEnsDomains = [],
  blockchainError
}) => {
  // Extract description from ENS data
  const ensDescription = blockchainProfile?.description || blockchainExtendedData?.description;
  
  return (
    <TooltipProvider>
      <div className="space-y-6 mt-6">
        <BioSection 
          ownerAddress={ownerAddress}
          initialBio={passport.bio || ''}
          ensDescription={ensDescription}
        />
        
        <WorkExperienceSection 
          ownerAddress={ownerAddress}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkillsOverviewSection 
            skills={passport.skills || []}
            avatarUrl={avatarUrl}
            ensName={resolvedEns || ''}
            ownerAddress={ownerAddress}
          />
          
          <IdentityNetworkSection 
            name={passport.name}
            avatarUrl={avatarUrl}
            ensName={resolvedEns}
            address={ownerAddress}
            additionalEnsDomains={additionalEnsDomains}
          />
        </div>
        
        <BlockchainSection 
          transactions={transactions}
          address={ownerAddress}
          error={blockchainError}
        />
      </div>
    </TooltipProvider>
  );
};

export default ProfileTabs;
