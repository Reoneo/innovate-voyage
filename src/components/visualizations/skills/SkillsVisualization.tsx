
import React from 'react';
import { PassportSkill } from '@/lib/utils';
import SkillsStatsChart from './SkillsStatsChart';
import SkillsNetworkGraph from './SkillsNetworkGraph';

interface SkillsVisualizationProps {
  skills: PassportSkill[];
  name: string;
}

export const SkillsVisualization: React.FC<SkillsVisualizationProps> = ({ skills, name }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-1">Skills Statistics</h4>
        <SkillsStatsChart skills={skills} />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-1">Skills Network</h4>
        <SkillsNetworkGraph skills={skills} name={name} />
      </div>
    </div>
  );
};

export default SkillsVisualization;
