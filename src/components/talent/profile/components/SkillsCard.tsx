
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillsList from './skills/SkillsList';
import SkillsLegend from './skills/SkillsLegend';
import { useTalentProtocolSkills } from './skills/useTalentProtocolSkills';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  const { talentSkills, talentScore, isLoading } = useTalentProtocolSkills(walletAddress);

  if (!walletAddress) {
    return null;
  }

  // Filter out credential skills and TalentProtocol mock skills
  const filteredSkills = skills.filter(skill => 
    !skill.proof?.includes('talentprotocol.com') &&
    !skill.proof?.includes('credentials')
  );

  // Create skill objects from TalentProtocol API
  const talentProtocolSkills = talentSkills.map(skillName => ({
    name: skillName,
    proof: 'https://talentprotocol.com'
  }));

  // Combine all skills without credential skills
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
          {talentScore !== null && (
            <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Score: {talentScore} pts
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <SkillsList skills={allSkills} isLoading={isLoading} />
        
        {allSkills && allSkills.length > 0 && <SkillsLegend />}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
