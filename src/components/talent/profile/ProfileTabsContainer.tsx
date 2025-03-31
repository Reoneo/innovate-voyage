
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';
import { Card } from '@/components/ui/card';
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
        <Card className="bg-white border shadow-md rounded-sm overflow-hidden">
          <div className="p-6">
            <div>
              <WorkExperienceSection 
                ownerAddress={ownerAddress}
              />
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
