
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillsList from './skills/SkillsList';
import SkillsLegend from './skills/SkillsLegend';
import { useTalentProtocolSkills } from './skills/useTalentProtocolSkills';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
  passportId?: string;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills, passportId }) => {
  const { talentSkills, credentialSkills, talentScore, isLoading } = useTalentProtocolSkills(walletAddress, passportId);

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
  
  // Create skill objects from credential skills
  const credentialProtocolSkills = credentialSkills.map(skillName => ({
    name: skillName,
    proof: 'credentials.talentprotocol.com'
  }));

  // Combine all skills
  const allSkills = [...filteredSkills, ...talentProtocolSkills, ...credentialProtocolSkills];

  // Remove Card border and use futuristic effect
  const sectionClass = "rounded-xl bg-gradient-to-br from-[#1A1F2C]/80 via-[#7E69AB]/30 to-[#0FA0CE]/20 shadow-[0_1px_8px_#7E69AB1f,0_0px_0px_#7E69AB00_inset] mt-4";

  return (
    <section id="skills-card-section" className={sectionClass}>
      <CardHeader className="pb-2 bg-transparent">
        <div>
          <CardTitle className="flex items-center gap-2 text-gradient-primary text-lg font-semibold tracking-wide">
            <img src="https://world-id-assets.com/app_51fb239afc33541eb0a5cf76aaeb67bb/59c4ed38-f2ec-4362-af2c-17a196365fca.png" className="h-6 w-6" alt="Talent Protocol" />
            Skills
          </CardTitle>
        </div>
        {/* Score moved to banner above; not duplicated here */}
      </CardHeader>
      <CardContent>
        <SkillsList skills={allSkills} isLoading={isLoading} />
        {allSkills && allSkills.length > 0 && <SkillsLegend />}
      </CardContent>
    </section>
  );
};

export default SkillsCard;
