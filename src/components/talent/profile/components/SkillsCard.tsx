
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTalentProtocolSkills } from './skills/useTalentProtocolSkills';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  const { talentScore } = useTalentProtocolSkills(walletAddress);

  if (!walletAddress || !talentScore) {
    return null;
  }

  // Only display verified skills
  const verifiedSkills = skills.filter(skill => skill.proof);

  return (
    <Card id="skills-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <img src="https://world-id-assets.com/app_51fb239afc33541eb0a5cf76aaeb67bb/59c4ed38-f2ec-4362-af2c-17a196365fca.png" className="h-6 w-6" alt="Talent Protocol" />
              Verified Skills
            </CardTitle>
          </div>
          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
            Score: {talentScore} pts
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {verifiedSkills.map((skill, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
