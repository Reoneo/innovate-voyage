
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WorkExperienceEmptyStateProps {
  onAddNew: () => void;
}

const WorkExperienceEmptyState: React.FC<WorkExperienceEmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="text-center py-6">
      <p className="text-muted-foreground mb-4">
        Add your work experience to showcase your professional background
      </p>
      <Button onClick={onAddNew}>
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
};

export default WorkExperienceEmptyState;
