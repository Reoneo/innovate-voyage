
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
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <SendHorizontal className="h-5 w-5 text-blue-500" />
          Transaction History
        </DialogTitle>
        <DialogDescription>
          Historical transaction data
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Total Transactions</h3>
              <span className="text-xl font-bold text-blue-500">
                {txCount ?? 'N/A'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <a 
                href={`https://etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1"
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
