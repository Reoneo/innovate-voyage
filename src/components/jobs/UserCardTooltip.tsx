
import React from 'react';
import { FileText, Box } from 'lucide-react';
import { HoverCardContent } from '@/components/ui/hover-card';
import { BlockchainPassport } from '@/lib/utils';
import UserInfo from './user-profile/UserInfo';
import ContributionChart from './visualizations/ContributionChart';
import ProjectNetwork from './visualizations/ProjectNetwork';

interface UserCardTooltipProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
  };
}

const UserCardTooltip: React.FC<UserCardTooltipProps> = ({ passport }) => {
  return (
    <HoverCardContent className="w-80 p-4">
      <div className="space-y-4">
        <UserInfo passport={passport} />

        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
            <FileText className="h-4 w-4" /> Contribution Metrics
          </h4>
          <ContributionChart />
        </div>

        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
            <Box className="h-4 w-4" /> Project Connections
          </h4>
          <ProjectNetwork passport={passport} />
        </div>
      </div>
    </HoverCardContent>
  );
};

export default UserCardTooltip;
