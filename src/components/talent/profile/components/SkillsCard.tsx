import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScoresData } from '@/hooks/useScoresData';
import { Skeleton } from '@/components/ui/skeleton';
import { useTalentProtocolBlockchainData } from '@/hooks/useTalentProtocolBlockchainData';
interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{
    name: string;
    proof?: string;
  }>;
  passportId?: string;
}

const SkillsCard: React.FC<SkillsCardProps> = ({
  walletAddress,
  skills,
  passportId
}) => {
  // Component simplified for speed optimization
  return null;
};

export default SkillsCard;
