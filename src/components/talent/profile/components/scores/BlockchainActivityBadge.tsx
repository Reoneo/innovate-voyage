
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { RefreshCw } from 'lucide-react';
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
    return <Skeleton className="h-16 w-full rounded-2xl" />;
  }
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-full h-32 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-xl hover:bg-gray-50 focus:outline-none gap-2"
      style={{ minWidth: 0 }}
    >
      <div className="text-lg font-semibold text-gray-900">Activity</div>
      <div className="text-xs text-gray-600">{data.outgoingTransactions ?? 0} transactions</div>
      {hasEmptyData && (
        <button 
          type="button"
          onClick={e => {
            e.stopPropagation();
            refetch();
          }}
          className="mt-2 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200"
          title="Refresh data"
        >
          <RefreshCw className="inline h-4 w-4 mr-1" />
          Refresh
        </button>
      )}
    </button>
  );
};
export default BlockchainActivityBadge;
