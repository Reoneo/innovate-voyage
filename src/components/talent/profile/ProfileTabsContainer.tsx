
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';
import { POAP } from '@/api/types/poapTypes';
import DraggableTile from '@/components/ui/draggable-tile';
import { Briefcase, Code, Award } from 'lucide-react';

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
      <div className="relative h-[600px] w-full border rounded-lg" style={{ overflow: 'hidden' }}>
        <div className="absolute inset-0">
          {/* Work Experience Tile */}
          <DraggableTile 
            title="Work Experience" 
            defaultPosition={{ x: 20, y: 20 }}
            defaultSize={{ width: 380, height: 300 }}
            icon={<Briefcase className="h-4 w-4" />}
          >
            <WorkExperienceSection 
              ownerAddress={ownerAddress}
            />
          </DraggableTile>
          
          {/* Skills Tile */}
          <DraggableTile 
            title="Skills" 
            defaultPosition={{ x: 420, y: 20 }}
            defaultSize={{ width: 380, height: 300 }}
            icon={<Code className="h-4 w-4" />}
          >
            <SkillsTab 
              skills={passport.skills}
              name={passport.name}
              avatarUrl={avatarUrl}
              ensName={resolvedEns}
              ownerAddress={ownerAddress}
            />
          </DraggableTile>
          
          {/* POAPs Tile */}
          <DraggableTile 
            title="POAPs" 
            defaultPosition={{ x: 220, y: 340 }}
            defaultSize={{ width: 380, height: 300 }}
            icon={<Award className="h-4 w-4" />}
          >
            <PoapsTab 
              poaps={poaps}
              isLoading={isLoadingPoaps}
            />
          </DraggableTile>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
