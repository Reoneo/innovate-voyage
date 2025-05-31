
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded"></div>
            Onchain Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Always show the section - don't hide it based on hasData
  console.log('Rendering blockchain activity section with data:', data);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          Onchain Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasData ? (
          <div className="grid gap-4">
            {data.firstTransaction && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>First Transaction:</span>
                </div>
                <span className="text-sm font-medium">{data.firstTransaction}</span>
              </div>
            )}
            
            {data.ethBalance && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  <span>ETH Balance:</span>
                </div>
                <span className="text-sm font-medium">{data.ethBalance} ETH</span>
              </div>
            )}
            
            {data.outgoingTransactions !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Outgoing Transactions:</span>
                </div>
                <span className="text-sm font-medium">{data.outgoingTransactions}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Loading blockchain activity data...
          </div>
        )}
        
        {data.hasBuilderScore && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Data sourced from Talent Protocol
            </p>
          </div>
        )}
        
        {!data.hasBuilderScore && hasData && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Data sourced from Etherscan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainActivitySection;
