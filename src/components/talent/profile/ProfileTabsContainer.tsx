
import React from 'react';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport, Skill } from '@/lib/utils';

import BlockchainTab from './tabs/BlockchainTab';
import SkillsTab from './tabs/SkillsTab';
import BioSection from './components/BioSection';
import WorkExperienceSection from './components/WorkExperienceSection';
import VerifiedWorkExperience from './components/VerifiedWorkExperience';
import { Separator } from '@/components/ui/separator';

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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
      {/* Left Column */}
      <div className="md:col-span-5 space-y-6">
        <BioSection 
          ownerAddress={ownerAddress}
          initialBio={passport.bio || ''}
        />
        
        <SkillsTab 
          skills={passport.skills}
          name={passport.name}
          avatarUrl={avatarUrl}
          ensName={resolvedEns}
          ownerAddress={ownerAddress}
        />

        <BlockchainTab 
          transactions={transactions}
          address={ownerAddress}
          simplified={true}
        />
      </div>
      
      {/* Right Column */}
      <div className="md:col-span-7 space-y-6">
        <VerifiedWorkExperience
          walletAddress={ownerAddress}
        />
        
        <WorkExperienceSection 
          ownerAddress={ownerAddress}
        />
      </div>
    </div>
  );
};

export default ProfileTabsContainer;
