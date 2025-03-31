
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, X } from 'lucide-react';

interface AddSkillFormProps {
  onAddSkill: (skillName: string) => void;
  onCancel: () => void;
}

const AddSkillForm: React.FC<AddSkillFormProps> = ({ onAddSkill, onCancel }) => {
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSkill.trim()) {
      toast({
        title: "Error",
        description: "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Add the skill
    onAddSkill(newSkill.trim());
    
    // Reset form
    setNewSkill('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-700 p-4 rounded-lg bg-[#222632]">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Add Unverified Skill</h3>
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-6 w-6">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newSkill">Skill Name</Label>
        <Input
          id="newSkill"
          placeholder="e.g. React, Solidity, UX Design"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          disabled={isSubmitting}
          className="bg-[#1A1F2C] border-gray-700"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || !newSkill.trim()}
        >
          Add Skill
        </Button>
      </div>
      
      <p className="text-xs text-gray-500">
        Note: This skill will be marked as unverified until proof is provided
      </p>
    </form>
  );
};

export default AddSkillForm;
