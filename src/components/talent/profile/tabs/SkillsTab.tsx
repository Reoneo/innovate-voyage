
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SkillsTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  avatarUrl?: string;
  ensName?: string;
  ownerAddress?: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills }) => {
  const verifiedSkills = skills.filter(skill => skill.proof);
  const unverifiedSkills = skills.filter(skill => !skill.proof);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Verified Skills</h4>
        <div className="flex flex-wrap gap-2">
          {verifiedSkills.length > 0 ? (
            verifiedSkills.map((skill, index) => (
              <Badge key={`verified-${index}`} variant="default" className="bg-green-500 hover:bg-green-600">
                {skill.name}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No verified skills yet</p>
          )}
        </div>
      </div>
      
      {unverifiedSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Other Skills</h4>
          <div className="flex flex-wrap gap-2">
            {unverifiedSkills.map((skill, index) => (
              <Badge key={`unverified-${index}`} variant="outline">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-2 pt-2 border-t">
        <h4 className="text-xs text-muted-foreground mb-1">Legend:</h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
            <span>Verified</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border border-gray-300 mr-1.5"></div>
            <span>Unverified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;
