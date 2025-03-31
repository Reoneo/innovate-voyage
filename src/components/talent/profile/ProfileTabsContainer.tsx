
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';

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
  primaryDomain?: string | null;
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = ({ 
  passport, 
  resolvedEns,
  avatarUrl,
  ownerAddress,
  blockchainProfile,
  primaryDomain
}) => {
  return (
    <TooltipProvider>
      <div className="space-y-6 mt-6">
        <WorkExperienceSection 
          ownerAddress={ownerAddress}
        />
      </div>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
