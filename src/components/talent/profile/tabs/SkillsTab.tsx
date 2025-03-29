
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SkillsNodeLeafD3 from '@/components/visualizations/skills/SkillsNodeLeafD3';
import SkillsNetworkGraph from '@/components/visualizations/skills/SkillsNetworkGraph';

interface SkillsTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, name }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills Visualization</CardTitle>
          <CardDescription>
            Interactive visualization of skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <SkillsNodeLeafD3 
              skills={skills} 
              name={name} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Skills Network</CardTitle>
          <CardDescription>
            Connections between skills and projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <SkillsNetworkGraph 
              skills={skills} 
              name={name} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsTab;
