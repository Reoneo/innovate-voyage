
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';
import { POAP } from '@/api/types/poapTypes';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';

import WorkExperienceSection from './components/WorkExperienceSection';
import SkillsTab from './tabs/SkillsTab';
import PoapsTab from './tabs/PoapsTab';

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
  poaps?: POAP[];
  isLoadingPoaps?: boolean;
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = ({ 
  passport, 
  resolvedEns,
  avatarUrl,
  ownerAddress,
  blockchainProfile,
  poaps,
  isLoadingPoaps
}) => {
  return (
    <TooltipProvider>
      <ResizablePanelGroup 
        direction="vertical" 
        className="min-h-[600px] rounded-lg border"
      >
        {/* Work Experience Section */}
        <ResizablePanel defaultSize={33} minSize={20}>
          <div className="p-4 h-full overflow-auto">
            <h2 className="text-xl font-bold mb-4">Work Experience</h2>
            <WorkExperienceSection 
              ownerAddress={ownerAddress}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Skills Section */}
        <ResizablePanel defaultSize={33} minSize={20}>
          <div className="p-4 h-full overflow-auto">
            <h2 className="text-xl font-bold mb-4">Skills</h2>
            <SkillsTab 
              skills={passport.skills}
              name={passport.name}
              avatarUrl={avatarUrl}
              ensName={resolvedEns}
              ownerAddress={ownerAddress}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* POAPs Section */}
        <ResizablePanel defaultSize={33} minSize={20}>
          <div className="p-4 h-full overflow-auto">
            <h2 className="text-xl font-bold mb-4">POAPs</h2>
            <PoapsTab 
              poaps={poaps}
              isLoading={isLoadingPoaps}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
