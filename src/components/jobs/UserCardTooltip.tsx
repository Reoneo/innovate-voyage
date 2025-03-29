
import React from 'react';
import { FileText, Box, Network, Coins } from 'lucide-react';
import { HoverCardContent } from '@/components/ui/hover-card';
import { BlockchainPassport } from '@/lib/utils';
import UserInfo from './user-profile/UserInfo';
import ContributionChart from './visualizations/ContributionChart';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';
import SkillsNodeLeafD3 from '@/components/visualizations/skills/SkillsNodeLeafD3';
import BlockchainActivity from './user-profile/BlockchainActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserCardTooltipProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
  };
}

const UserCardTooltip: React.FC<UserCardTooltipProps> = ({ passport }) => {
  const isMobile = useIsMobile();
  
  return (
    <HoverCardContent className={`${isMobile ? 'w-[calc(100vw-40px)] max-w-full' : 'w-96'} p-4`}>
      <div className="space-y-4">
        <UserInfo passport={passport} />

        <Tabs defaultValue="connections">
          <TabsList className="w-full">
            <TabsTrigger value="connections" className="text-xs">
              <Box className="h-3 w-3 mr-1" /> Connections
            </TabsTrigger>
            <TabsTrigger value="contributions" className="text-xs">
              <FileText className="h-3 w-3 mr-1" /> Contributions
            </TabsTrigger>
            <TabsTrigger value="skills" className="text-xs">
              <Network className="h-3 w-3 mr-1" /> Skills
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="text-xs">
              <Coins className="h-3 w-3 mr-1" /> Blockchain
            </TabsTrigger>
          </TabsList>
          <TabsContent value="connections" className="pt-2">
            <h4 className="text-sm font-medium mb-2">ID Network</h4>
            <TooltipProvider>
              <IdNetworkGraph 
                name={passport.name} 
                avatarUrl={passport.avatar_url} 
                ensName={passport.passport_id.includes('.eth') ? passport.passport_id : undefined}
                address={passport.owner_address}
              />
            </TooltipProvider>
          </TabsContent>
          <TabsContent value="contributions" className="pt-2">
            <h4 className="text-sm font-medium mb-2">Contribution Metrics</h4>
            <ContributionChart />
          </TabsContent>
          <TabsContent value="skills" className="pt-2">
            <h4 className="text-sm font-medium mb-2">Skills Visualization</h4>
            <div className={`${isMobile ? 'h-40' : 'h-60'}`}>
              <TooltipProvider>
                <SkillsNodeLeafD3 skills={passport.skills} name={passport.name} />
              </TooltipProvider>
            </div>
          </TabsContent>
          <TabsContent value="blockchain" className="pt-2">
            <h4 className="text-sm font-medium mb-2">Blockchain Activity</h4>
            <BlockchainActivity address={passport.owner_address} />
          </TabsContent>
        </Tabs>
      </div>
    </HoverCardContent>
  );
};

export default UserCardTooltip;
