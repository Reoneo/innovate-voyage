
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
      <div className="flex flex-col justify-center items-center gap-2 p-6 bg-gradient-to-br from-blue-50 to-blue-100 h-32 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img 
            src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" 
            alt="Etherscan" 
            className="h-5 w-5"
          />
          <h3 className="text-lg font-semibold text-gray-800">Blockchain Activity</h3>
        </div>
        <div className="text-center text-sm text-gray-600 space-y-0.5">
          <div>First TX: {data.firstTransaction || 'N/A'}</div>
          <div>ETH: {data.ethBalance || '0'}</div>
          <div>TXs: {data.outgoingTransactions ?? 0}</div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainActivityBadge;
