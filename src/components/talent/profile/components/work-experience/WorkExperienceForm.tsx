
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Calendar, Building, Briefcase } from 'lucide-react';
import { WorkExperience } from '@/hooks/useWorkExperience';

interface WorkExperienceFormProps {
  currentExperience: WorkExperience;
  setCurrentExperience: React.Dispatch<React.SetStateAction<WorkExperience | null>>;
  onSave: () => void;
  onCancel: () => void;
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ currentExperience, setCurrentExperience, onSave, onCancel }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Job Title</Label>
          <div className="relative">
            <Input
              id="role"
              value={currentExperience?.role || ''}
              onChange={(e) => setCurrentExperience({
                ...currentExperience!,
                role: e.target.value
              })}
              placeholder="Software Engineer"
              className="pl-10"
            />
            <Briefcase className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <div className="relative">
            <Input
              id="company"
              value={currentExperience?.company || ''}
              onChange={(e) => setCurrentExperience({
                ...currentExperience!,
                company: e.target.value
              })}
              placeholder="Acme Inc."
              className="pl-10"
            />
            <Building className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <div className="relative">
            <Input
              id="startDate"
              type="month"
              value={currentExperience?.startDate || ''}
              onChange={(e) => setCurrentExperience({
                ...currentExperience!,
                startDate: e.target.value
              })}
              className="pl-10"
            />
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <div className="relative">
            <Input
              id="endDate"
              type="month"
              value={currentExperience?.endDate || ''}
              onChange={(e) => setCurrentExperience({
                ...currentExperience!,
                endDate: e.target.value
              })}
              className="pl-10"
            />
            <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={currentExperience?.description || ''}
          onChange={(e) => setCurrentExperience({
            ...currentExperience!,
            description: e.target.value
          })}
          placeholder="Describe your responsibilities and achievements..."
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
