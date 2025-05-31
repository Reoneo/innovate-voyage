
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
interface BlockchainActivityBadgeProps extends ScoreBadgeProps {
  walletAddress: string;
}
const BlockchainActivityBadge: React.FC<BlockchainActivityBadgeProps> = ({
  walletAddress
}) => {
  const {
    data,
    loading
  } = useBlockchainActivity(walletAddress);
  if (loading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
  return <div className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 h-32 rounded-2xl shadow-lg border border-blue-200 px-0 py-0">
      <div className="text-center space-y-2 w-full">
        <div className="flex items-center justify-center gap-2">
          <img src="https://socialbubbles.ae/wp-content/uploads/2024/08/etherscan-image.png" alt="Etherscan" className="h-5 w-5" />
          <h3 className="text-lg font-semibold text-gray-800 px-0 py-[10px]">Onchain Activity</h3>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          {data.firstTransaction ? <div>First TX: {data.firstTransaction}</div> : <div>First TX: N/A</div>}
          {data.ethBalance ? <div>ETH: {data.ethBalance}</div> : <div>ETH: 0</div>}
          <div>Outgoing Transactions: {data.outgoingTransactions ?? 0}</div>
        </div>
      </div>
    </div>;
};
export default BlockchainActivityBadge;
