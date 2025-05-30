
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlockchainProfile, useLatestTransactions } from '@/hooks/useEtherscan';
import { Calendar, Coins, Activity, ArrowUpDown, Clock, Network, TrendingUp } from 'lucide-react';

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

  const getExperienceLevel = () => {
    if (!blockchainProfile) return 'Unknown';
    
    const txCount = blockchainProfile.transactionCount;
    const accountAge = blockchainProfile.accountAge || 0;
    
    if (txCount > 1000 && accountAge > 1095) return 'Expert'; // 3+ years, 1000+ txs
    if (txCount > 500 && accountAge > 730) return 'Advanced'; // 2+ years, 500+ txs
    if (txCount > 100 && accountAge > 365) return 'Intermediate'; // 1+ year, 100+ txs
    if (txCount > 10) return 'Beginner';
    return 'Newcomer';
  };

  const getActivityBadgeColor = () => {
    const level = getExperienceLevel();
    switch (level) {
      case 'Expert': return 'default';
      case 'Advanced': return 'secondary';
      case 'Intermediate': return 'outline';
      default: return 'destructive';
    }
  };

  const formatAccountAge = () => {
    if (!blockchainProfile?.accountAge) return 'Unknown';
    
    const days = blockchainProfile.accountAge;
    if (days > 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      return `${years}y ${Math.floor(remainingDays / 30)}m`;
    }
    if (days > 30) {
      return `${Math.floor(days / 30)} months`;
    }
    return `${days} days`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Blockchain Activity & Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loadingProfile || loadingTransactions ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            {/* Key Professional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Account Age</span>
                </div>
                <div className="text-sm font-bold">{formatAccountAge()}</div>
              </div>

              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Experience Level</span>
                </div>
                <Badge variant={getActivityBadgeColor()} className="text-xs">
                  {getExperienceLevel()}
                </Badge>
              </div>
            </div>

            {/* Multi-chain Activity */}
            {blockchainProfile?.optimismTransactions && blockchainProfile.optimismTransactions.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Multi-chain Experience
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ethereum Mainnet:</span>
                    <span className="font-medium">{blockchainProfile.transactionCount} transactions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Optimism:</span>
                    <span className="font-medium">{blockchainProfile.optimismTransactions.length}+ transactions</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">Multi-chain User</Badge>
                </div>
              </div>
            )}

            {/* First Transaction - Professional Timeline */}
            {blockchainProfile?.firstTransaction && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Blockchain Journey Started
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Transaction:</span>
                    <span className="font-medium">{formatDate(blockchainProfile.firstTransaction.timeStamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Value:</span>
                    <span className="font-medium">{formatEther(blockchainProfile.firstTransaction.value)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Type:</span>
                    <Badge variant={blockchainProfile.firstTransaction.from.toLowerCase() === walletAddress.toLowerCase() ? "destructive" : "default"}>
                      {blockchainProfile.firstTransaction.from.toLowerCase() === walletAddress.toLowerCase() ? 'Sent' : 'Received'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Hash:</span>
                    <a 
                      href={`https://etherscan.io/tx/${blockchainProfile.firstTransaction.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      {blockchainProfile.firstTransaction.hash.substring(0, 10)}...{blockchainProfile.firstTransaction.hash.substring(blockchainProfile.firstTransaction.hash.length - 8)}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Token Activity Summary */}
            {blockchainProfile?.tokenTransfers && blockchainProfile.tokenTransfers.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Token Activity Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recent token transfers:</span>
                    <span className="font-medium">{blockchainProfile.tokenTransfers.length} found</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tokens interacted with:</span>
                    <span className="font-medium">
                      {[...new Set(blockchainProfile.tokenTransfers.map(tx => tx.tokenSymbol))].length} unique tokens
                    </span>
                  </div>
                  <Badge variant="outline">DeFi Experience</Badge>
                </div>
              </div>
            )}

            {/* Professional Summary */}
            <div className="border rounded-lg p-4 bg-blue-50/50 border-blue-200">
              <h4 className="font-medium mb-3 text-blue-900">Professional Blockchain Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• {getExperienceLevel()} blockchain user with {formatAccountAge()} of on-chain experience</p>
                <p>• {blockchainProfile?.transactionCount || 0} total transactions demonstrating active engagement</p>
                {blockchainProfile?.optimismTransactions && blockchainProfile.optimismTransactions.length > 0 && (
                  <p>• Multi-chain experience across Ethereum and Layer 2 solutions</p>
                )}
                {blockchainProfile?.tokenTransfers && blockchainProfile.tokenTransfers.length > 0 && (
                  <p>• DeFi ecosystem participant with token interaction experience</p>
                )}
              </div>
            </div>

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
