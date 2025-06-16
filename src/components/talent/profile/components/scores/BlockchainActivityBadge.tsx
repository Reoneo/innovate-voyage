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
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return <div onClick={handleClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 px-0 py-[10px] my-[2px] hover:shadow-md transition-shadow duration-200 min-h-[120px] w-full">
        <div className="flex items-center justify-center w-full gap-2">
          
        </div>
        <div className="text-center w-full">
          <div className="text-2xl font-bold text-gray-800 mb-1 my-0 leading-none">{data.outgoingTransactions ?? 0}</div>
          <p className="text-gray-500 py-0 font-normal text-sm">Transactions</p>
        </div>
        {hasEmptyData && <button onClick={e => {
        e.stopPropagation();
        refetch();
      }} className="flex-shrink-0 px-2 py-1 mt-2 bg-gray-200 rounded-md hover:bg-gray-300 text-xs text-gray-600 transition-colors" title="Refresh data">
            <RefreshCw className="h-4 w-4 inline-block mr-1" />
            Refresh
          </button>}
      </div>
    </div>;
};
export default BlockchainActivityBadge;