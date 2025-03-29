
import React from 'react';
import { FileText, Box, Network } from 'lucide-react';
import { HoverCardContent } from '@/components/ui/hover-card';
import { BlockchainPassport } from '@/lib/utils';
import UserInfo from './user-profile/UserInfo';
import ContributionChart from './visualizations/ContributionChart';
import ProjectNetwork from './visualizations/ProjectNetwork';
import SkillsNodeLeafGraph from '@/components/visualizations/skills/SkillsNodeLeafGraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserCardTooltipProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
  };
}

const UserCardTooltip: React.FC<UserCardTooltipProps> = ({ passport }) => {
  return (
    <HoverCardContent className="w-96 p-4">
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
              <Network className="h-3 w-3 mr-1" /> Skills Graph
            </TabsTrigger>
          </TabsList>
          <TabsContent value="connections" className="pt-2">
            <h4 className="text-sm font-medium mb-2">Project Connections</h4>
            <ProjectNetwork passport={passport} />
          </TabsContent>
          <TabsContent value="contributions" className="pt-2">
            <h4 className="text-sm font-medium mb-2">Contribution Metrics</h4>
            <ContributionChart />
          </TabsContent>
          <TabsContent value="skills" className="pt-2">
            <h4 className="text-sm font-medium mb-2">Skills Visualization</h4>
            <div className="h-60">
              <SkillsNodeLeafGraph skills={passport.skills} name={passport.name} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HoverCardContent>
  );
};

export default UserCardTooltip;
