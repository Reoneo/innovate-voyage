
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeb3WorkExperience } from '@/hooks/useWeb3WorkExperience';
import { useBlockchainProfile, useLatestTransactions } from '@/hooks/useEtherscan';

interface VerifiedWorkExperienceProps {
  walletAddress?: string;
}

// Remove Card/box, style with glassy background and no border
const containerClasses = "rounded-xl bg-gradient-to-br from-[#1A1F2C]/80 via-[#7E69AB]/30 to-[#0FA0CE]/20 shadow-[0_2px_10px_#3f397cee,0_0px_0px_#7E69AB00_inset] p-0";

const VerifiedWorkExperience: React.FC<VerifiedWorkExperienceProps> = ({ walletAddress }) => {
  const { experience } = useWeb3WorkExperience(walletAddress);
  const { data: blockchainProfile, isLoading: loadingProfile } = useBlockchainProfile(walletAddress);
  useLatestTransactions(walletAddress, 10); // Kept for data prefetch/side-effect.

  if (!walletAddress) {
    return null;
  }

  return (
    <section id="verified-work-experience-section" className={"mt-4 " + containerClasses}>
      <CardHeader className="pb-2 bg-transparent">
        <CardTitle className="flex items-center gap-2 text-gradient-primary text-lg font-semibold tracking-wide">
          Blockchain Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loadingProfile ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blockchainProfile ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground mb-0.5">Transactions Sent</h3>
              <p className="text-2xl font-bold">{blockchainProfile.transactionCount ?? 'Unknown'}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Unable to load blockchain data for this address
          </div>
        )}
      </CardContent>
    </section>
  );
};

export default VerifiedWorkExperience;
