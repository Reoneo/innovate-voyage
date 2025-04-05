
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

// Define types for the API response
interface TalentProtocolProfile {
  id: number;
  name: string;
  skills: Array<{ id: number; name: string }>;
}

interface TalentProtocolResponse {
  profiles: TalentProtocolProfile[];
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  const [talentSkills, setTalentSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTalentSkills = async () => {
      setIsLoading(true);
      try {
        // Using the v2 API endpoint as requested
        const response = await fetch('https://api.talentprotocol.com/api/v2/profiles', {
          headers: {
            'Authorization': 'Bearer 2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f'
          }
        });
        
        if (response.ok) {
          const data = await response.json() as TalentProtocolResponse;
          
          // Extract skill names from the response with proper typing
          const skillNames: string[] = data.profiles?.flatMap((profile: TalentProtocolProfile) => 
            profile.skills?.map((skill) => skill.name) || []
          ) || [];
          
          // Remove duplicates
          const uniqueSkills = [...new Set(skillNames)];
          setTalentSkills(uniqueSkills);
        } else {
          console.error('Failed to fetch skills from TalentProtocol');
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
              <img src="https://world-id-assets.com/app_51fb239afc33541eb0a5cf76aaeb67bb/59c4ed38-f2ec-4362-af2c-17a196365fca.png" className="h-8 w-8" alt="Talent Protocol" />
              Skills
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              Verified via{" "}
              <a 
                href="https://talentprotocol.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                TalentProtocol.com
                <ExternalLink className="h-3 w-3 ml-0.5" />
              </a>
            </CardDescription>
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
