
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Briefcase } from 'lucide-react';
import { useWeb3WorkExperience } from '@/hooks/useWeb3WorkExperience';
import { useBlockchainProfile, useLatestTransactions } from '@/hooks/useEtherscan';

interface VerifiedWorkExperienceProps {
  walletAddress?: string;
}

const VerifiedWorkExperience: React.FC<VerifiedWorkExperienceProps> = ({ walletAddress }) => {
  const { experience } = useWeb3WorkExperience(walletAddress);
  const { data: blockchainProfile, isLoading: loadingProfile } = useBlockchainProfile(walletAddress);
  const { data: transactions } = useLatestTransactions(walletAddress, 10);

  if (!walletAddress) {
    return null;
  }

  return (
    <div id="verified-work-experience-section" className="bg-background/50 backdrop-blur-sm rounded-lg p-6">
      <div className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://cdn.cdnlogo.com/logos/e/39/ethereum.svg" alt="Ethereum" className="h-6 w-6" />
            <div>
              <CardTitle>Blockchain Experience</CardTitle>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {loadingProfile ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blockchainProfile ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-lg p-4 bg-background/30 backdrop-blur-sm">
                <div className="mb-2">
                  <h3 className="font-medium">Transactions Sent</h3>
                </div>
                <p className="text-2xl font-bold">{blockchainProfile.transactionCount || 'Unknown'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Unable to load blockchain data for this address
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifiedWorkExperience;
