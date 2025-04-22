
import React from 'react';
import { SendHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';

interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount: number | null;
}

const TransactionsBadge: React.FC<TransactionsBadgeProps> = ({ txCount, onClick, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-300/20 to-blue-100/10">
        <SendHorizontal className="h-8 w-8 text-blue-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Transactions</h3>
          <div className="text-3xl font-bold text-blue-600">{txCount || 'N/A'}</div>
          <p className="text-sm text-gray-600">Total Sent</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsBadge;
