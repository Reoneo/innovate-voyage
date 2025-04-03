
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileSymlink, Clock, CreditCard, Coins, DatabaseIcon } from 'lucide-react';
import { useWeb3WorkExperience } from '@/hooks/useWeb3WorkExperience';
import { useBlockchainProfile, useLatestTransactions, useTokenTransfers } from '@/hooks/useEtherscan';
import { format } from 'date-fns';

interface VerifiedWorkExperienceProps {
  walletAddress?: string;
}

const VerifiedWorkExperience: React.FC<VerifiedWorkExperienceProps> = ({ walletAddress }) => {
  const { experience } = useWeb3WorkExperience(walletAddress);
  const { data: blockchainProfile, isLoading: loadingProfile } = useBlockchainProfile(walletAddress);
  const { data: transactions } = useLatestTransactions(walletAddress, 10);
  const { data: tokenTransfers } = useTokenTransfers(walletAddress, 10);

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
    
    if (diffDays > 365) {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} old`;
    }
    
    return `${diffDays} day${diffDays > 1 ? 's' : ''} old`;
  };

  // Calculate total NFTs from token transfers
  const getTotalNFTs = () => {
    if (!tokenTransfers) return 0;
    
    // Filter for ERC-721 and ERC-1155 tokens (common NFT standards)
    // This is a simplified approach; production code would need more detailed logic
    const nftTransfers = tokenTransfers.filter(transfer => 
      transfer.tokenSymbol && 
      (transfer.tokenSymbol.includes('NFT') || 
       parseInt(transfer.tokenDecimal) === 0 || 
       transfer.contractAddress.toLowerCase() === '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85') // ENS NFTs
    );
    
    return nftTransfers.length;
  };

  return (
    <Card id="verified-work-experience-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Blockchain Experience</CardTitle>
              <CardDescription>On-chain verified activity</CardDescription>
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
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Total NFTs</h3>
                </div>
                <p className="text-2xl font-bold">{getTotalNFTs()}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">ETH Balance</h3>
                </div>
                <p className="text-2xl font-bold">{blockchainProfile.balance || '0'} ETH</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Work History</h3>
              {experience && experience.length > 0 ? (
                <div className="space-y-4">
                  {experience.map((job, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{job.role}</h3>
                            {job.verified ? (
                              <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600">
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-600">
                                Pending
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{job.start_date} - {job.end_date || 'Present'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {job.description && (
                        <p className="text-sm whitespace-pre-wrap mt-2">{job.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    No verified work history found. Connect your wallet to add your work experience.
                  </p>
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
