
import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AddSkillForm from '../components/AddSkillForm';
import { useToast } from '@/hooks/use-toast';

interface Skill {
  name: string;
  proof?: string;
  level?: string;
  verified?: boolean;
}

export interface BlockchainSkill {
  name: string;
  source: string;
  timestamp: number;
}

interface SkillsTabProps {
  skills: Skill[];
  blockchain_skills?: BlockchainSkill[];
  ensName?: string;
  address?: string;
  isOwner?: boolean;
  ownerAddress?: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, blockchain_skills, isOwner, ownerAddress }) => {
  const [showForm, setShowForm] = useState(false);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [blockchainSkills, setBlockchainSkills] = useState<BlockchainSkill[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (skills) {
      setUserSkills(skills);
    }
    
    if (blockchain_skills) {
      setBlockchainSkills(blockchain_skills);
    }
  }, [skills, blockchain_skills]);

  // Handle adding a new skill
  const handleAddSkill = (skillName: string) => {
    const newSkill: Skill = {
      name: skillName,
      verified: false,
    };
    
    setUserSkills([...userSkills, newSkill]);
    
    // Hide form after adding
    setShowForm(false);
    
    // Show success message
    toast({
      title: "Skill Added",
      description: "Your skill has been added successfully",
    });

    // Save to localStorage
    if (ownerAddress) {
      const storageKey = `user_skills_${ownerAddress}`;
      const savedSkills = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...savedSkills, newSkill]));
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...userSkills];
    updatedSkills.splice(index, 1);
    setUserSkills(updatedSkills);
    
    // Save to localStorage
    if (ownerAddress) {
      const storageKey = `user_skills_${ownerAddress}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedSkills));
    }
    
    toast({
      title: "Skill Removed",
      description: "The skill has been removed from your profile",
    });
  };

  // Function to organize skills by category
  const organizeSkillsByCategory = () => {
    const categories: Record<string, Skill[]> = {
      'Technical': [],
      'Blockchain': [],
      'Design': [],
      'Management': [],
      'Soft Skills': [],
      'Other': []
    };
    
    userSkills.forEach(skill => {
      const name = skill.name.toLowerCase();
      if (name.includes('solidity') || name.includes('web3') || name.includes('blockchain') || 
          name.includes('crypto') || name.includes('nft') || name.includes('token')) {
        categories['Blockchain'].push(skill);
      } else if (name.includes('react') || name.includes('javascript') || name.includes('python') || 
                name.includes('code') || name.includes('dev') || name.includes('programming')) {
        categories['Technical'].push(skill);
      } else if (name.includes('design') || name.includes('ui') || name.includes('ux') || 
                name.includes('graphic') || name.includes('illustration')) {
        categories['Design'].push(skill);
      } else if (name.includes('manage') || name.includes('lead') || name.includes('project') || 
                name.includes('agile') || name.includes('scrum')) {
        categories['Management'].push(skill);
      } else if (name.includes('communication') || name.includes('teamwork') || 
                name.includes('collaboration') || name.includes('critical')) {
        categories['Soft Skills'].push(skill);
      } else {
        categories['Other'].push(skill);
      }
    });
    
    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });
    
    return categories;
  };

  const skillCategories = organizeSkillsByCategory();

  // Get blockchain verified skills
  const getBlockchainSkills = () => {
    return blockchainSkills.map(skill => ({
      name: skill.name,
      source: skill.source,
      verified: true
    }));
  };

  // Render the content
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Skills you've added to your profile</CardDescription>
            </div>
            {isOwner && (
              <Button 
                size="sm" 
                onClick={() => setShowForm(true)} 
                className="ml-auto flex gap-1"
                disabled={showForm}
              >
                <PlusCircle className="h-4 w-4" />
                Add Skill
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <AddSkillForm 
              onAddSkill={handleAddSkill} 
              onCancel={() => setShowForm(false)}
            />
          )}
          
          {!showForm && (
            <div className="space-y-6">
              {Object.keys(skillCategories).length > 0 ? (
                Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <div key={`${skill.name}-${index}`} className="relative group">
                          <Badge variant={skill.verified ? "default" : "outline"} className="py-1">
                            {skill.name}
                            {skill.verified && (
                              <span className="ml-1 text-xs">✓</span>
                            )}
                          </Badge>
                          {isOwner && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 absolute -top-2 -right-2 bg-gray-800 rounded-full hidden group-hover:flex items-center justify-center p-0"
                              onClick={() => handleRemoveSkill(index)}
                            >
                              <X className="h-2.5 w-2.5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-6">No skills added yet</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-gray-500 flex flex-col items-start">
          <p>Skills marked with "✓" are verified through on-chain activity</p>
        </CardFooter>
      </Card>
      
      {blockchainSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Verified Skills</CardTitle>
            <CardDescription>Skills verified through on-chain data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getBlockchainSkills().map((skill, index) => (
                <Badge key={index} className="py-1">
                  {skill.name}
                  <span className="ml-1 text-xs">✓</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillsTab;
