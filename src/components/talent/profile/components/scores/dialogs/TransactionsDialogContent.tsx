
import React from 'react';
import { SendHorizontal, ExternalLink } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TransactionsDialogContentProps {
  txCount: number | null;
  walletAddress: string;
}

const TransactionsDialogContent: React.FC<TransactionsDialogContentProps> = ({ txCount, walletAddress }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[280px]">
        {/* Left side: icon/stat */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#fafdff] via-[#f2f3fa] to-[#eef3fa] p-8 md:border-r border-gray-100">
          <SendHorizontal className="h-14 w-14 text-blue-500 mb-3" />
          <div className="text-lg font-semibold text-blue-700 mb-2">Total Transactions</div>
          <div className="text-5xl font-extrabold text-blue-600 mb-1">{txCount ?? 'N/A'}</div>
          <div className="mt-4 text-xs text-gray-400">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </div>
        {/* Right side: details */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                Transaction History
              </DialogTitle>
              <DialogDescription>
                Historical transaction data
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="text-sm">
            View a summary of your transactions for this wallet. Transaction counts reflect your on-chain engagement and activity.
            <div className="mt-4">
              <a 
                href={`https://etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-[15px] font-medium"
              >
                View on Etherscan <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsDialogContent;
