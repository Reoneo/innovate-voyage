
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListChecks, ExternalLink } from 'lucide-react';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  if (!walletAddress) {
    return null;
  }

  return (
    <Card id="skills-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
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
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant={skill.proof ? "default" : "outline"} 
                className={skill.proof ? "bg-green-500 hover:bg-green-600" : "text-gray-600 border-gray-400"}>
                {skill.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No verified skills found. Connect your wallet to add your skills.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
