
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';

import BlockchainTab from './tabs/BlockchainTab';
import SkillsTab from './tabs/SkillsTab';

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
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = ({ 
  passport, 
  blockchainProfile, 
  transactions,
  resolvedEns,
  onExportPdf,
  blockchainExtendedData,
  avatarUrl
}) => {
  return (
    <TooltipProvider>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:w-[400px] mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <SkillsTab 
            skills={passport.skills}
            name={passport.name}
            avatarUrl={avatarUrl}
            ensName={resolvedEns}
            ownerAddress={passport.owner_address}
          />
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-6 mt-6">
          <BlockchainTab 
            transactions={transactions}
            address={passport.owner_address}
          />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
