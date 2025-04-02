
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, CheckCircle, Coins, ArrowDownUp, Clock } from 'lucide-react';
import { useBlockchainData } from '@/hooks/useBlockchainData';
import { format } from 'date-fns';

interface VerifiedWorkExperienceProps {
  walletAddress?: string;
}

const VerifiedWorkExperience: React.FC<VerifiedWorkExperienceProps> = ({ walletAddress }) => {
  const { 
    transactions, 
    tokenTransfers, 
    blockchainProfile, 
    blockchainExtendedData, 
    loadingBlockchain 
  } = useBlockchainData(walletAddress);

  if (!walletAddress) {
    return null;
  }

  // Calculate wallet age if we have transactions
  const getWalletAge = () => {
    if (transactions && transactions.length > 0) {
      try {
        // Get the earliest transaction timestamp
        const timestamps = transactions.map(tx => parseInt(tx.timeStamp));
        const earliestTimestamp = Math.min(...timestamps);
        const earliestDate = new Date(earliestTimestamp * 1000);
        const now = new Date();
        
        // Calculate the difference in years
        const diffTime = Math.abs(now.getTime() - earliestDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 365) {
          return `${Math.floor(diffDays / 365)} years`;
        } else {
          return `${diffDays} days`;
        }
      } catch (e) {
        return 'Unknown';
      }
    }
    return 'Unknown';
  };

  // Count NFTs from token transfers
  const countNfts = () => {
    if (!tokenTransfers) return 0;
    
    // Look for ERC-721 and ERC-1155 tokens in transfers
    const nftTransfers = tokenTransfers.filter(
      transfer => transfer.tokenName && 
      (transfer.tokenID || parseInt(transfer.value) === 1)
    );
    
    // Get unique NFT contracts
    const uniqueNfts = new Set();
    nftTransfers.forEach(transfer => {
      uniqueNfts.add(`${transfer.contractAddress}-${transfer.tokenID || '0'}`);
    });
    
    return uniqueNfts.size;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blockchain Experience</CardTitle>
            <CardDescription>On-chain activity summary</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loadingBlockchain ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Wallet Age:</span>
              </div>
              <span className="font-medium">{getWalletAge()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Total Transactions:</span>
              </div>
              <span className="font-medium">{transactions?.length || 0}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">ETH Balance:</span>
              </div>
              <span className="font-medium">
                {blockchainProfile?.balance || '0'} ETH
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">NFTs Collected:</span>
              </div>
              <span className="font-medium">{countNfts()}</span>
            </div>
            
            {blockchainExtendedData?.mirrorPosts > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Mirror.xyz Posts:</span>
                </div>
                <span className="font-medium">{blockchainExtendedData.mirrorPosts}</span>
              </div>
            )}
            
            {blockchainExtendedData?.lensActivity > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Lens Activity:</span>
                </div>
                <span className="font-medium">{blockchainExtendedData.lensActivity}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifiedWorkExperience;
