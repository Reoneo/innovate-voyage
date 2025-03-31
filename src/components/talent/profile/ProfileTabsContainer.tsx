
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
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = ({ 
  passport, 
  resolvedEns,
  avatarUrl,
  ownerAddress,
  blockchainProfile
}) => {
  return (
    <TooltipProvider>
      <div className="space-y-6 mt-6 bg-white p-0 max-w-full mx-auto" style={{ maxWidth: '21cm' }}>
        <WorkExperienceSection ownerAddress={ownerAddress} />
      </div>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
