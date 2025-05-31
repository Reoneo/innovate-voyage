
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { Calendar, Coins, ArrowUpRight } from 'lucide-react';

interface BlockchainActivitySectionProps {
  walletAddress: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const BlockchainActivitySection: React.FC<BlockchainActivitySectionProps> = ({ 
  walletAddress,
  onClick,
  isLoading = false
}) => {
  const { data, loading, hasData } = useBlockchainActivity(walletAddress);

  console.log('BlockchainActivitySection render state:', {
    walletAddress,
    loading,
    hasData,
    data
  });

  if (loading || isLoading) {
    console.log('Showing loading state for blockchain activity');
    return (
      <Card className="w-full h-32 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="w-full h-32 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
      onClick={onClick}
    >
      <CardContent className="p-6 flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <img 
              src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" 
              alt="Etherscan" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Blockchain Activity
            </h3>
            <div className="text-sm text-gray-600">
              {hasData ? (
                <div className="space-y-1">
                  {data.firstTransaction && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Since {data.firstTransaction}</span>
                    </div>
                  )}
                  {data.ethBalance && (
                    <div className="flex items-center gap-2">
                      <Coins className="h-3 w-3" />
                      <span>{data.ethBalance} ETH</span>
                    </div>
                  )}
                </div>
              ) : (
                <span>Loading activity data...</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <ArrowUpRight className="h-5 w-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainActivitySection;
