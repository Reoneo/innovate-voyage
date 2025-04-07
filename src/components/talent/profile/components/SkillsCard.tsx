
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

// Define types for the API response
interface TalentProtocolSkill {
  id: number;
  name: string;
}

interface TalentProtocolApiResponse {
  data: TalentProtocolSkill[];
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  const [talentSkills, setTalentSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTalentSkills = async () => {
      setIsLoading(true);
      try {
        // Using the provided API token for authorization
        const response = await fetch('https://api.talentprotocol.com/api/v2/skills?verified=true', {
          headers: {
            'Authorization': 'Bearer 2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f'
          }
        });
        
        if (response.ok) {
          const data = await response.json() as TalentProtocolApiResponse;
          
          // Extract skill names from the response with proper type checking
          const skillNames = data?.data?.map((skill: TalentProtocolSkill) => skill.name) || [];
          
          // Remove duplicates
          const uniqueSkills = [...new Set(skillNames)];
          setTalentSkills(uniqueSkills);
          
          // Log the response for debugging
          console.log('TalentProtocol API response:', data);
          console.log('Extracted skills:', uniqueSkills);
        } else {
          console.error('Failed to fetch skills from TalentProtocol:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching TalentProtocol skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentSkills();
  }, [walletAddress]);

  if (!walletAddress) {
    return null;
  }

  // Filter out the mock TalentProtocol skills
  const filteredSkills = skills.filter(skill => 
    !skill.proof?.includes('talentprotocol.com')
  );

  // Create skill objects from TalentProtocol API
  const talentProtocolSkills = talentSkills.map(skillName => ({
    name: skillName,
    proof: 'https://talentprotocol.com'
  }));

  // Combine skills
  const allSkills = [...filteredSkills, ...talentProtocolSkills];

  return (
    <Card id="skills-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <img src="https://world-id-assets.com/app_51fb239afc33541eb0a5cf76aaeb67bb/59c4ed38-f2ec-4362-af2c-17a196365fca.png" className="h-6 w-6" alt="Talent Protocol" />
              Skills
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-2">
            <p className="text-muted-foreground text-sm">Loading skills...</p>
          </div>
        ) : allSkills && allSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, index) => (
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
