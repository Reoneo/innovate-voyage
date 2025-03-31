
import React from 'react';
import SkillsTab from '../../tabs/SkillsTab';

interface SkillsOverviewSectionProps {
  skills: Array<{ name: string; proof?: string }>;
  avatarUrl?: string;
  ensName: string;
  ownerAddress: string;
}

const SkillsOverviewSection: React.FC<SkillsOverviewSectionProps> = ({
  skills,
  avatarUrl,
  ensName,
  ownerAddress
}) => {
  return (
    <SkillsTab 
      skills={skills}
      avatarUrl={avatarUrl}
      ensName={ensName}
      ownerAddress={ownerAddress}
    />
  );
};

export default SkillsOverviewSection;
