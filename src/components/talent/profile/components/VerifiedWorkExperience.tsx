
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileSymlink, Clock, ExternalLink, Briefcase } from 'lucide-react';
import { useWeb3WorkExperience } from '@/hooks/useWeb3WorkExperience';
import { useBlockchainProfile, useLatestTransactions } from '@/hooks/useEtherscan';
import { format } from 'date-fns';

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

  // Calculate wallet age if we have transaction data
  const getWalletAge = () => {
    if (!transactions || transactions.length === 0) return 'Unknown';
    
    // Sort transactions by timestamp
    const sortedTransactions = [...transactions].sort((a, b) => 
      parseInt(a.timeStamp) - parseInt(b.timeStamp)
    );
    
    // Get the oldest transaction timestamp
    const oldestTimestamp = parseInt(sortedTransactions[0].timeStamp) * 1000;
    const oldestDate = new Date(oldestTimestamp);
    
    // Get the difference in days
    const diffTime = Math.abs(new Date().getTime() - oldestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days old`;
  };

  return (
    <Card id="verified-work-experience-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://cdn.cdnlogo.com/logos/e/39/ethereum.svg" alt="Ethereum" className="h-8 w-8" />
            <div>
              <CardTitle>Blockchain Experience</CardTitle>
              <CardDescription className="flex items-center gap-1">
                Verified via{" "}
                <a 
                  href={`https://etherscan.io/address/${walletAddress}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  Etherscan.io
                </a>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loadingProfile ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blockchainProfile ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Wallet Age</h3>
                </div>
                <p className="text-2xl font-bold">{getWalletAge()}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileSymlink className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Total Transactions</h3>
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
      </CardContent>
    </Card>
  );
};

export default VerifiedWorkExperience;
