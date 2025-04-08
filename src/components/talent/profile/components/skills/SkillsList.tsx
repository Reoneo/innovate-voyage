
import React from 'react';
import SkillBadge from './SkillBadge';

interface SkillsListProps {
  skills: Array<{ name: string; proof?: string }>;
  isLoading: boolean;
}

const SkillsList: React.FC<SkillsListProps> = ({ skills, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-2">
        <p className="text-muted-foreground text-sm">Loading skills...</p>
      </div>
    );
  }

  if (!skills || skills.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">
          No verified skills found.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => {
        // Determine skill variant
        let variant: 'credential' | 'verified' | 'unverified' = 'unverified';
        
        if (skill.proof) {
          if (skill.proof.includes('credentials')) {
            variant = 'credential';
          } else {
            variant = 'verified';
          }
        }
        
        return (
          <SkillBadge
            key={index}
            name={skill.name}
            proof={skill.proof}
            variant={variant}
          />
        );
      })}
    </div>
  );
};

export default SkillsList;
