
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from '@/components/ui/tooltip';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';

import OverviewTab from './tabs/OverviewTab';
import BlockchainTab from './tabs/BlockchainTab';
import SkillsTab from './tabs/SkillsTab';
import ResumeTab from './tabs/ResumeTab';

interface ProfileTabsContainerProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
  };
  blockchainProfile?: BlockchainProfile;
  transactions?: any[] | null;
  resolvedEns?: string;
  onExportPdf: () => void;
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = ({ 
  passport, 
  blockchainProfile, 
  transactions,
  resolvedEns,
  onExportPdf 
}) => {
  // Ensure skills and socials are properly passed as non-null values
  const normalizedPassport = {
    ...passport,
    skills: passport.skills || [],
    socials: passport.socials || {}
  };
  
  return (
    <TooltipProvider>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px] mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <OverviewTab 
            skills={normalizedPassport.skills}
            name={normalizedPassport.name}
            blockchainProfile={blockchainProfile}
            transactions={transactions}
            address={normalizedPassport.owner_address}
          />
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-6 mt-6">
          <BlockchainTab 
            transactions={transactions}
            address={normalizedPassport.owner_address}
          />
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-6 mt-6">
          <SkillsTab 
            skills={normalizedPassport.skills}
            name={normalizedPassport.name}
          />
        </TabsContent>
        
        <TabsContent value="resume" className="space-y-6 mt-6">
          <ResumeTab 
            passport={normalizedPassport}
            blockchainProfile={blockchainProfile}
            resolvedEns={resolvedEns}
            onExportPdf={onExportPdf}
          />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
};

export default ProfileTabsContainer;
