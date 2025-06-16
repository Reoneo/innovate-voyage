
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { RefreshCw, Activity } from 'lucide-react';

interface BlockchainActivityBadgeProps extends ScoreBadgeProps {
  walletAddress: string;
}

const BlockchainActivityBadge: React.FC<BlockchainActivityBadgeProps> = ({
  walletAddress,
  onClick
}) => {
  const {
    data,
    loading,
    refetch
  } = useBlockchainActivity(walletAddress);

  const hasEmptyData = !data.firstTransaction || 
                      data.ethBalance === '0.0000' || 
                      data.ethBalance === null ||
                      data.outgoingTransactions === 0 ||
                      data.outgoingTransactions === null;

  if (loading) {
    return <Skeleton className="h-16 w-full rounded-lg" />;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
        <div className="flex-shrink-0">
          <Activity className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">Activity</div>
          <div className="text-xs text-gray-500 truncate">
            {data.outgoingTransactions ?? 0} transactions
          </div>
        </div>
        {hasEmptyData && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              refetch();
            }}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BlockchainActivityBadge;
