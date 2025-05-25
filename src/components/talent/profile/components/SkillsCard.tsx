
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useScoresData } from '@/hooks/useScoresData';
import { Skeleton } from '@/components/ui/skeleton';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
  passportId?: string;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills, passportId }) => {
  const { score, loading: scoreLoading } = useScoresData(walletAddress || '');

  if (!walletAddress) {
    return null;
  }

  // Mock KYC data - in real implementation this would come from API
  const kycVerifications = [
    {
      provider: 'Talent Protocol',
      status: 'Verified',
      icon: 'https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1748210400000&signature=NS2Qh4ukZwhE19Jb9ufCbfIDtsXaB26f5pDNt9mzVho&downloadName=logomark_dark.jpg'
    },
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

  const sectionClass = "rounded-lg bg-white shadow-sm border border-gray-200 mt-4";

  return (
    <section id="kyc-section" className={sectionClass}>
      <CardHeader className="pb-4 bg-transparent border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-gray-800 text-lg font-semibold">
            <img 
              src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1748210400000&signature=NS2Qh4ukZwhE19Jb9ufCbfIDtsXaB26f5pDNt9mzVho&downloadName=logomark_dark.jpg" 
              className="h-6 w-6" 
              alt="KYC" 
            />
            KYC
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
      <CardContent className="space-y-4">
        {/* KYC Verifications */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Verified KYC</h4>
          {kycVerifications.map((kyc, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <img 
                  src={kyc.icon} 
                  alt={kyc.provider} 
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">{kyc.provider}</span>
              </div>
              <span className="text-sm font-bold text-green-600">{kyc.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </section>
  );
};

export default SkillsCard;
