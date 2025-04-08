
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlockchainProfile, useLatestTransactions } from '@/hooks/useEtherscan';

interface VerifiedWorkExperienceProps {
  walletAddress?: string;
}

const VerifiedWorkExperience: React.FC<VerifiedWorkExperienceProps> = ({ walletAddress }) => {
  const { data: blockchainProfile, isLoading: loadingProfile } = useBlockchainProfile(walletAddress);
  const { data: transactions } = useLatestTransactions(walletAddress, 10);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Find first and latest transactions
  const latestTransaction = transactions && transactions.length > 0 ? transactions[0] : null;
  const firstTransaction = transactions && transactions.length > 0 ? transactions[transactions.length - 1] : null;

  if (!walletAddress) {
    return null;
  }

  return (
    <Card id="verified-work-experience-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://cdn.cdnlogo.com/logos/e/39/ethereum.svg" alt="Ethereum" className="h-6 w-6" />
            <div>
              <CardTitle>Blockchain Experience</CardTitle>
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
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">TRANSACTIONS SENT</h3>
                <p className="text-2xl font-bold">{blockchainProfile.transactionCount || 'Unknown'}</p>
              </div>
              
              {latestTransaction && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Latest Transaction</h3>
                  <div className="text-sm">
                    <p><span className="font-medium">Date:</span> {formatDate(latestTransaction.timeStamp)}</p>
                    <p><span className="font-medium">Hash:</span> 
                      <a 
                        href={`https://etherscan.io/tx/${latestTransaction.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-1"
                      >
                        {latestTransaction.hash.substring(0, 10)}...{latestTransaction.hash.substring(latestTransaction.hash.length - 8)}
                      </a>
                    </p>
                  </div>
                </div>
              )}
              
              {firstTransaction && firstTransaction !== latestTransaction && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">First Transaction</h3>
                  <div className="text-sm">
                    <p><span className="font-medium">Date:</span> {formatDate(firstTransaction.timeStamp)}</p>
                    <p><span className="font-medium">Hash:</span> 
                      <a 
                        href={`https://etherscan.io/tx/${firstTransaction.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-1"
                      >
                        {firstTransaction.hash.substring(0, 10)}...{firstTransaction.hash.substring(firstTransaction.hash.length - 8)}
                      </a>
                    </p>
                  </div>
                </div>
              )}
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
