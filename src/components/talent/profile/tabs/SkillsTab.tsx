
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Grid2x2 } from 'lucide-react';
import SkillsNodeLeafD3 from '@/components/visualizations/skills/SkillsNodeLeafD3';
import SkillsNetworkGraph from '@/components/visualizations/skills/SkillsNetworkGraph';

interface SkillsTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  avatarUrl?: string;
  ensName?: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, name, avatarUrl, ensName }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Grid2x2 className="h-5 w-5 text-primary" />
                Skills Visualization
              </CardTitle>
              <CardDescription className="mt-1">
                Interactive visualization of skills and expertise
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {skills.length} skills
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full pt-4">
            <SkillsNodeLeafD3 
              skills={skills} 
              name={name} 
              avatarUrl={avatarUrl}
              ensName={ensName}
            />
          </div>
          <div className="mt-4 border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                <span>Main Profile</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                <span>Verified Skill</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1.5"></div>
                <span>Unverified Skill</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Skills Network
              </CardTitle>
              <CardDescription className="mt-1">
                Connections between skills and projects
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              Interactive
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full pt-4">
            <SkillsNetworkGraph 
              skills={skills} 
              name={name} 
              avatarUrl={avatarUrl}
              ensName={ensName}
            />
          </div>
          <div className="mt-4 border-t pt-3">
            <h4 className="text-sm font-medium mb-2">How to use:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-muted mr-1.5">1</span>
                <span>Drag nodes to rearrange</span>
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-muted mr-1.5">2</span>
                <span>Hover for details</span>
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-muted mr-1.5">3</span>
                <span>Click to focus</span>
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-muted mr-1.5">4</span>
                <span>Circle size = relevance</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsTab;
