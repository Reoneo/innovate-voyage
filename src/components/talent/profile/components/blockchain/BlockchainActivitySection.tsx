
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { Calendar, Coins, ArrowUpRight } from 'lucide-react';

interface BlockchainActivitySectionProps {
  walletAddress: string;
}

const BlockchainActivitySection: React.FC<BlockchainActivitySectionProps> = ({ 
  walletAddress 
}) => {
  const { data, loading, hasData } = useBlockchainActivity(walletAddress);

  console.log('BlockchainActivitySection render state:', {
    walletAddress,
    loading,
    hasData,
    data
  });

  if (loading) {
    console.log('Showing loading state for blockchain activity');
    return (
      <div className="w-full h-32">
        <Card className="w-full h-32 rounded-2xl shadow-lg border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <img 
                src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" 
                alt="Etherscan" 
                className="w-5 h-5"
              />
              Blockchain Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Always show the section - don't hide it based on hasData
  console.log('Rendering blockchain activity section with data:', data);

  return (
    <div className="w-full h-32">
      <Card className="w-full h-32 rounded-2xl shadow-lg border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <img 
              src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" 
              alt="Etherscan" 
              className="w-5 h-5"
            />
            Blockchain Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 overflow-hidden" style={{ height: 'calc(100% - 70px)' }}>
          {hasData ? (
            <div className="grid gap-2 text-xs">
              {data.firstTransaction && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>First Transaction:</span>
                  </div>
                  <span className="font-medium">{data.firstTransaction}</span>
                </div>
              )}
              
              {data.ethBalance && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Coins className="h-3 w-3" />
                    <span>ETH Balance:</span>
                  </div>
                  <span className="font-medium">{data.ethBalance} ETH</span>
                </div>
              )}
              
              {data.outgoingTransactions !== null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>Outgoing Transactions:</span>
                  </div>
                  <span className="font-medium">{data.outgoingTransactions}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Loading blockchain activity data...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainActivitySection;
