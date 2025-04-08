
import React from 'react';
import SkillItem from './SkillItem';

interface Skill {
  name: string;
  proof?: string;
  issued_by?: string;
}

interface SkillsListSectionProps {
  title: string;
  skills: Skill[];
  isOwner: boolean;
  onRemoveSkill?: (skillName: string) => void;
  emptyMessage?: string;
}

const SkillsListSection: React.FC<SkillsListSectionProps> = ({ 
  title, 
  skills, 
  isOwner, 
  onRemoveSkill,
  emptyMessage = "No skills yet" 
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <SkillItem
              key={`skill-${index}`}
              name={skill.name}
              isVerified={!!skill.proof}
              isOwner={isOwner}
              onRemove={onRemoveSkill}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SkillsListSection;
