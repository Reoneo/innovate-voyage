
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
  apiKey?: string;
}

interface ApiSkill {
  id: string;
  name: string;
  verified: boolean;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills, apiKey }) => {
  const [verifiedSkills, setVerifiedSkills] = useState<ApiSkill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (apiKey && walletAddress) {
      setIsLoading(true);
      // Fetch skills from TalentProtocol API
      fetch(`https://api.talentprotocol.com/api/v1/skills?address=${walletAddress}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch skills');
          }
          return response.json();
        })
        .then(data => {
          console.log('TalentProtocol skills:', data);
          if (data && Array.isArray(data.skills)) {
            setVerifiedSkills(data.skills);
          }
        })
        .catch(error => {
          console.error('Error fetching skills:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [walletAddress, apiKey]);

  if (!walletAddress) {
    return null;
  }

  // Combine API skills with existing skills
  const combinedSkills = [
    ...verifiedSkills.map(skill => ({ 
      name: skill.name, 
      proof: skill.verified ? 'talentprotocol.com' : undefined 
    })),
    ...skills.filter(skill => 
      !verifiedSkills.some(vs => vs.name.toLowerCase() === skill.name.toLowerCase())
    )
  ];

  return (
    <Card id="skills-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <img 
            src="https://pbs.twimg.com/profile_images/1838579348086882305/KEjwEWVa_400x400.jpg" 
            alt="Skills Logo" 
            className="h-8 w-8 rounded-full"
          />
          <CardTitle>Skills</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : combinedSkills && combinedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {combinedSkills.map((skill, index) => (
              <Badge key={index} variant={skill.proof ? "default" : "outline"} 
                className={skill.proof ? "bg-green-500 hover:bg-green-600" : "text-gray-600 border-gray-400"}>
                {skill.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No verified skills found.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
