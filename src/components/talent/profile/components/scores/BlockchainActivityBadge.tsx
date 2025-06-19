
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

  const hasEmptyData = !data.firstTransaction || data.ethBalance === '0.0000' || data.ethBalance === null || data.outgoingTransactions === 0 || data.outgoingTransactions === null;

  if (loading) {
    return <Skeleton className="h-20 w-full rounded-lg" />;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer group transition-transform duration-200">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600 group-hover:text-teal-700 transition-colors">
              {data.outgoingTransactions ?? 0}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Transactions
            </p>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Blockchain Activity
            </p>
            <p className="text-xs text-gray-500">
              On-chain interactions
            </p>
          </div>
        </div>
        {hasEmptyData && (
          <button 
            onClick={e => {
              e.stopPropagation();
              refetch();
            }} 
            className="p-2 rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-200 transition"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BlockchainActivityBadge;
