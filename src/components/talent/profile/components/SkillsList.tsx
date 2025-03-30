
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddSkillForm from './AddSkillForm';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  name: string;
  proof?: string;
  issued_by?: string;
}

interface SkillsListProps {
  skills: Skill[];
  isOwner: boolean;
  ownerAddress: string;
}

const SkillsList: React.FC<SkillsListProps> = ({ skills = [], isOwner, ownerAddress }) => {
  const [userSkills, setUserSkills] = useState<Skill[]>(skills);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (ownerAddress) {
      const storageKey = `user_skills_${ownerAddress}`;
      try {
        const savedSkills = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (savedSkills.length > 0) {
          const existingSkillNames = new Set(skills.map(skill => skill.name));
          const newSkills = savedSkills.filter((skill: Skill) => !existingSkillNames.has(skill.name));
          setUserSkills([...skills, ...newSkills]);
        }
      } catch (error) {
        console.error('Error loading skills from localStorage:', error);
      }
    }
  }, [ownerAddress, skills]);

  const handleAddSkill = (skillName: string) => {
    const newSkill = {
      name: skillName,
      proof: undefined,
      issued_by: undefined
    };
    
    setUserSkills(prevSkills => {
      const existingSkillNames = new Set(prevSkills.map(skill => skill.name));
      if (!existingSkillNames.has(skillName)) {
        const updatedSkills = [...prevSkills, newSkill];
        saveSkillsToLocalStorage(updatedSkills);
        return updatedSkills;
      }
      return prevSkills;
    });
    
    toast({
      title: "Skill added",
      description: `${skillName} has been added to your profile.`
    });
    
    setShowAddSkillForm(false);
  };

  const handleRemoveSkill = (skillName: string) => {
    const updatedSkills = userSkills.filter(skill => 
      skill.name !== skillName || skill.proof
    );
    
    setUserSkills(updatedSkills);
    saveSkillsToLocalStorage(updatedSkills);
    
    toast({
      title: "Skill removed",
      description: `${skillName} has been removed from your profile.`
    });
  };

  const saveSkillsToLocalStorage = (skills: Skill[]) => {
    try {
      const storageKey = `user_skills_${ownerAddress}`;
      localStorage.setItem(storageKey, JSON.stringify(skills));
    } catch (error) {
      console.error('Error saving skills to localStorage:', error);
    }
  };

  const verifiedSkills = userSkills.filter(skill => skill.proof);
  const unverifiedSkills = userSkills.filter(skill => !skill.proof);
  
  const skillCount = userSkills.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-1">
          <span className="text-sm text-[#9b87f5]">✦</span> Skills List
          <span className="text-xs text-gray-400 ml-1">({skillCount})</span>
        </h2>
        {isOwner && !showAddSkillForm && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAddSkillForm(true)}
          >
            Add Skill
          </Button>
        )}
      </div>
      
      {showAddSkillForm && (
        <AddSkillForm 
          onAddSkill={handleAddSkill} 
          onCancel={() => setShowAddSkillForm(false)}
        />
      )}
      
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium mb-2">Verified Skills</h3>
          <div className="flex flex-wrap gap-2">
            {verifiedSkills.length > 0 ? (
              verifiedSkills.map((skill, index) => (
                <Badge key={`verified-${index}`} variant="default" className="bg-green-600 hover:bg-green-700">
                  {skill.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-400">No verified skills yet</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Unverified Skills</h3>
          <div className="flex flex-wrap gap-2">
            {unverifiedSkills.length > 0 ? (
              unverifiedSkills.map((skill, index) => (
                <div key={`unverified-${index}`} className="relative group">
                  <Badge variant="outline" className="text-gray-300 border-gray-600 pr-7">
                    {skill.name}
                  </Badge>
                  {isOwner && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveSkill(skill.name)}
                      aria-label={`Remove ${skill.name} skill`}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No unverified skills yet</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Legend:</p>
        <div className="flex gap-4 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            <span>Verified Skill</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span>Unverified Skill</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsList;
