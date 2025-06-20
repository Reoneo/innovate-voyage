
import React from 'react';
import WorkExperienceItem from './WorkExperienceItem';
import { WorkExperience } from '@/hooks/useWorkExperience';

interface WorkExperienceListProps {
  experiences: WorkExperience[];
  isOwner: boolean;
  onEdit: (experience: WorkExperience) => void;
  onDelete: (id: string) => void;
}

const WorkExperienceList: React.FC<WorkExperienceListProps> = ({ experiences, isOwner, onEdit, onDelete }) => {
  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <WorkExperienceItem
          key={exp.id}
          experience={exp}
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WorkExperienceList;
