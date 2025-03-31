
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AddSkillForm from '../components/AddSkillForm';
import { useToast } from '@/hooks/use-toast';

interface SkillsTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  avatarUrl?: string;
  ensName?: string;
  ownerAddress?: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, ownerAddress }) => {
  const [userSkills, setUserSkills] = useState(skills);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedWalletAddress');
    
    if (connectedAddress && ownerAddress && 
        connectedAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }

    if (ownerAddress) {
      const storageKey = `user_skills_${ownerAddress}`;
      try {
        const savedSkills = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (savedSkills.length > 0) {
          const existingSkillNames = new Set(skills.map(skill => skill.name));
          const newSkills = savedSkills.filter(skill => !existingSkillNames.has(skill.name));
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

  const saveSkillsToLocalStorage = (skills: Array<{ name: string; proof?: string; issued_by?: string }>) => {
    try {
      const storageKey = `user_skills_${ownerAddress}`;
      localStorage.setItem(storageKey, JSON.stringify(skills));
    } catch (error) {
      console.error('Error saving skills to localStorage:', error);
    }
  };

  const verifiedSkills = userSkills.filter(skill => skill.proof);
  const unverifiedSkills = userSkills.filter(skill => !skill.proof);

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
              {userSkills.length} skills
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Verified Skills</h4>
              <div className="flex flex-wrap gap-2">
                {verifiedSkills.length > 0 ? (
                  verifiedSkills.map((skill, index) => (
                    <Badge key={`verified-${index}`} variant="default" className="bg-green-500 hover:bg-green-600">
                      {skill.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No verified skills yet</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Unverified Skills</h4>
              <div className="flex flex-wrap gap-2">
                {unverifiedSkills.length > 0 ? (
                  unverifiedSkills.map((skill, index) => (
                    <div key={`unverified-${index}`} className="relative group">
                      <Badge variant="outline" className="text-gray-600 border-gray-400 pr-7">
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
                  <p className="text-sm text-muted-foreground">No unverified skills yet</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                <span>Verified Skill</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1.5"></div>
                <span>Unverified Skill</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isOwner && (
        <AddSkillForm onAddSkill={handleAddSkill} />
      )}
    </div>
  );
};

export default SkillsTab;
