
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillsList from './skills/SkillsList';
import SkillsLegend from './skills/SkillsLegend';
import { useTalentProtocolSkills } from './skills/useTalentProtocolSkills';
import { useScoresData } from '@/hooks/useScoresData';
import { Skeleton } from '@/components/ui/skeleton';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
  passportId?: string;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills, passportId }) => {
  const { talentSkills, credentialSkills, talentScore, isLoading } = useTalentProtocolSkills(walletAddress, passportId);
  const { score, loading: scoreLoading } = useScoresData(walletAddress || '');

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

  const sectionClass = "rounded-lg bg-white shadow-sm border border-gray-200 mt-4";

  return (
    <section id="skills-card-section" className={sectionClass}>
      <CardHeader className="pb-4 bg-transparent border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-gray-800 text-lg font-semibold">
            <img 
              src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1748210400000&signature=NS2Qh4ukZwhE19Jb9ufCbfIDtsXaB26f5pDNt9mzVho&downloadName=logomark_dark.jpg" 
              className="h-6 w-6" 
              alt="Builder Score" 
            />
            Skills & Builder Score
          </CardTitle>
          {scoreLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-right">
              <div className="text-sm text-gray-600">Builder Score</div>
              <div className="text-lg font-bold text-gray-900">{score || 'N/A'}</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <SkillsList skills={allSkills} isLoading={isLoading} />
        {allSkills && allSkills.length > 0 && <SkillsLegend />}
      </CardContent>
    </section>
  );
};

export default SkillsCard;
