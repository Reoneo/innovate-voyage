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
    return <Skeleton className="h-32 w-full rounded-2xl bg-lime-400" />;
  }
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return <div onClick={handleClick} className="cursor-pointer group transition-transform duration-200">
      <div className="flex flex-col items-center gap-2 p-6 bg-white/95 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 w-full min-h-[120px] transition-all">
        <div className="text-center w-full">
          <div className="text-2xl font-bold text-primary mb-2 group-hover:text-purple-600 transition-colors">
            {data.outgoingTransactions ?? 0}
          </div>
          <p className="text-gray-500 font-medium text-sm">Tx</p>
        </div>
        {hasEmptyData && <button onClick={e => {
        e.stopPropagation();
        refetch();
      }} className="mt-2 inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition" title="Refresh data">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>}
      </div>
    </div>;
};
export default BlockchainActivityBadge;