
import React from 'react';
import { Button } from '@/components/ui/button';
import { PencilLine, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { WorkExperience } from '@/hooks/useWorkExperience';

interface WorkExperienceItemProps {
  experience: WorkExperience;
  isOwner: boolean;
  onEdit: (experience: WorkExperience) => void;
  onDelete: (id: string) => void;
}

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMM yyyy');
  } catch (error) {
    return dateString;
  }
};

const WorkExperienceItem: React.FC<WorkExperienceItemProps> = ({ experience, isOwner, onEdit, onDelete }) => {
  return (
    <div className="border-b last:border-b-0 pb-4 last:pb-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-lg">{experience.role}</h3>
          <p className="text-muted-foreground">
            {experience.company} · {formatDisplayDate(experience.startDate)} - {experience.endDate ? formatDisplayDate(experience.endDate) : 'Present'}
          </p>
        </div>
        
        {isOwner && (
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(experience)}>
              <PencilLine className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(experience.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </div>
      
      {experience.description && (
        <p className="text-sm whitespace-pre-wrap">{experience.description}</p>
      )}
    </div>
  );
};

export default WorkExperienceItem;
