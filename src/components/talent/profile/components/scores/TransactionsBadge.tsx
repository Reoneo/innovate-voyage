
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityIcon } from 'lucide-react';
import type { ScoreBadgeProps } from './types';

interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount: number | null;
  walletAddress: string;
}

const TransactionsBadge: React.FC<TransactionsBadgeProps> = ({ 
  txCount, 
  walletAddress,
  onClick, 
  isLoading 
}) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-300/20 to-blue-100/10 h-full">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-gray-700">NFTs</h3>
          <div className="text-3xl font-bold text-blue-700">
            View
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <ActivityIcon className="h-4 w-4" />
            <span>{txCount !== null ? `${txCount} Transactions` : 'Browse NFTs'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsBadge;
