
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins } from 'lucide-react';
import { ScoreBadgeProps } from './types';

interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount: number | null;
  walletAddress: string;
  buttonText?: string;
}

const TransactionsBadge: React.FC<TransactionsBadgeProps> = ({ 
  txCount, 
  onClick, 
  isLoading, 
  walletAddress,
  buttonText = "NFTs" 
}) => {
  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-yellow-800 h-full">
        <div className="flex items-center justify-center gap-2">
          <Coins className="h-5 w-5 text-white" />
          <div className="text-white text-lg font-semibold">{buttonText}</div>
        </div>
        <div className="text-center w-full mt-2">
          <div className="text-3xl font-bold text-white">{txCount || '0'}</div>
          <p className="text-sm text-white/80">Total Transactions</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsBadge;
