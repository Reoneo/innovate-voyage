
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScoresData } from '@/hooks/useScoresData';
import { Skeleton } from '@/components/ui/skeleton';
import { useTalentProtocolBlockchainData } from '@/hooks/useTalentProtocolBlockchainData';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
  passportId?: string;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills, passportId }) => {
  const { score, loading: scoreLoading } = useScoresData(walletAddress || '');
  const { data: blockchainData, isLoading: blockchainLoading } = useTalentProtocolBlockchainData(walletAddress || '');

  if (!walletAddress) {
    return null;
  }

  // Mock KYC data - replace with actual API call to check user's verified status
  const kycVerifications = [
    {
      provider: 'Binance',
      status: 'Verified',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png'
    },
    {
      provider: 'Coinbase',
      status: 'Verified', 
      icon: 'https://companieslogo.com/img/orig/COIN-a63dbab3.png?t=1720244491'
    }
  ];

  // Only show this section if user has KYC verifications
  const hasKycVerifications = kycVerifications.length > 0;

  if (!hasKycVerifications && !score) {
    return null;
  }

  const sectionClass = "rounded-lg bg-white shadow-sm border border-gray-200 mt-4";

  return (
    <>
      {/* KYC Section */}
      {hasKycVerifications && (
        <section id="kyc-section" className={sectionClass}>
          <CardHeader className="pb-2 bg-transparent border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-gray-800 text-sm font-semibold">
              <img 
                src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1748210400000&signature=NS2Qh4ukZwhE19Jb9ufCbfIDtsXaB26f5pDNt9mzVho&downloadName=logomark_dark.jpg" 
                className="h-4 w-4" 
                alt="KYC" 
              />
              KYC
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-1">
            {kycVerifications.map((kyc, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <img 
                    src={kyc.icon} 
                    alt={kyc.provider} 
                    className="w-3 h-3"
                  />
                  <span className="text-xs text-gray-700">{kyc.provider}</span>
                </div>
                <span className="text-xs font-bold text-green-600">{kyc.status}</span>
              </div>
            ))}
          </CardContent>
        </section>
      )}

      {/* Builder Score Section */}
      {score && (
        <section id="builder-score-section" className={sectionClass}>
          <CardHeader className="pb-2 bg-transparent border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-gray-800 text-sm font-semibold">
              <img 
                src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1748210400000&signature=NS2Qh4ukZwhE19Jb9ufCbfIDtsXaB26f5pDNt9mzVho&downloadName=logomark_dark.jpg" 
                className="h-4 w-4" 
                alt="Builder Score" 
              />
              Builder Score
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            {scoreLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{score}</div>
              </div>
            )}
          </CardContent>
        </section>
      )}

      {/* Blockchain Skills Section */}
      {blockchainData && (
        <section id="blockchain-skills-section" className={sectionClass}>
          <CardHeader className="pb-2 bg-transparent border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-gray-800 text-sm font-semibold">
              <img 
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040" 
                className="h-4 w-4" 
                alt="Blockchain Skills" 
              />
              Blockchain Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-1">
            {blockchainLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-700">Contracts Deployed (Testnet)</span>
                  <span className="text-xs font-bold text-gray-900">{blockchainData.contractsDeployedTestnet}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-700">Active Smart Contracts</span>
                  <span className="text-xs font-bold text-gray-900">{blockchainData.activeSmartContracts}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-700">Contracts Deployed (Mainnet)</span>
                  <span className="text-xs font-bold text-gray-900">{blockchainData.contractsDeployedMainnet}</span>
                </div>
              </div>
            )}
          </CardContent>
        </section>
      )}
    </>
  );
};

export default SkillsCard;
