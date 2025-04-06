
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, FileSymlink, Clock, ExternalLink, Briefcase, ArrowUpDown } from 'lucide-react';
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

  // Get the first transaction (oldest)
  const getFirstTransaction = () => {
    if (!transactions || transactions.length === 0) return null;
    
    // Sort transactions by timestamp (ascending)
    const sortedTransactions = [...transactions].sort((a, b) => 
      parseInt(a.timeStamp) - parseInt(b.timeStamp)
    );
    
    // Get the oldest transaction
    return sortedTransactions[0];
  };

  // Get the latest transaction
  const getLatestTransaction = () => {
    if (!transactions || transactions.length === 0) return null;
    
    // Sort transactions by timestamp (descending)
    const sortedTransactions = [...transactions].sort((a, b) => 
      parseInt(b.timeStamp) - parseInt(a.timeStamp)
    );
    
    // Get the most recent transaction
    return sortedTransactions[0];
  };

  const firstTx = getFirstTransaction();
  const latestTx = getLatestTransaction();

  // Format transaction date
  const formatTxDate = (timestamp: string) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(parseInt(timestamp) * 1000);
    return format(date, 'MMM d, yyyy');
  };

  // Format transaction hash for display
  const formatTxHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
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
                  <ExternalLink className="h-3 w-3 ml-0.5" />
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
                  <ArrowUpDown className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Transactions Sent</h3>
                </div>
                <p className="text-2xl font-bold">{blockchainProfile.transactionCount || 'Unknown'}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileSymlink className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">First Transaction</h3>
                </div>
                {firstTx ? (
                  <div>
                    <p className="text-xl font-bold">{formatTxDate(firstTx.timeStamp)}</p>
                    <a 
                      href={`https://etherscan.io/tx/${firstTx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {formatTxHash(firstTx.hash)}
                    </a>
                  </div>
                ) : (
                  <p className="text-xl font-bold">Unknown</p>
                )}
              </div>
            </div>
            
            {latestTx && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Latest Transaction</h3>
                </div>
                <div>
                  <p className="text-xl font-bold">{formatTxDate(latestTx.timeStamp)}</p>
                  <a 
                    href={`https://etherscan.io/tx/${latestTx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    {formatTxHash(latestTx.hash)}
                  </a>
                </div>
              </div>
            )}
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
