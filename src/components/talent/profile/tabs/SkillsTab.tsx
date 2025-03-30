
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddSkillForm from '../components/AddSkillForm';
import { Skill } from '@/lib/utils';

interface SkillsTabProps {
  skills?: string[] | Skill[];
  name?: string;
  avatarUrl?: string;
  ensName?: string;
  ownerAddress: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills: initialSkills = [], name, avatarUrl, ensName, ownerAddress }) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedWalletAddress');
    
    if (connectedAddress && ownerAddress && 
        connectedAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }

    try {
      // First try to load from localStorage
      const savedSkills = JSON.parse(localStorage.getItem(`user_skills_${ownerAddress}`) || '[]');
      
      if (Array.isArray(savedSkills) && savedSkills.length > 0) {
        setSkills(savedSkills);
      } else if (initialSkills.length > 0) {
        // Convert Skill[] to string[] if needed
        const formattedSkills = initialSkills.map((skill) => {
          if (typeof skill === 'string') {
            return skill;
          } else if (typeof skill === 'object' && skill.name) {
            return skill.name;
          }
          return '';
        }).filter(Boolean);
        
        setSkills(formattedSkills);
        localStorage.setItem(`user_skills_${ownerAddress}`, JSON.stringify(formattedSkills));
      }
    } catch (error) {
      console.error('Error loading skills from localStorage:', error);
      if (initialSkills.length > 0) {
        // Convert Skill[] to string[] as a fallback
        const formattedSkills = initialSkills.map((skill) => {
          if (typeof skill === 'string') {
            return skill;
          } else if (typeof skill === 'object' && skill.name) {
            return skill.name;
          }
          return '';
        }).filter(Boolean);
        
        setSkills(formattedSkills);
      }
    }
  }, [ownerAddress, initialSkills]);

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      const newSkills = [...skills, skill];
      setSkills(newSkills);
      localStorage.setItem(`user_skills_${ownerAddress}`, JSON.stringify(newSkills));
    }
    setShowAddSkillForm(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    localStorage.setItem(`user_skills_${ownerAddress}`, JSON.stringify(newSkills));
  };

  if (skills.length === 0 && !showAddSkillForm && !isOwner) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Technical and professional skills</CardDescription>
          </div>
          {isOwner && !showAddSkillForm && (
            <Button variant="outline" size="sm" onClick={() => setShowAddSkillForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAddSkillForm ? (
          <AddSkillForm 
            onAddSkill={handleAddSkill} 
            onCancel={() => setShowAddSkillForm(false)} 
          />
        ) : (
          <>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                    {skill}
                    {isOwner && (
                      <button 
                        onClick={() => handleRemoveSkill(skill)} 
                        className="ml-1 text-muted-foreground hover:text-destructive focus:outline-none"
                        aria-label={`Remove ${skill} skill`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            ) : isOwner ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Add skills to showcase your expertise
                </p>
                <Button onClick={() => setShowAddSkillForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsTab;
