
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { BlockchainPassport } from '@/lib/utils';
import { Skill } from '@/types/task';

export interface SkillsTabProps {
  skills: Skill[];
  name: string;
  address?: string;
  ensName?: string;
  avatarUrl?: string;
  blockchainProfile?: any;
  transactions?: any[];
  blockchainExtendedData?: any;
  additionalEnsDomains?: string[];
}

const SkillsTab: React.FC<SkillsTabProps> = ({ 
  skills, 
  name, 
  address,
  ensName,
  blockchainProfile,
  transactions,
  blockchainExtendedData,
  additionalEnsDomains
}) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-muted-foreground">No skills information available for this profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 border rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">
              Skills are derived from on-chain activity, ENS records, and social media information associated with this identity.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{skill.name}</h3>
                {skill.proof && (
                  <a 
                    href={skill.proof.startsWith('http') ? skill.proof : `https://${skill.proof}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground underline hover:text-primary"
                  >
                    View proof
                  </a>
                )}
              </div>
              <Badge variant="outline" className="text-xs">Blockchain Verified</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;
