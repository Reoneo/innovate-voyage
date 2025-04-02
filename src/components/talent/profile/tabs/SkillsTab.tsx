
import React from 'react';
import { Card } from '@/components/ui/card';
import { SkillsVisualization } from '@/components/visualizations/skills';
import { IdNetworkGraph } from '@/components/visualizations/identity';
import { truncateAddress } from '@/lib/utils';

// Define Skill interface locally for this component
interface Skill {
  name: string;
  proof?: string;
  level?: number;
}

// Define the props interface for SkillsTab
export interface SkillsTabProps {
  skills?: Skill[];
  name?: string;
  address?: string;
  ensName?: string;
  avatarUrl?: string;
  additionalEnsDomains?: string[];
}

const SkillsTab: React.FC<SkillsTabProps> = ({
  skills = [],
  name = 'Unknown',
  address,
  ensName,
  avatarUrl,
  additionalEnsDomains
}) => {
  return (
    <div className="space-y-6">
      {/* Skills Section */}
      <Card className="p-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          Skills
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Here's a summary of skills associated with this profile.
        </p>
        <div className="mt-4">
          {skills.length > 0 ? (
            <SkillsVisualization skills={skills as any} name={name} />
          ) : (
            <p className="text-muted-foreground">No skills listed for this profile.</p>
          )}
        </div>
      </Card>

      {/* Identity Network Graph Section */}
      <Card className="p-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          Identity Network
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Explore the network of identities and connections for this profile.
        </p>
        <div className="mt-4">
          {address ? (
            <IdNetworkGraph 
              name={name} 
              address={address} 
              ensName={ensName} 
              avatarUrl={avatarUrl} 
            />
          ) : (
            <p className="text-muted-foreground">
              Could not resolve identity graph for {name || truncateAddress(address || '')}.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SkillsTab;
