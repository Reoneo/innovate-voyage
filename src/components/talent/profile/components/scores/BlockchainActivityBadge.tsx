
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';

interface BlockchainActivityBadgeProps extends ScoreBadgeProps {
  walletAddress: string;
}

const BlockchainActivityBadge: React.FC<BlockchainActivityBadgeProps> = ({
  walletAddress,
  onClick,
}) => {
  const { data, loading } = useBlockchainActivity(walletAddress);

  if (loading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 h-full rounded-2xl shadow-lg border border-blue-200">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <img 
              src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" 
              alt="Etherscan" 
              className="h-6 w-6"
            />
            <h3 className="text-lg font-semibold text-gray-800">Blockchain Activity</h3>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            {data.firstTransaction && (
              <div>First TX: {data.firstTransaction}</div>
            )}
            {data.ethBalance && (
              <div>ETH: {data.ethBalance}</div>
            )}
            {data.outgoingTransactions !== null && (
              <div>Outgoing TXs: {data.outgoingTransactions}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainActivityBadge;
