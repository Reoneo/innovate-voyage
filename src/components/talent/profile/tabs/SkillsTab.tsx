
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddSkillForm from '../components/AddSkillForm';
import SkillsListSection from '../components/skills/SkillsListSection';
import SkillsLegendSection from '../components/skills/SkillsLegendSection';
import { useSkills } from '../components/skills/useSkills';

interface SkillsTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  avatarUrl?: string;
  ensName?: string;
  ownerAddress?: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, ownerAddress }) => {
  const { toast } = useToast();
  const { 
    verifiedSkills, 
    unverifiedSkills, 
    isOwner, 
    addSkill, 
    removeSkill 
  } = useSkills(skills, ownerAddress);

  const handleAddSkill = (skillName: string) => {
    if (addSkill(skillName)) {
      toast({
        title: "Skill added",
        description: `${skillName} has been added to your profile.`
      });
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    if (removeSkill(skillName)) {
      toast({
        title: "Skill removed",
        description: `${skillName} has been removed from your profile.`
      });
    }
  };

  const totalSkillsCount = verifiedSkills.length + unverifiedSkills.length;

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="overflow-hidden" id="skills-section">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Skills List
              </CardTitle>
              <CardDescription className="mt-1">
                Your verified and unverified skills
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {totalSkillsCount} skills
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SkillsListSection
              title="Verified Skills"
              skills={verifiedSkills}
              isOwner={isOwner}
              emptyMessage="No verified skills yet"
            />
            
            <SkillsListSection
              title="Unverified Skills"
              skills={unverifiedSkills}
              isOwner={isOwner}
              onRemoveSkill={handleRemoveSkill}
              emptyMessage="No unverified skills yet"
            />
          </div>
          
          <SkillsLegendSection />
        </CardContent>
      </Card>
      
      {isOwner && (
        <AddSkillForm onAddSkill={handleAddSkill} />
      )}
    </div>
  );
};

export default SkillsTab;
