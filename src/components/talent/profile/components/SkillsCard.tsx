
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

interface TalentProtocolSkill {
  id: string;
  name: string;
  slug: string;
  verified: boolean;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  const [verifiedSkills, setVerifiedSkills] = useState<TalentProtocolSkill[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTalentProtocolSkills = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.talentprotocol.com/api/v1/skills', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch skills from TalentProtocol');
        }

        const data = await response.json();
        setVerifiedSkills(data.skills || []);
      } catch (error) {
        console.error('Error fetching TalentProtocol skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentProtocolSkills();
  }, [walletAddress]);

  // Combine existing skills with TalentProtocol skills
  const allSkills = [
    ...skills,
    ...verifiedSkills.map(skill => ({
      name: skill.name,
      proof: `https://talentprotocol.com/skills/${skill.slug}`,
      verified: true
    }))
  ];

  if (!walletAddress) {
    return null;
  }

  return (
    <Card id="skills-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://pbs.twimg.com/profile_images/1838579348086882305/KEjwEWVa_400x400.jpg" 
              alt="Skills Logo" 
              className="h-7 w-7 rounded-full"
            />
            <div>
              <CardTitle>Skills</CardTitle>
              <CardDescription className="flex items-center gap-1">
                Verified via{" "}
                <a 
                  href="https://talentprotocol.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  TalentProtocol.com
                </a>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Loading skills...</span>
          </div>
        ) : allSkills && allSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, index) => (
              <Badge 
                key={index} 
                variant={skill.proof ? "default" : "outline"} 
                className={skill.proof ? "bg-green-500 hover:bg-green-600" : "text-gray-600 border-gray-400"}
              >
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
