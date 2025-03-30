
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, ListChecks, Grid2x2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';
import AddSkillForm from '../components/AddSkillForm';
import { useToast } from '@/hooks/use-toast';

interface SkillsTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  avatarUrl?: string;
  ensName?: string;
  ownerAddress?: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, name, avatarUrl, ensName, ownerAddress }) => {
  const [userSkills, setUserSkills] = useState(skills);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  // Check if the connected wallet matches the profile address
  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedWalletAddress');
    
    if (connectedAddress && ownerAddress && 
        connectedAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }

    // Load any stored skills from localStorage
    if (ownerAddress) {
      const storageKey = `user_skills_${ownerAddress}`;
      try {
        const savedSkills = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (savedSkills.length > 0) {
          // Combine platform skills with user-added skills
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
      proof: undefined,  // No proof = unverified
      issued_by: undefined
    };
    
    setUserSkills(prevSkills => {
      const existingSkillNames = new Set(prevSkills.map(skill => skill.name));
      // Only add if the skill isn't already there
      if (!existingSkillNames.has(skillName)) {
        const updatedSkills = [...prevSkills, newSkill];
        
        // Save to localStorage for persistence
        try {
          const storageKey = `user_skills_${ownerAddress}`;
          localStorage.setItem(storageKey, JSON.stringify(updatedSkills));
        } catch (error) {
          console.error('Error saving skill to localStorage:', error);
        }
        
        return updatedSkills;
      }
      return prevSkills;
    });
    
    toast({
      title: "Skill added",
      description: `${skillName} has been added to your profile.`
    });
  };

  // Separate verified and unverified skills
  const verifiedSkills = userSkills.filter(skill => skill.proof);
  const unverifiedSkills = userSkills.filter(skill => !skill.proof);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="overflow-hidden">
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
                    <Badge key={`unverified-${index}`} variant="outline" className="text-gray-600 border-gray-400">
                      {skill.name}
                    </Badge>
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
      
      <div className="space-y-8">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  ID Network
                </CardTitle>
                <CardDescription className="mt-1">
                  ENS Domains & Identity connections
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                Interactive
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full pt-4">
              <IdNetworkGraph 
                name={name} 
                avatarUrl={avatarUrl}
                ensName={ensName}
                address={ensName?.includes('.eth') ? undefined : ensName}
              />
            </div>
            <div className="mt-4 border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Legend:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                  <span>Main Identity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-violet-500 mr-1.5"></div>
                  <span>ENS Domain</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-400 mr-1.5"></div>
                  <span>Box Domain</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></div>
                  <span>Other ID Protocol</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isOwner && (
          <AddSkillForm onAddSkill={handleAddSkill} />
        )}
      </div>
    </div>
  );
};

export default SkillsTab;
