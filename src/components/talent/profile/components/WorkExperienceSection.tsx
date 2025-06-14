
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useWorkExperience } from '@/hooks/useWorkExperience';
import WorkExperienceForm from './work-experience/WorkExperienceForm';
import WorkExperienceList from './work-experience/WorkExperienceList';
import WorkExperienceEmptyState from './work-experience/WorkExperienceEmptyState';

interface WorkExperienceSectionProps {
  ownerAddress: string;
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ ownerAddress }) => {
  const {
    experiences,
    isEditing,
    currentExperience,
    isOwner,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    setCurrentExperience,
  } = useWorkExperience(ownerAddress);

  if (experiences.length === 0 && !isEditing && !isOwner) {
    return null;
  }

  return (
    <Card id="work-experience-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Your professional experience</CardDescription>
          </div>
          {isOwner && !isEditing && (
            <Button variant="outline" size="sm" onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing && currentExperience ? (
          <WorkExperienceForm
            currentExperience={currentExperience}
            setCurrentExperience={setCurrentExperience}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <>
            {experiences.length > 0 ? (
              <WorkExperienceList
                experiences={experiences}
                isOwner={isOwner}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : isOwner ? (
              <WorkExperienceEmptyState onAddNew={handleAddNew} />
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkExperienceSection;
