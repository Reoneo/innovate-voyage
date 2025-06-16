import React from 'react';
import { Activity, ExternalLink, Clock, DollarSign, Send } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { Skeleton } from '@/components/ui/skeleton';

interface BlockchainDialogContentProps {
  walletAddress: string;
}

const BlockchainDialogContent: React.FC<BlockchainDialogContentProps> = ({ walletAddress }) => {
  const { data, loading } = useBlockchainActivity(walletAddress);

  return (
    <>
      <DialogHeader className="border-b border-gray-200 pb-3">
        <DialogTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          Blockchain Activity
        </DialogTitle>
        <DialogDescription>A summary of on-chain activity for this address.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  First Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data.firstTransaction || 'N/A'}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Date of first on-chain activity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  ETH Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data.ethBalance || '0.0000'} ETH
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Current Ethereum balance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="h-5 w-5 text-purple-500" />
                  Outgoing Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {data.outgoingTransactions ?? 0}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Total transactions sent
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            asChild
          >
            <a 
              href={`https://etherscan.io/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} /> View on Etherscan
            </a>
          </Button>
        </div>
      </div>
    </>
  );
};

export default BlockchainDialogContent;
