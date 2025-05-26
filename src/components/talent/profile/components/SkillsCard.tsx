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
  const {
    score,
    loading: scoreLoading
  } = useScoresData(walletAddress || '');
  const {
    data: blockchainData,
    isLoading: blockchainLoading
  } = useTalentProtocolBlockchainData(walletAddress || '');
  if (!walletAddress) {
    return null;
  }

  // Mock KYC data - replace with actual API call to check user's verified status
  const kycVerifications = [{
    provider: 'Binance',
    status: 'Verified',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png'
  }, {
    provider: 'Coinbase',
    status: 'Verified',
    icon: 'https://companieslogo.com/img/orig/COIN-a63dbab3.png?t=1720244491'
  }];

  // Only show this section if user has KYC verifications
  const hasKycVerifications = kycVerifications.length > 0;
  if (!hasKycVerifications && !score) {
    return null;
  }
  const sectionClass = "rounded-lg bg-white shadow-sm border border-gray-200 mt-4";
  return <>
      {/* KYC Section */}
      {hasKycVerifications}

      {/* Builder Score Section */}
      {score}

      {/* Blockchain Skills Section */}
      {blockchainData}
    </>;
};
export default SkillsCard;