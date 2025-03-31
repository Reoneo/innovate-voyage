
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AddSkillForm from '../components/AddSkillForm';

interface Skill {
  name: string;
  proof?: string;
}

interface SkillsTabProps {
  skills: Skill[];
  avatarUrl?: string;
  ensName: string;
  ownerAddress: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ 
  skills,
  avatarUrl,
  ensName,
  ownerAddress
}) => {
  const { toast } = useToast();
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [localSkills, setLocalSkills] = useState<Skill[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    setIsOwner(connectedWallet && ownerAddress && 
      connectedWallet.toLowerCase() === ownerAddress.toLowerCase());
      
    // Load user skills from localStorage if they exist
    try {
      const savedSkills = JSON.parse(localStorage.getItem(`skills_${ownerAddress}`) || 'null');
      if (savedSkills) {
        setLocalSkills(savedSkills);
      } else if (isOwner && skills && skills.length > 0) {
        setLocalSkills(skills);
      } else {
        setLocalSkills([]);
      }
    } catch (error) {
      console.error('Error loading skills from localStorage:', error);
    }
  }, [skills, ownerAddress, isOwner]);
  
  const handleAddSkill = (skillName: string) => {
    const newSkill = { name: skillName };
    const updatedSkills = [...localSkills, newSkill];
    setLocalSkills(updatedSkills);
    
    // If this is the user's own profile, store skills in localStorage
    if (isOwner) {
      localStorage.setItem(`skills_${ownerAddress}`, JSON.stringify(updatedSkills));
    }
    
    setShowAddSkill(false);
  };
  
  const handleDeleteSkill = (index: number) => {
    const updatedSkills = localSkills.filter((_, i) => i !== index);
    setLocalSkills(updatedSkills);
    
    // If this is the user's own profile, update localStorage
    if (isOwner) {
      localStorage.setItem(`skills_${ownerAddress}`, JSON.stringify(updatedSkills));
    }
    
    toast({
      title: "Skill Removed",
      description: "The skill has been removed from your profile",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Skills</CardTitle>
        </div>
        
        {isOwner && (
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto" 
            onClick={() => setShowAddSkill(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {localSkills && localSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {localSkills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-sm py-2 px-3 flex items-center gap-2"
              >
                {skill.name}
                {isOwner && (
                  <button 
                    onClick={() => handleDeleteSkill(index)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    aria-label="Delete skill"
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Connect wallet to add skills
          </div>
        )}
      </CardContent>
      
      <Dialog open={showAddSkill} onOpenChange={setShowAddSkill}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Skill</DialogTitle>
          </DialogHeader>
          <AddSkillForm 
            onAddSkill={handleAddSkill}
            onCancel={() => setShowAddSkill(false)} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SkillsTab;
