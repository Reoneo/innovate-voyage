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
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
  return <div onClick={onClick} className="cursor-pointer">
      <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 h-32 rounded-2xl shadow-lg border border-blue-200 px-0 relative py-[20px]">
        <div className="text-center space-y-2 w-full">
          <div className="text-lg font-semibold text-gray-800">
            Activity
          </div>
          <div className="flex items-center justify-center gap-2">
            <img src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" alt="Etherscan" className="h-8 w-8" />
            {hasEmptyData && <button onClick={e => {
            e.stopPropagation();
            refetch();
          }} className="p-1 hover:bg-blue-200 rounded-full transition-colors" title="Refresh data">
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </button>}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            {data.firstTransaction ? <div>First TX: {data.firstTransaction}</div> : <div>First TX: N/A</div>}
          </div>
        </div>
      </div>
    </div>;
};
export default BlockchainActivityBadge;