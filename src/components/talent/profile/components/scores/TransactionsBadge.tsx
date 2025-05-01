
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { Shapes, Info } from 'lucide-react';

interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount: number | null;
  walletAddress: string;
}

const TransactionsBadge: React.FC<TransactionsBadgeProps> = ({ txCount, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-300/20 to-blue-100/10 h-full">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Shapes className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-700">NFTs</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {txCount !== null ? txCount : 'N/A'}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>View NFT Gallery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsBadge;
