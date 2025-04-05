
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  if (!walletAddress) {
    return null;
  }

  // Filter out the mock TalentProtocol skills
  const filteredSkills = skills.filter(skill => 
    !skill.proof?.includes('talentprotocol.com')
  );

  return (
    <Card id="skills-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <img 
                src="https://pbs.twimg.com/profile_images/1838579348086882305/KEjwEWVa_400x400.jpg" 
                alt="Skills Logo" 
                className="h-5 w-5 rounded-full"
              />
              Skills
            </CardTitle>
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
      </CardHeader>
      <CardContent>
        {filteredSkills && filteredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredSkills.map((skill, index) => (
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
