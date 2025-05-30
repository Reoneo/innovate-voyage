
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlockchainProfile, useLatestTransactions } from '@/hooks/useEtherscan';
import { Calendar, Coins, Activity, ArrowUpDown } from 'lucide-react';

interface BlockchainActivitySectionProps {
  walletAddress?: string;
}

const BlockchainActivitySection: React.FC<BlockchainActivitySectionProps> = ({ walletAddress }) => {
  const { data: blockchainProfile, isLoading: loadingProfile } = useBlockchainProfile(walletAddress);
  const { data: transactions, isLoading: loadingTransactions } = useLatestTransactions(walletAddress, 10);

  if (!walletAddress) return null;

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatEther = (wei: string) => {
    const ether = parseFloat(wei) / 1e18;
    return ether.toFixed(4);
  };

  const getFirstTransaction = () => {
    if (!transactions || transactions.length === 0) return null;
    return transactions[transactions.length - 1]; // Last item is the oldest
  };

  const firstTx = getFirstTransaction();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Blockchain Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loadingProfile || loadingTransactions ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Coins className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">ETH Balance</span>
                </div>
                <div className="text-lg font-bold">{blockchainProfile?.balance || '0'} ETH</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ArrowUpDown className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Transactions</span>
                </div>
                <div className="text-lg font-bold">{blockchainProfile?.transactionCount || 0}</div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">First Transaction</span>
                </div>
                <div className="text-sm font-bold">
                  {firstTx ? formatDate(firstTx.timeStamp) : 'No data'}
                </div>
              </div>
            </div>

            {/* First Transaction Details */}
            {firstTx && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  First Ethereum Transaction
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{formatDate(firstTx.timeStamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-medium">{formatEther(firstTx.value)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant={firstTx.from.toLowerCase() === walletAddress.toLowerCase() ? "destructive" : "default"}>
                      {firstTx.from.toLowerCase() === walletAddress.toLowerCase() ? 'Sent' : 'Received'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hash:</span>
                    <a 
                      href={`https://etherscan.io/tx/${firstTx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      {firstTx.hash.substring(0, 10)}...{firstTx.hash.substring(firstTx.hash.length - 8)}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity Summary */}
            {transactions && transactions.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last 10 transactions:</span>
                    <span className="font-medium">{transactions.length} found</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Most recent:</span>
                    <span className="font-medium">{formatDate(transactions[0].timeStamp)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network experience:</span>
                    <Badge variant="secondary">
                      {blockchainProfile && blockchainProfile.transactionCount > 100 ? 'Experienced' : 
                       blockchainProfile && blockchainProfile.transactionCount > 10 ? 'Intermediate' : 'Beginner'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* No data state */}
            {(!transactions || transactions.length === 0) && !loadingTransactions && (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No transaction history found for this address</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainActivitySection;
