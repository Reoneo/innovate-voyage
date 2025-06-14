
import React from 'react';
import { SendHorizontal, ExternalLink } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface TransactionsDialogContentProps {
  txCount: number | null;
  walletAddress: string;
}

const TransactionsDialogContent: React.FC<TransactionsDialogContentProps> = ({ txCount, walletAddress }) => {
  return (
    <>
      <DialogHeader className="border-b border-gray-700 pb-3">
        <DialogTitle className="flex items-center gap-2 text-white">
          <SendHorizontal className="h-5 w-5 text-gray-400" />
          Transaction History
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Historical transaction data
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-white">Total Transactions</h3>
              <span className="text-xl font-bold text-white">
                {txCount ?? 'N/A'}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              <a 
                href={`https://etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white hover:underline flex items-center gap-1"
              >
                View on Etherscan <ExternalLink size={14} />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TransactionsDialogContent;
